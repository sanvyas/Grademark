import { supabase } from '@/lib/supabase'
import { isStrictlyBetterGrade, type Grade } from '@/lib/grade'
import type {
  Allergen,
  GradeString,
  Ingredient,
  NutrientProfile,
  PackageClaim,
  ProductAllergen,
  ProductIngredient,
  ProductWithRelations,
  Rating,
  RegulatoryFlags,
  UUID,
} from '@/types/database'

/** PostgREST's "no rows" code for .single()/.maybeSingle() — normalized to null instead of throwing. */
const NOT_FOUND_CODE = 'PGRST116'

function unwrapMaybe<T>(result: { data: T | null; error: { code?: string; message: string } | null }): T | null {
  if (result.error) {
    if (result.error.code === NOT_FOUND_CODE) return null
    throw new Error(result.error.message)
  }
  return result.data
}

function unwrapList<T>(result: { data: T[] | null; error: { message: string } | null }): T[] {
  if (result.error) throw new Error(result.error.message)
  return result.data ?? []
}

export async function getProductByBarcode(barcode: string): Promise<ProductWithRelations | null> {
  const result = await supabase
    .from('products')
    .select('*, brand:brands(*), category:categories(*)')
    .eq('barcode', barcode)
    .maybeSingle()
  return unwrapMaybe<ProductWithRelations>(result)
}

export async function getLatestRating(productId: UUID): Promise<Rating | null> {
  const result = await supabase
    .from('ratings')
    .select('*')
    .eq('product_id', productId)
    .order('rated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return unwrapMaybe<Rating>(result)
}

export async function getRatingHistory(productId: UUID): Promise<Rating[]> {
  const result = await supabase
    .from('ratings')
    .select('*')
    .eq('product_id', productId)
    .order('rated_at', { ascending: false })
  return unwrapList<Rating>(result)
}

export async function getIngredients(productId: UUID): Promise<Ingredient[]> {
  const result = await supabase
    .from('product_ingredients')
    .select('*, ingredient:ingredients(*)')
    .eq('product_id', productId)
    .order('position', { ascending: true })
  const rows = unwrapList<ProductIngredient>(result)
  return rows.map((row) => row.ingredient).filter((i): i is Ingredient => Boolean(i))
}

export async function getAllergens(productId: UUID): Promise<Allergen[]> {
  const result = await supabase
    .from('product_allergens')
    .select('*, allergen:allergens(*)')
    .eq('product_id', productId)
  const rows = unwrapList<ProductAllergen>(result)
  return rows.map((row) => row.allergen).filter((a): a is Allergen => Boolean(a))
}

export async function getRegulatoryFlags(productId: UUID): Promise<RegulatoryFlags | null> {
  const result = await supabase.from('regulatory_flags').select('*').eq('product_id', productId).maybeSingle()
  return unwrapMaybe<RegulatoryFlags>(result)
}

export async function getPackageClaims(productId: UUID): Promise<PackageClaim[]> {
  const result = await supabase.from('package_claims').select('*').eq('product_id', productId)
  return unwrapList<PackageClaim>(result)
}

export interface AlternativeProduct extends ProductWithRelations {
  grade: GradeString
  rated_at: string
}

/**
 * Same category, strictly better grade than the scanned product, excluding it — sorted best
 * grade first. There's no per-product "latest rating" view in the schema, so this pulls the
 * category's ratings newest-first and keeps only the first (= latest) row seen per product.
 */
export async function getBetterAlternatives(
  categoryId: UUID,
  currentGrade: Grade,
  excludeProductId: UUID,
  limit = 6,
): Promise<AlternativeProduct[]> {
  const result = await supabase
    .from('ratings')
    .select('grade, rated_at, product:products!inner(*, brand:brands(*), category:categories(*))')
    .eq('product.category_id', categoryId)
    .order('rated_at', { ascending: false })
    .limit(200)
    .returns<Array<{ grade: GradeString; rated_at: string; product: ProductWithRelations }>>()

  const rows = unwrapList(result)

  const latestByProduct = new Map<UUID, AlternativeProduct>()
  for (const row of rows) {
    if (!row.product || latestByProduct.has(row.product.id)) continue
    latestByProduct.set(row.product.id, { ...row.product, grade: row.grade, rated_at: row.rated_at })
  }

  return Array.from(latestByProduct.values())
    .filter((p) => p.id !== excludeProductId && isStrictlyBetterGrade(p.grade as Grade, currentGrade))
    .sort((a, b) => a.grade.localeCompare(b.grade))
    .slice(0, limit)
}

/**
 * Barcode not in the DB: log it so it surfaces in the admin review queue as a rated-on-request
 * candidate. Upserts on barcode so re-scanning an already-requested barcode doesn't spam rows.
 */
export async function requestRatingForBarcode(barcode: string): Promise<void> {
  const { error } = await supabase
    .from('rating_requests')
    .upsert({ barcode, status: 'pending' }, { onConflict: 'barcode', ignoreDuplicates: true })
  if (error) throw new Error(error.message)
}

export interface ProductReport {
  product: ProductWithRelations
  rating: Rating | null
  ratingHistory: Rating[]
  claims: PackageClaim[]
  nutrients: NutrientProfile | null
  ingredients: Ingredient[]
  allergens: Allergen[]
  regulatoryFlags: RegulatoryFlags | null
  alternatives: AlternativeProduct[]
}

/**
 * Everything the Result screen needs for one barcode, fetched in parallel so the
 * barcode-to-result render feels close to instant.
 */
export async function getProductReport(barcode: string): Promise<ProductReport | null> {
  const product = await getProductByBarcode(barcode)
  if (!product) return null

  const [rating, ratingHistory, claims, nutrientsResult, ingredients, allergens, regulatoryFlags] = await Promise.all(
    [
      getLatestRating(product.id),
      getRatingHistory(product.id),
      getPackageClaims(product.id),
      supabase.from('nutrient_profiles').select('*').eq('product_id', product.id).maybeSingle(),
      getIngredients(product.id),
      getAllergens(product.id),
      getRegulatoryFlags(product.id),
    ],
  )

  const nutrients = unwrapMaybe<NutrientProfile>(nutrientsResult)
  const alternatives = rating
    ? await getBetterAlternatives(product.category_id, rating.grade as Grade, product.id)
    : []

  return { product, rating, ratingHistory, claims, nutrients, ingredients, allergens, regulatoryFlags, alternatives }
}
