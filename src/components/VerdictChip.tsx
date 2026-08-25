import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VerificationStatus } from '@/types/database'

const VERDICT_META: Record<VerificationStatus, { label: string; classes: string; Icon: typeof CheckCircle2 }> = {
  verified: {
    label: 'Verified',
    classes: 'bg-verdict-verified/12 text-verdict-verified border-verdict-verified/25',
    Icon: CheckCircle2,
  },
  misleading: {
    label: 'Misleading',
    classes: 'bg-verdict-misleading/12 text-verdict-misleading border-verdict-misleading/25',
    Icon: AlertTriangle,
  },
  unverifiable: {
    label: 'Unverifiable',
    classes: 'bg-verdict-unverifiable/12 text-verdict-unverifiable border-verdict-unverifiable/25',
    Icon: HelpCircle,
  },
}

export function VerdictChip({ status, className }: { status: VerificationStatus; className?: string }) {
  const meta = VERDICT_META[status]
  const Icon = meta.Icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
        meta.classes,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  )
}
