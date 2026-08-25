import { useParams } from 'react-router-dom'
import { ListTree } from 'lucide-react'
import { useProductReport } from '@/hooks/useProductReport'
import { AppHeader } from '@/components/AppHeader'
import { EmptyState } from '@/components/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import type { ConcernLevel } from '@/types/database'

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

export default function IngredientDetail() {
  const { barcode = '' } = useParams()
  const { data: report, loading, error } = useProductReport(barcode)

  if (loading) {
    return (
      <div className="min-h-dvh bg-background">
        <AppHeader title="Ingredients" />
        <div className="space-y-2 px-[18px] pt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex h-dvh flex-col bg-background">
        <AppHeader title="Ingredients" />
        <EmptyState icon={ListTree} title="Couldn't load ingredients" description={error ?? 'Something went wrong.'} />
      </div>
    )
  }

  const { ingredients, allergens } = report
  const allergenText = allergens.length > 0 ? `Contains: ${allergens.map((a) => a.name).join(', ')}` : 'No major allergens detected.'

  return (
    <div className="min-h-dvh bg-background pb-10">
      <AppHeader title="Ingredients" />
      <div className="flex flex-col gap-4 px-[18px] pt-2">
        <div className="flex items-center gap-2.5 rounded-[14px] px-4 py-3" style={{ background: 'oklch(0.94 0.03 70)' }}>
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
            style={{ background: 'oklch(0.6 0.11 70)' }}
          >
            !
          </span>
          <div className="text-[13px] text-black/70">{allergenText}</div>
        </div>

        {ingredients.length === 0 ? (
          <EmptyState icon={ListTree} title="No ingredient data" description="We don't have an ingredient list on file for this product yet." />
        ) : (
          <div className="overflow-hidden rounded-[14px] border border-black/[0.06] bg-white">
            {ingredients.map((ingredient) => (
              <div key={ingredient.id} className="flex items-center gap-2.5 border-b border-black/[0.06] px-3.5 py-3 last:border-0">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    background:
                      ingredient.concern_level && ingredient.concern_level !== 'none'
                        ? CONCERN_DOT[ingredient.concern_level]
                        : 'rgba(0,0,0,0.15)',
                  }}
                />
                <div className="flex-1">
                  <span
                    className="text-sm text-[#1A1A1A]"
                    style={{ fontWeight: ingredient.concern_level && ingredient.concern_level !== 'none' ? 700 : 500 }}
                  >
                    {ingredient.name}
                  </span>
                  {ingredient.additive_code && <span className="ml-1.5 text-xs text-black/45">({ingredient.additive_code})</span>}
                </div>
                {ingredient.concern_level && ingredient.concern_level !== 'none' && (
                  <div className="shrink-0 text-[10px] font-bold uppercase tracking-[0.03em] text-black/45">
                    {CONCERN_TAG[ingredient.concern_level]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
