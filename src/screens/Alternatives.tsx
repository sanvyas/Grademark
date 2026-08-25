import { useNavigate, useParams } from 'react-router-dom'
import { Sparkles, ChevronRight } from 'lucide-react'
import { useProductReport } from '@/hooks/useProductReport'
import { AppHeader } from '@/components/AppHeader'
import { EmptyState } from '@/components/EmptyState'
import { GradeBadge } from '@/components/GradeBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { gradeLabel, type Grade } from '@/lib/grade'

export default function Alternatives() {
  const { barcode = '' } = useParams()
  const navigate = useNavigate()
  const { data: report, loading, error } = useProductReport(barcode)

  if (loading) {
    return (
      <div className="min-h-dvh bg-background">
        <AppHeader title="Alternatives" />
        <div className="space-y-3.5 px-[18px] pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[95px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex h-dvh flex-col bg-background">
        <AppHeader title="Alternatives" />
        <EmptyState icon={Sparkles} title="Couldn't load alternatives" description={error ?? 'Something went wrong.'} />
      </div>
    )
  }

  const { alternatives, product } = report

  return (
    <div className="min-h-dvh bg-background pb-10">
      <AppHeader title="Alternatives" />
      <div className="flex flex-col gap-3.5 px-[18px] pt-2">
        <p className="text-[13px] text-black/50">
          Higher-rated {product.category?.name ? product.category.name.toLowerCase() : 'category'} picks
        </p>

        {alternatives.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No better-rated alternatives yet"
            description="We don't have another product in this category with a stronger rating right now."
          />
        ) : (
          alternatives.map((alt) => (
            <button
              key={alt.id}
              type="button"
              onClick={() => navigate(`/product/${encodeURIComponent(alt.barcode)}`)}
              className="flex w-full items-center gap-3 rounded-2xl border border-black/[0.06] bg-white p-3.5 text-left"
            >
              <GradeBadge grade={alt.grade as Grade} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-bold text-[#1A1A1A]">{alt.name}</div>
                {alt.brand?.name && <div className="text-xs text-black/50">{alt.brand.name}</div>}
                <div className="mt-0.5 inline-flex rounded-[7px] px-2 py-[3px] text-[11px] font-bold" style={{ background: 'rgba(63,125,88,0.1)', color: '#3F7D58' }}>
                  {gradeLabel(alt.grade as Grade)}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-black/25" aria-hidden="true" />
            </button>
          ))
        )}
      </div>
    </div>
  )
}
