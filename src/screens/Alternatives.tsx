import { useNavigate, useParams } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useProductReport } from '@/hooks/useProductReport'
import { AppHeader } from '@/components/AppHeader'
import { EmptyState } from '@/components/EmptyState'
import { GradeBadge } from '@/components/GradeBadge'
import { Skeleton } from '@/components/ui/skeleton'
import type { Grade } from '@/lib/grade'

export default function Alternatives() {
  const { barcode = '' } = useParams()
  const navigate = useNavigate()
  const { data: report, loading, error } = useProductReport(barcode)

  if (loading) {
    return (
      <div className="min-h-dvh bg-background">
        <AppHeader title="Better alternatives" />
        <div className="space-y-3 px-4 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex h-dvh flex-col">
        <AppHeader title="Better alternatives" />
        <EmptyState icon={Sparkles} title="Couldn't load alternatives" description={error ?? 'Something went wrong.'} />
      </div>
    )
  }

  const { alternatives, product } = report

  return (
    <div className="min-h-dvh bg-background pb-10">
      <AppHeader title="Better alternatives" />
      <div className="px-4 pt-2">
        <p className="mb-4 text-sm text-muted-foreground">
          Other {product.category?.name?.toLowerCase() ?? 'products in this category'} with a better rating than{' '}
          <span className="font-medium text-foreground">{product.name}</span>.
        </p>

        {alternatives.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No better-rated alternatives yet"
            description="We don't have another product in this category with a stronger rating right now."
          />
        ) : (
          <div className="space-y-3">
            {alternatives.map((alt) => (
              <button
                key={alt.id}
                type="button"
                onClick={() => navigate(`/product/${encodeURIComponent(alt.barcode)}`)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left active:scale-[0.99]"
              >
                {alt.image_url ? (
                  <img src={alt.image_url} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="h-14 w-14 shrink-0 rounded-xl bg-secondary" aria-hidden="true" />
                )}
                <div className="min-w-0 flex-1">
                  {alt.brand?.name && <p className="truncate text-xs text-muted-foreground">{alt.brand.name}</p>}
                  <p className="truncate text-sm font-semibold">{alt.name}</p>
                </div>
                <GradeBadge grade={alt.grade as Grade} size="sm" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
