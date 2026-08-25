import { statusChar, statusColor } from '@/lib/verdict'

export function ComplianceRow({
  label,
  description,
  compliant,
}: {
  label: string
  description: string
  compliant: boolean
}) {
  const color = statusColor(compliant)
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span
        className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
        style={{ background: color }}
      >
        {statusChar(compliant)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-bold text-[#1A1A1A]">{label}</p>
        <p className="text-xs font-semibold" style={{ color }}>
          {compliant ? 'Compliant' : 'Not compliant'}
        </p>
        <p className="mt-0.5 text-xs text-black/45">{description}</p>
      </div>
    </div>
  )
}
