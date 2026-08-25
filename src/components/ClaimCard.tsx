import { VerdictChip } from './VerdictChip'
import { Card, CardContent } from './ui/card'
import type { PackageClaim } from '@/types/database'

export function ClaimCard({ claim }: { claim: PackageClaim }) {
  return (
    <Card className="animate-fade-in">
      <CardContent className="space-y-2.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold leading-snug">&ldquo;{claim.claim_text}&rdquo;</p>
          <VerdictChip status={claim.verification_status} className="shrink-0" />
        </div>
        {claim.evidence && (
          <p className="rounded-lg bg-secondary/70 p-2.5 text-xs leading-relaxed text-muted-foreground">
            {claim.evidence}
          </p>
        )}
        {/* TODO: claim coordinates — once bounding-box data exists on package_claims, render
            this claim highlighted directly on the pack image instead of as a text card. */}
      </CardContent>
    </Card>
  )
}
