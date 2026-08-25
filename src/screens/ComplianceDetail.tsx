import { useParams } from 'react-router-dom'
import { ScrollText } from 'lucide-react'
import { useProductReport } from '@/hooks/useProductReport'
import { AppHeader } from '@/components/AppHeader'
import { EmptyState } from '@/components/EmptyState'
import { ComplianceRow } from '@/components/ComplianceRow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ComplianceDetail() {
  const { barcode = '' } = useParams()
  const { data: report, loading, error } = useProductReport(barcode)

  if (loading) {
    return (
      <div className="min-h-dvh bg-background">
        <AppHeader title="Regulatory compliance" />
        <div className="space-y-3 px-4 pt-4">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex h-dvh flex-col">
        <AppHeader title="Regulatory compliance" />
        <EmptyState icon={ScrollText} title="Couldn't load compliance data" description={error ?? 'Something went wrong.'} />
      </div>
    )
  }

  const { regulatoryFlags } = report

  if (!regulatoryFlags) {
    return (
      <div className="flex h-dvh flex-col">
        <AppHeader title="Regulatory compliance" />
        <EmptyState icon={ScrollText} title="No compliance data on file" description="This product hasn't been checked against our regulatory criteria yet." />
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background pb-10">
      <AppHeader title="Regulatory compliance" />
      <div className="space-y-4 px-4 pt-2">
        <Card>
          <CardHeader>
            <CardTitle>Compliance checks</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/70 pt-0">
            <ComplianceRow
              label="License valid"
              description="The manufacturer's regulatory license (e.g. FSSAI) is current and on file."
              compliant={regulatoryFlags.license_valid}
            />
            <ComplianceRow
              label="Additive limits"
              description="All food additives fall within permitted regulatory limits."
              compliant={regulatoryFlags.additive_limit_compliant}
            />
            <ComplianceRow
              label="Prohibited substances"
              description="No substances banned for this product category were detected."
              compliant={regulatoryFlags.prohibited_substance_check}
            />
          </CardContent>
        </Card>
        {regulatoryFlags.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground">{regulatoryFlags.notes}</CardContent>
          </Card>
        )}
        {regulatoryFlags.checked_at && (
          <p className="text-center text-xs text-muted-foreground">
            Last checked {new Date(regulatoryFlags.checked_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  )
}
