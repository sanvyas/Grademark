import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, AlertCircle } from 'lucide-react'
import { useProductReport } from '@/hooks/useProductReport'
import { AppHeader } from '@/components/AppHeader'
import { GradeBadge } from '@/components/GradeBadge'
import { ClaimSummaryStrip } from '@/components/ClaimSummaryStrip'
import { NutrientFeaturedCard } from '@/components/NutrientFeaturedCard'
import { ComplianceRow } from '@/components/ComplianceRow'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { GRADE_ORDER, type Grade } from '@/lib/grade'
import { sodiumMgToSaltTeaspoons, sugarGramsToTeaspoons } from '@/lib/teaspoon'
import type { ConcernLevel } from '@/types/database'

const SUGAR_THRESHOLD_G = 22.5 // WHO/FSSAI-style "high sugar" per-100g cutoff
const SALT_THRESHOLD_G = 1.5 // "high salt" per-100g cutoff (sodium >600mg)

const CONCERN_DOT: Record<Exclude<ConcernLevel, 'none'>, string> = {
  low: 'rgba(0,0,0,0.25)',
  moderate: '#B8862E',
  high: '#B3452F',
}
const CONCERN_TAG: Record<Exclude<ConcernLevel, 'none'>, string> = {
  low: 'Low concern',
  moderate: 'Moderate concern',
  high: 'High concern',
}

function ShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
      <path d="M9 1v10M9 1l3 3M9 1L6 4" stroke="rgba(0,0,0,0.6)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 8v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" stroke="rgba(0,0,0,0.6)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Result() {
  const { barcode = '' } = useParams()
  const navigate = useNavigate()
  const { data: report, loading, error } = useProductReport(barcode)

  if (loading) return <ResultSkeleton />

  if (error || !report) {
    return (
      <div className="flex h-dvh flex-col bg-background">
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
  const trendMeta = {
    up: { sym: '↑', label: 'Improved since last scan', color: '#3F7D58' },
    down: { sym: '↓', label: 'Declined since last scan', color: '#B3452F' },
    same: { sym: '→', label: 'Unchanged since last scan', color: '#8A8A8A' },
  } as const

  const isTopGrade = rating?.grade === 'AAA'
  const allergenText = allergens.length > 0 ? `Contains: ${allergens.map((a) => a.name).join(', ')}` : 'No major allergens detected.'

  const handleShare = async () => {
    const shareData = { title: product.name, text: `${product.name} — Grade ${rating?.grade ?? '?'} on GradeMark`, url: window.location.href }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled the share sheet — no action needed.
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url)
    }
  }

  return (
    <div className="min-h-dvh bg-background pb-10">
      <AppHeader
        title="Rating Report"
        right={
          <button
            type="button"
            aria-label="Share this rating"
            onClick={handleShare}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.06] active:scale-95"
          >
            <ShareIcon />
          </button>
        }
      />

      <div className="flex flex-col gap-[22px] px-[18px] pb-8 pt-2">
        <div className="flex items-start gap-3.5">
          {rating ? (
            <GradeBadge grade={rating.grade as Grade} size="lg" />
          ) : (
            <div className="flex h-[122px] w-[106px] shrink-0 items-center justify-center rounded-2xl bg-black/[0.06] text-xs text-black/40">
              Not yet rated
            </div>
          )}
          <div className="flex-1 pt-0.5">
            {trend && (
              <div className="mb-0.5 flex items-center gap-1.5 text-xs font-bold" style={{ color: trendMeta[trend].color }}>
                <span>{trendMeta[trend].sym}</span>
                <span>{trendMeta[trend].label}</span>
              </div>
            )}
            <div className="text-xl font-extrabold leading-tight text-[#1A1A1A]">{product.name}</div>
            {product.brand?.name && <div className="text-sm text-black/55">{product.brand.name}</div>}
            {product.category?.name && (
              <div className="mt-1 inline-flex rounded-lg bg-black/[0.06] px-2.5 py-[3px] text-[11px] capitalize text-black/55">
                {product.category.name}
              </div>
            )}
          </div>
          <div className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-[10px] bg-black/[0.05]">
            {product.image_url ? (
              <img src={product.image_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-center font-mono text-[7px] leading-tight text-black/40">
                pack
                <br />
                photo
              </div>
            )}
          </div>
        </div>

        {!rating && (
          <div className="rounded-2xl bg-black/[0.035] p-4 text-sm text-black/65">
            This product is in our database but hasn&apos;t been rated yet.
          </div>
        )}

        <ClaimSummaryStrip claims={claims} onClick={() => navigate(`/product/${barcode}/messaging`, { state: { report } })} />

        {nutrients && (
          <div>
            <div className="mb-2.5 text-[11px] font-bold tracking-[0.08em] text-black/40">PER 100g</div>
            <div className="mb-2.5 flex gap-2.5">
              {nutrients.total_sugar_g_per_100g != null && (
                <NutrientFeaturedCard
                  label="Sugar"
                  grams={nutrients.total_sugar_g_per_100g}
                  teaspoons={sugarGramsToTeaspoons(nutrients.total_sugar_g_per_100g)}
                  thresholdGrams={SUGAR_THRESHOLD_G}
                />
              )}
              {nutrients.sodium_mg_per_100g != null && (
                <NutrientFeaturedCard
                  label="Salt"
                  grams={(nutrients.sodium_mg_per_100g * 2.5) / 1000}
                  teaspoons={sodiumMgToSaltTeaspoons(nutrients.sodium_mg_per_100g)}
                  thresholdGrams={SALT_THRESHOLD_G}
                />
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {nutrients.energy_kcal_per_100g != null && <MiniNutrient label="Calories" display={String(Math.round(nutrients.energy_kcal_per_100g))} />}
              {nutrients.fat_g_per_100g != null && <MiniNutrient label="Fat" display={`${nutrients.fat_g_per_100g.toFixed(1)}g`} />}
              {nutrients.protein_g_per_100g != null && <MiniNutrient label="Protein" display={`${nutrients.protein_g_per_100g.toFixed(1)}g`} />}
              {nutrients.carbohydrate_g_per_100g != null && <MiniNutrient label="Carbs" display={`${nutrients.carbohydrate_g_per_100g.toFixed(1)}g`} />}
            </div>
          </div>
        )}

        {rating?.rationale && (
          <div className="flex items-start gap-2.5 rounded-[14px] bg-black/[0.035] p-3.5">
            <span className="text-xl leading-none text-black/25">&ldquo;</span>
            <p className="text-sm italic leading-relaxed text-black/75">{rating.rationale}</p>
          </div>
        )}

        {ingredients.length > 0 && (
          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.08em] text-black/40">INGREDIENTS</div>
            <div className="overflow-hidden rounded-[14px] border border-black/[0.06] bg-white">
              {ingredients.slice(0, 6).map((ingredient) => (
                <div key={ingredient.id} className="flex items-center gap-2.5 border-b border-black/[0.06] px-3.5 py-3 last:border-0">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: ingredient.concern_level && ingredient.concern_level !== 'none' ? CONCERN_DOT[ingredient.concern_level] : 'rgba(0,0,0,0.15)' }}
                  />
                  <div
                    className="flex-1 text-sm text-[#1A1A1A]"
                    style={{ fontWeight: ingredient.concern_level && ingredient.concern_level !== 'none' ? 700 : 500 }}
                  >
                    {ingredient.name}
                  </div>
                  {ingredient.concern_level && ingredient.concern_level !== 'none' && (
                    <div className="text-[10px] font-bold uppercase tracking-[0.03em] text-black/45">
                      {CONCERN_TAG[ingredient.concern_level]}
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => navigate(`/product/${barcode}/ingredients`, { state: { report } })}
                className="flex w-full items-center gap-2.5 border-t border-black/[0.06] px-3.5 py-3 text-left"
              >
                <span className="flex-1 text-sm font-semibold text-black/70">
                  {ingredients.length > 6 ? `View all ${ingredients.length} ingredients` : 'View ingredient details'}
                </span>
                <ChevronRight className="h-4 w-4 text-black/35" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2.5 rounded-[14px] px-4 py-3" style={{ background: 'oklch(0.94 0.03 70)' }}>
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
            style={{ background: 'oklch(0.6 0.11 70)' }}
          >
            !
          </span>
          <div className="text-[13px] text-black/70">{allergenText}</div>
        </div>

        {regulatoryFlags && (
          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.08em] text-black/40">COMPLIANCE</div>
            <button
              type="button"
              onClick={() => navigate(`/product/${barcode}/compliance`, { state: { report } })}
              className="block w-full divide-y divide-black/[0.06] overflow-hidden rounded-[14px] border border-black/[0.06] bg-white px-3.5 text-left"
            >
              <ComplianceRow label="License valid" description="FSSAI/regulatory license on file" compliant={regulatoryFlags.license_valid} />
              <ComplianceRow label="Additive limits" description="Within permitted additive limits" compliant={regulatoryFlags.additive_limit_compliant} />
              <ComplianceRow label="Prohibited substances" description="No prohibited substances detected" compliant={regulatoryFlags.prohibited_substance_check} />
            </button>
          </div>
        )}

        {rating &&
          (isTopGrade ? (
            <div className="flex h-11 items-center justify-center rounded-[14px] text-[13px] font-bold" style={{ background: 'rgba(63,125,88,0.1)', color: '#3F7D58' }}>
              Top-rated in its category
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate(`/product/${barcode}/alternatives`, { state: { report } })}
              className="flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#1A1A1A] text-sm font-bold text-white"
            >
              See better alternatives
              <svg width="7" height="12" viewBox="0 0 7 12">
                <path d="M1 1l5 5-5 5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
      </div>
    </div>
  )
}

function MiniNutrient({ label, display }: { label: string; display: string }) {
  return (
    <div className="rounded-xl border border-black/[0.06] bg-white px-1.5 py-2.5 text-center">
      <div className="text-sm font-extrabold text-[#1A1A1A]">{display}</div>
      <div className="mt-0.5 text-[10px] text-black/45">{label}</div>
    </div>
  )
}

function ResultSkeleton() {
  return (
    <div className="min-h-dvh bg-background pb-10">
      <AppHeader title="Rating Report" />
      <div className="space-y-5 px-4 pt-2">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
    </div>
  )
}
