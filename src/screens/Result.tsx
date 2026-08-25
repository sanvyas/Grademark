import { useNavigate, useParams } from 'react-router-dom'
import { TrendingUp, TrendingDown, Minus, ChevronRight, AlertCircle } from 'lucide-react'
import { useProductReport } from '@/hooks/useProductReport'
import { AppHeader } from '@/components/AppHeader'
import { GradeBadge } from '@/components/GradeBadge'
import { ClaimSummaryStrip } from '@/components/ClaimSummaryStrip'
import { NutrientRow } from '@/components/NutrientRow'
import { ComplianceRow } from '@/components/ComplianceRow'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { GRADE_ORDER, gradeLabel, type Grade } from '@/lib/grade'
import { formatTeaspoons, sodiumMgToSaltTeaspoons, sugarGramsToTeaspoons } from '@/lib/teaspoon'

export default function Result() {
  const { barcode = '' } = useParams()
  const navigate = useNavigate()
  const { data: report, loading, error } = useProductReport(barcode)

  if (loading) return <ResultSkeleton />

  if (error || !report) {
    return (
      <div className="flex h-dvh flex-col">
        <AppHeader title="Rating Report" />
        <EmptyState
          icon={AlertCircle}
          title="Couldn't load this product"
          description={error ?? 'Something went wrong loading this rating.'}
          action={
            <Button variant="secondary" onClick={() => navigate('/')}>
              Back to scanner
            </Button>
          }
        />
      </div>
    )
  }

  const { product, rating, ratingHistory, claims, nutrients, ingredients, allergens, regulatoryFlags } = report
  const previousRating = ratingHistory.find((r) => r.id !== rating?.id)
  const trend =
    rating && previousRating
      ? GRADE_ORDER.indexOf(rating.grade as Grade) < GRADE_ORDER.indexOf(previousRating.grade as Grade)
        ? 'up'
        : GRADE_ORDER.indexOf(rating.grade as Grade) > GRADE_ORDER.indexOf(previousRating.grade as Grade)
          ? 'down'
          : 'same'
      : null

  const flaggedIngredients = ingredients.filter((i) => i.concern_level === 'high' || i.concern_level === 'moderate')

  return (
    <div className="min-h-dvh bg-background pb-10">
      <AppHeader title={product.name} />

      <div className="space-y-5 px-4 pt-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            {product.image_url ? (
              <img src={product.image_url} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
            ) : (
              <div className="h-20 w-20 shrink-0 rounded-xl bg-secondary" aria-hidden="true" />
            )}
            <div className="min-w-0 flex-1">
              {product.brand?.name && <p className="truncate text-xs text-muted-foreground">{product.brand.name}</p>}
              <h2 className="truncate text-lg font-bold leading-snug">{product.name}</h2>
              {product.category?.name && (
                <Badge variant="outline" className="mt-1">
                  {product.category.name}
                </Badge>
              )}
            </div>
            {rating && (
              <div className="flex shrink-0 flex-col items-center gap-1">
                <GradeBadge grade={rating.grade as Grade} size="lg" />
                {trend && (
                  <span
                    className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground"
                    aria-label={
                      trend === 'up' ? 'Improved since last rating' : trend === 'down' ? 'Declined since last rating' : 'Unchanged since last rating'
                    }
                  >
                    {trend === 'up' && <TrendingUp className="h-3.5 w-3.5 text-verdict-verified" aria-hidden="true" />}
                    {trend === 'down' && <TrendingDown className="h-3.5 w-3.5 text-verdict-misleading" aria-hidden="true" />}
                    {trend === 'same' && <Minus className="h-3.5 w-3.5" aria-hidden="true" />}
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {!rating && (
          <Card className="border-verdict-unverifiable/30 bg-verdict-unverifiable/8">
            <CardContent className="p-4 text-sm">
              This product is in our database but hasn&apos;t been rated yet.
            </CardContent>
          </Card>
        )}

        {rating?.rationale && (
          <Card>
            <CardHeader>
              <CardTitle>Why this grade</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-relaxed text-muted-foreground">
              {rating.rationale}
            </CardContent>
          </Card>
        )}

        <ClaimSummaryStrip claims={claims} onClick={() => navigate(`/product/${barcode}/messaging`, { state: { report } })} />

        {nutrients && (
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Nutrients (per 100g)</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {nutrients.energy_kcal_per_100g != null && (
                <NutrientRow label="Energy" value={nutrients.energy_kcal_per_100g} unit="kcal" />
              )}
              {nutrients.total_sugar_g_per_100g != null && (
                <NutrientRow
                  label="Sugar"
                  value={nutrients.total_sugar_g_per_100g}
                  unit="g"
                  sublabel={`≈ ${formatTeaspoons(sugarGramsToTeaspoons(nutrients.total_sugar_g_per_100g))} tsp`}
                  level={nutrients.total_sugar_g_per_100g > 22.5 ? 'high' : nutrients.total_sugar_g_per_100g > 5 ? 'moderate' : 'good'}
                />
              )}
              {nutrients.saturated_fat_g_per_100g != null && (
                <NutrientRow
                  label="Saturated fat"
                  value={nutrients.saturated_fat_g_per_100g}
                  unit="g"
                  level={nutrients.saturated_fat_g_per_100g > 5 ? 'high' : nutrients.saturated_fat_g_per_100g > 1.5 ? 'moderate' : 'good'}
                />
              )}
              {nutrients.sodium_mg_per_100g != null && (
                <NutrientRow
                  label="Sodium"
                  value={nutrients.sodium_mg_per_100g}
                  unit="mg"
                  sublabel={`≈ ${formatTeaspoons(sodiumMgToSaltTeaspoons(nutrients.sodium_mg_per_100g))} tsp salt`}
                  level={nutrients.sodium_mg_per_100g > 600 ? 'high' : nutrients.sodium_mg_per_100g > 120 ? 'moderate' : 'good'}
                />
              )}
              {nutrients.fiber_g_per_100g != null && <NutrientRow label="Fiber" value={nutrients.fiber_g_per_100g} unit="g" />}
              {nutrients.protein_g_per_100g != null && <NutrientRow label="Protein" value={nutrients.protein_g_per_100g} unit="g" />}
            </CardContent>
          </Card>
        )}

        <button
          type="button"
          onClick={() => navigate(`/product/${barcode}/ingredients`, { state: { report } })}
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left active:scale-[0.99]"
        >
          <div className="flex-1">
            <p className="text-sm font-semibold">Ingredients{flaggedIngredients.length > 0 && ` · ${flaggedIngredients.length} flagged`}</p>
            <p className="truncate text-xs text-muted-foreground">
              {ingredients.slice(0, 5).map((i) => i.name).join(', ')}
              {ingredients.length > 5 ? '…' : ''}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        </button>

        {allergens.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Allergens</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-0">
              {allergens.map((a) => (
                <Badge key={a.id} variant="destructive">
                  {a.name}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        {regulatoryFlags && (
          <button
            type="button"
            onClick={() => navigate(`/product/${barcode}/compliance`, { state: { report } })}
            className="block w-full rounded-2xl border border-border bg-card p-4 text-left active:scale-[0.99]"
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-semibold">Regulatory compliance</p>
              <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <ComplianceRow label="License valid" description="FSSAI/regulatory license on file" compliant={regulatoryFlags.license_valid} />
            <ComplianceRow label="Additive limits" description="Within permitted additive limits" compliant={regulatoryFlags.additive_limit_compliant} />
            <ComplianceRow label="Prohibited substances" description="No prohibited substances detected" compliant={regulatoryFlags.prohibited_substance_check} />
          </button>
        )}

        {rating && (
          <Button
            variant="accent"
            size="lg"
            className="w-full"
            onClick={() => navigate(`/product/${barcode}/alternatives`, { state: { report } })}
          >
            See better alternatives
          </Button>
        )}

        {rating && (
          <p className="text-center text-xs text-muted-foreground">
            Grade {rating.grade} · {gradeLabel(rating.grade as Grade)}
          </p>
        )}
      </div>
    </div>
  )
}

function ResultSkeleton() {
  return (
    <div className="min-h-dvh bg-background pb-10">
      <AppHeader />
      <div className="space-y-5 px-4 pt-2">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
    </div>
  )
}
