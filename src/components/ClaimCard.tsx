import { VerdictChip } from './VerdictChip'
import type { PackageClaim } from '@/types/database'

export function ClaimCard({ claim, index }: { claim: PackageClaim; index: number }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-black/[0.07] bg-white p-4">
      <div className="flex items-center justify-between gap-2.5">
        <div className="text-[9.5px] font-bold tracking-[0.1em] text-black/35">CLAIM {index + 1}</div>
        <VerdictChip status={claim.verification_status} />
      </div>
      <div className="text-base font-extrabold leading-snug text-[#1A1A1A]">&ldquo;{claim.claim_text}&rdquo;</div>
      {claim.evidence && <div className="text-[13.5px] leading-relaxed text-black/70">{claim.evidence}</div>}
      {/* TODO: claim coordinates — once bounding-box data exists on package_claims, render
          this claim highlighted directly on the pack image instead of as a text card. */}
    </div>
  )
}
