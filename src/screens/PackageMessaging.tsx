import { useParams } from 'react-router-dom'
import { FileSearch } from 'lucide-react'
import { useProductReport } from '@/hooks/useProductReport'
import { AppHeader } from '@/components/AppHeader'
import { ClaimCard } from '@/components/ClaimCard'
import { EmptyState } from '@/components/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { VERDICTS } from '@/lib/verdict'
import type { PackageClaim } from '@/types/database'

function claimHeadline(claims: PackageClaim[]): string {
  const verified = claims.filter((c) => c.verification_status === 'verified').length
  const misleading = claims.filter((c) => c.verification_status === 'misleading').length
  const unverifiable = claims.filter((c) => c.verification_status === 'unverifiable').length
  const bits = [`${verified} of ${claims.length} claims verified`]
  if (misleading) bits.push(`${misleading} flagged as misleading`)
  if (unverifiable) bits.push(`${unverifiable} unverifiable`)
  return bits.join(', ')
}

export default function PackageMessaging() {
  const { barcode = '' } = useParams()
  const { data: report, loading, error } = useProductReport(barcode)

  if (loading) {
    return (
      <div className="min-h-dvh bg-background">
        <AppHeader title="Package Messaging" />
        <div className="space-y-4 px-[18px] pt-2">
          <Skeleton className="h-64 w-full rounded-[18px]" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex h-dvh flex-col bg-background">
        <AppHeader title="Package Messaging" />
        <EmptyState icon={FileSearch} title="Couldn't load claims" description={error ?? 'Something went wrong.'} />
      </div>
    )
  }

  const { product, claims } = report

  return (
    <div className="min-h-dvh bg-background pb-10">
      <AppHeader title="Package Messaging" />

      <div className="flex flex-col gap-5 px-[18px] pt-2">
        {claims.length > 0 && (
          <div className="relative overflow-hidden rounded-[18px] bg-[#2A2A28]">
            <div className="absolute left-3 top-2.5 z-10 font-mono text-[9px] tracking-[0.1em] text-white/35">
              FRONT OF PACK · CLAIMS
            </div>
            <div
              className="flex flex-col items-center gap-3 px-5 pb-5 pt-[34px]"
              style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.07), transparent 60%)' }}
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={`${product.name} packaging`}
                  className="max-h-64 w-full rounded-xl object-contain shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
                />
              ) : (
                <div className="flex w-full flex-col items-center gap-2.5 rounded-xl bg-[#F1EFE9] px-4 py-[18px] shadow-[0_10px_24px_rgba(0,0,0,0.28)]">
                  {product.brand?.name && (
                    <div className="text-[10px] font-bold tracking-[0.16em] text-black/45">{product.brand.name.toUpperCase()}</div>
                  )}
                  <div className="text-center text-[19px] font-extrabold leading-tight text-[#1A1A1A]">{product.name}</div>
                  <div className="h-0.5 w-11 bg-black/15" />
                </div>
              )}
              <div className="flex w-full flex-col items-center gap-2">
                {claims.map((claim) => {
                  const v = VERDICTS[claim.verification_status]
                  return (
                    <div
                      key={claim.id}
                      className="flex items-center gap-2 rounded-[9px] px-3 py-1.5"
                      style={{
                        background: claim.verification_status === 'unverifiable' ? 'rgba(255,255,255,0.5)' : v.soft,
                        boxShadow: `inset 0 0 0 2px ${v.color}`,
                      }}
                    >
                      <span
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                        style={{ background: v.color }}
                      >
                        {v.mark}
                      </span>
                      <span className="text-center text-[12.5px] font-extrabold tracking-[0.03em] text-[#1A1A1A]">
                        {claim.claim_text}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
        {/* TODO: claim coordinates — once package_claims carries bounding-box data, replace the
            image-then-badges mock above with real in-image highlight annotations per claim. */}

        {claims.length > 0 && <p className="text-[15px] font-extrabold leading-snug text-[#1A1A1A]">{claimHeadline(claims)}</p>}

        {claims.length === 0 ? (
          <EmptyState
            icon={FileSearch}
            title="No package claims on file"
            description="We haven't analyzed any front-of-pack messaging for this product yet."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {claims.map((claim, i) => (
              <ClaimCard key={claim.id} claim={claim} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
