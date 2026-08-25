import { CheckCircle2, AlertTriangle, HelpCircle, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PackageClaim } from '@/types/database'

export function ClaimSummaryStrip({ claims, onClick }: { claims: PackageClaim[]; onClick?: () => void }) {
  const verified = claims.filter((c) => c.verification_status === 'verified').length
  const misleading = claims.filter((c) => c.verification_status === 'misleading').length
  const unverifiable = claims.filter((c) => c.verification_status === 'unverifiable').length

  if (claims.length === 0) return null

  const allVerified = misleading === 0 && unverifiable === 0

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors active:scale-[0.99]',
        misleading > 0
          ? 'border-verdict-misleading/30 bg-verdict-misleading/8'
          : allVerified
            ? 'border-verdict-verified/30 bg-verdict-verified/8'
            : 'border-verdict-unverifiable/30 bg-verdict-unverifiable/8',
      )}
    >
      <div className="flex-1 space-y-1.5">
        <p className="text-sm font-semibold">
          {misleading > 0
            ? `${misleading} package claim${misleading === 1 ? '' : 's'} flagged as misleading`
            : allVerified
              ? 'All package claims verified'
              : `${unverifiable} claim${unverifiable === 1 ? '' : 's'} could not be verified`}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-verdict-verified" aria-hidden="true" />
            {verified} verified
          </span>
          <span className="inline-flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 text-verdict-misleading" aria-hidden="true" />
            {misleading} misleading
          </span>
          <span className="inline-flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5 text-verdict-unverifiable" aria-hidden="true" />
            {unverifiable} unverifiable
          </span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
    </button>
  )
}
