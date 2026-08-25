import { VERDICTS } from '@/lib/verdict'
import type { PackageClaim } from '@/types/database'

function claimStripText(misleading: number, unverifiable: number, total: number): string {
  if (misleading > 0) {
    return `${misleading} of ${total} label claim${misleading > 1 ? "s don't" : " doesn't"} match this product`
  }
  if (unverifiable > 0) {
    return `${unverifiable} of ${total} label claims can't be verified`
  }
  return 'All label claims verified'
}

export function ClaimSummaryStrip({ claims, onClick }: { claims: PackageClaim[]; onClick?: () => void }) {
  if (claims.length === 0) return null

  const misleading = claims.filter((c) => c.verification_status === 'misleading').length
  const unverifiable = claims.filter((c) => c.verification_status === 'unverifiable').length
  const worst = misleading > 0 ? 'misleading' : unverifiable > 0 ? 'unverifiable' : 'verified'
  const v = VERDICTS[worst]

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl p-3.5 text-left"
      style={{ background: v.soft, boxShadow: `inset 0 0 0 1.5px ${v.color}` }}
    >
      <span
        className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
        style={{ background: v.color }}
      >
        {v.mark}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold tracking-[0.08em] text-black/40">CLAIM CHECK</div>
        <div className="text-[14.5px] font-bold leading-tight" style={{ color: v.color }}>
          {claimStripText(misleading, unverifiable, claims.length)}
        </div>
      </div>
      <svg width="8" height="13" viewBox="0 0 7 12" className="shrink-0">
        <path d="M1 1l5 5-5 5" stroke="rgba(0,0,0,0.35)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
