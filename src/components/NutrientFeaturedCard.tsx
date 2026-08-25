import { statusColor } from '@/lib/verdict'
import { formatTeaspoons } from '@/lib/teaspoon'

/** Featured per-100g nutrient card (Sugar/Salt) with a teaspoon conversion and a threshold progress bar. */
export function NutrientFeaturedCard({
  label,
  grams,
  teaspoons,
  thresholdGrams,
}: {
  label: string
  grams: number
  teaspoons: number
  thresholdGrams: number
}) {
  const pct = Math.min(100, Math.round((grams / thresholdGrams) * 100))
  const over = grams > thresholdGrams
  const color = statusColor(over ? false : pct >= 70 ? null : true)

  return (
    <div className="flex-1 rounded-2xl border border-black/[0.06] bg-white p-3.5">
      <div className="text-[13px] font-bold text-[#1A1A1A]">{label}</div>
      <div className="mt-2 flex items-baseline gap-[3px]">
        <span className="text-[26px] font-extrabold text-[#1A1A1A]">{grams.toFixed(1)}</span>
        <span className="text-[13px] text-black/50">g</span>
      </div>
      <div className="mt-1 text-[13px] font-bold" style={{ color }}>
        ≈ {formatTeaspoons(teaspoons)} tsp
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.08]">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="mt-1.5 text-[11px] text-black/50">
        {over ? `over the ${thresholdGrams}g category limit` : `category limit ${thresholdGrams}g`}
      </div>
    </div>
  )
}
