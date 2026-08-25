import { VERDICTS } from '@/lib/verdict'
import { cn } from '@/lib/utils'
import type { VerificationStatus } from '@/types/database'

export function VerdictChip({ status, className }: { status: VerificationStatus; className?: string }) {
  const v = VERDICTS[status]
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1', className)}
      style={{ background: v.soft }}
    >
      <span className="text-[11px] font-extrabold" style={{ color: v.color }}>
        {v.mark}
      </span>
      <span className="text-[11.5px] font-extrabold tracking-[0.02em]" style={{ color: v.color }}>
        {v.label}
      </span>
    </span>
  )
}
