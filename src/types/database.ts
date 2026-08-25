/**
 * Types for the existing GradeMark Supabase schema (shared with the Lovable-built
 * public site / admin / portal — this app is additive and does not modify it).
 *
 * IMPORTANT — these are best-effort types written from the documented table/column
 * names in the project brief, not generated from a live connection (this session had
 * no Supabase credentials). Column names beyond the ones explicitly named in the brief
 * (barcode, image_url; per-100g nutrient values; license_valid / additive_limit_compliant /
 * prohibited_substance_check; claim_text / claim_type / verification_status / evidence)
 * are reasonable guesses. Once VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set, run
 *   npx supabase gen types typescript --project-id <ref> > src/types/database.generated.ts
 * and reconcile this file against it before shipping.
 */

export type UUID = string
export type ISODateString = string

export interface Brand {
  id: UUID
  name: string
  logo_url: string | null
}

export interface Category {
  id: UUID
  name: string
  slug: string
}

export interface Product {
  id: UUID
  name: string
  brand_id: UUID
  category_id: UUID
  barcode: string
  image_url: string | null
  description: string | null
}

export interface ProductWithRelations extends Product {
  brand: Brand | null
  category: Category | null
}

export interface NutrientProfile {
  id: UUID
  product_id: UUID
  serving_size_g: number | null
  energy_kcal_per_100g: number | null
  protein_g_per_100g: number | null
  carbohydrate_g_per_100g: number | null
  total_sugar_g_per_100g: number | null
  added_sugar_g_per_100g: number | null
  fat_g_per_100g: number | null
  saturated_fat_g_per_100g: number | null
  trans_fat_g_per_100g: number | null
  fiber_g_per_100g: number | null
  sodium_mg_per_100g: number | null
}

export type ConcernLevel = 'none' | 'low' | 'moderate' | 'high'

export interface Ingredient {
  id: UUID
  name: string
  is_additive: boolean
  additive_code: string | null
  concern_level: ConcernLevel | null
}

export interface ProductIngredient {
  id: UUID
  product_id: UUID
  ingredient_id: UUID
  position: number
  ingredient: Ingredient
}

export interface Allergen {
  id: UUID
  name: string
}

export interface ProductAllergen {
  id: UUID
  product_id: UUID
  allergen_id: UUID
  contains_trace: boolean
  allergen: Allergen
}

export interface RegulatoryFlags {
  id: UUID
  product_id: UUID
  license_valid: boolean
  additive_limit_compliant: boolean
  prohibited_substance_check: boolean
  notes: string | null
  checked_at: ISODateString | null
}

export type GradeString = 'AAA' | 'AA' | 'A' | 'B' | 'C' | 'D'

export interface Rating {
  id: UUID
  product_id: UUID
  grade: GradeString
  score: number | null
  version: number
  rationale: string | null
  methodology_version: string | null
  rated_at: ISODateString
}

export type ClaimType = 'nutrition' | 'health' | 'ingredient' | 'sourcing' | 'certification' | 'other'
export type VerificationStatus = 'verified' | 'misleading' | 'unverifiable'

export interface PackageClaim {
  id: UUID
  product_id: UUID
  claim_text: string
  claim_type: ClaimType | string
  verification_status: VerificationStatus
  evidence: string | null
  // TODO: claim coordinates — bounding-box position on the pack image does not exist in the
  // schema yet. When it lands (e.g. bbox_x/bbox_y/bbox_w/bbox_h, normalized 0-1), the Package
  // Messaging Analysis screen should switch from the highlighted-text-below-image layout to
  // in-image annotation. See src/screens/PackageMessaging.tsx.
}

/** New table added by this app — not part of the existing content-managed schema. */
export interface RatingRequest {
  id: UUID
  barcode: string
  requested_at: ISODateString
  status: 'pending' | 'in_review' | 'rated' | 'rejected'
}
