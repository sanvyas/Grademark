import { CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ComplianceRow({
  label,
  description,
  compliant,
}: {
  label: string
  description: string
  compliant: boolean
}) {
  const Icon = compliant ? CheckCircle2 : XCircle
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon
        className={cn('mt-0.5 h-5 w-5 shrink-0', compliant ? 'text-verdict-verified' : 'text-verdict-misleading')}
        aria-hidden="true"
      />
      <div>
        <p className="text-sm font-medium">
          {label}
          <span className="sr-only">{compliant ? ' — compliant' : ' — not compliant'}</span>
        </p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
