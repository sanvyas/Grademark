import { useParams } from 'react-router-dom'
import { CheckCircle2, AlertTriangle, FileSearch } from 'lucide-react'
import { useProductReport } from '@/hooks/useProductReport'
import { AppHeader } from '@/components/AppHeader'
import { ClaimCard } from '@/components/ClaimCard'
import { EmptyState } from '@/components/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'

export default function PackageMessaging() {
  const { barcode = '' } = useParams()
  const { data: report, loading, error } = useProductReport(barcode)

  if (loading) {
    return (
      <div className="min-h-dvh bg-background">
        <AppHeader title="Package Messaging Analysis" />
        <div className="space-y-4 px-4 pt-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex h-dvh flex-col">
        <AppHeader title="Package Messaging Analysis" />
        <EmptyState icon={FileSearch} title="Couldn't load claims" description={error ?? 'Something went wrong.'} />
      </div>
    )
  }

  const { product, claims } = report
  const misleading = claims.filter((c) => c.verification_status === 'misleading')
  const allVerified = claims.length > 0 && claims.every((c) => c.verification_status === 'verified')

  return (
    <div className="min-h-dvh bg-background pb-10">
      <AppHeader title="Package Messaging Analysis" />

      <div className="space-y-4 px-4 pt-2">
        {product.image_url && (
          <div className="overflow-hidden rounded-2xl border border-border bg-secondary">
            <img src={product.image_url} alt={`${product.name} packaging`} className="aspect-square w-full object-contain" />
          </div>
        )}
        {/* TODO: claim coordinates — once package_claims carries bounding-box data, replace the
            image-then-cards layout above/below with in-image highlight annotations per claim. */}

        {misleading.length > 0 && (
          <div className="flex items-start gap-3 rounded-2xl border border-verdict-misleading/30 bg-verdict-misleading/8 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-verdict-misleading" aria-hidden="true" />
            <p className="text-sm font-medium text-verdict-misleading">
              {misleading.length} claim{misleading.length === 1 ? '' : 's'} on this package may be misleading.
              Check the evidence below each one.
            </p>
          </div>
        )}
        {allVerified && (
          <div className="flex items-start gap-3 rounded-2xl border border-verdict-verified/30 bg-verdict-verified/8 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-verdict-verified" aria-hidden="true" />
            <p className="text-sm font-medium text-verdict-verified">
              Every claim on this package checks out against our evidence review.
            </p>
          </div>
        )}

        {claims.length === 0 ? (
          <EmptyState
            icon={FileSearch}
            title="No package claims on file"
            description="We haven't analyzed any front-of-pack messaging for this product yet."
          />
        ) : (
          <div className="space-y-3">
            {claims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
