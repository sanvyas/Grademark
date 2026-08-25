import { useParams } from 'react-router-dom'
import { ScrollText } from 'lucide-react'
import { useProductReport } from '@/hooks/useProductReport'
import { AppHeader } from '@/components/AppHeader'
import { EmptyState } from '@/components/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { statusChar, statusColor } from '@/lib/verdict'

const CHECKS = [
  {
    key: 'license_valid' as const,
    title: 'License validity',
    extra: "This checks the seller, not the recipe — confirming whoever registered this product is authorized to sell in this category.",
    good: 'The manufacturer holds a current food-safety license in this market.',
    bad: 'No current food-safety license is on file for this manufacturer.',
  },
  {
    key: 'additive_limit_compliant' as const,
    title: 'Additive-limit compliance',
    extra: 'Limits are set per category by food-safety regulators and reviewed periodically.',
    good: 'All additives fall within regulatory intake limits.',
    bad: 'At least one additive exceeds its regulatory limit for this category.',
  },
  {
    key: 'prohibited_substance_check' as const,
    title: 'Prohibited-substance check',
    extra: 'Checked against substances banned or restricted in your region — updated as regulations change.',
    good: 'No substances banned in this market were detected.',
    bad: 'A substance restricted or banned in this market was detected.',
  },
]

export default function ComplianceDetail() {
  const { barcode = '' } = useParams()
  const { data: report, loading, error } = useProductReport(barcode)

  if (loading) {
    return (
      <div className="min-h-dvh bg-background">
        <AppHeader title="Compliance" />
        <div className="space-y-4 px-[18px] pt-4">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex h-dvh flex-col bg-background">
        <AppHeader title="Compliance" />
        <EmptyState icon={ScrollText} title="Couldn't load compliance data" description={error ?? 'Something went wrong.'} />
      </div>
    )
  }

  const { regulatoryFlags } = report

  if (!regulatoryFlags) {
    return (
      <div className="flex h-dvh flex-col bg-background">
        <AppHeader title="Compliance" />
        <EmptyState icon={ScrollText} title="No compliance data on file" description="This product hasn't been checked against our regulatory criteria yet." />
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background pb-10">
      <AppHeader title="Compliance" />
      <div className="flex flex-col gap-4 px-[18px] pt-2">
        {CHECKS.map((check) => {
          const compliant = regulatoryFlags[check.key]
          const color = statusColor(compliant)
          return (
            <div key={check.key} className="flex flex-col gap-2.5">
              <div className="text-xl font-extrabold leading-snug text-[#1A1A1A]">{check.title}</div>
              <div
                className="inline-flex w-fit items-center gap-1.5 rounded-[9px] px-3 py-1 text-xs font-bold text-white"
                style={{ background: color }}
              >
                <span>{statusChar(compliant)}</span>
                {compliant ? 'Compliant' : 'Not compliant'}
              </div>
              <p className="text-[15px] leading-relaxed text-black/75">{compliant ? check.good : check.bad}</p>
              <div className="h-px bg-black/[0.08]" />
              <p className="text-sm leading-relaxed text-black/65">{check.extra}</p>
            </div>
          )
        })}
        {regulatoryFlags.notes && (
          <div className="rounded-[14px] border border-black/[0.06] bg-white p-4">
            <div className="mb-1 text-[11px] font-bold tracking-[0.08em] text-black/40">NOTES</div>
            <p className="text-sm text-black/70">{regulatoryFlags.notes}</p>
          </div>
        )}
        {regulatoryFlags.checked_at && (
          <p className="text-center text-xs text-black/45">Last checked {new Date(regulatoryFlags.checked_at).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  )
}
