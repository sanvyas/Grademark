import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { WifiOff, AlertCircle } from 'lucide-react'
import { getProductReport, requestRatingForBarcode } from '@/data/queries'
import { addScanHistoryEntry } from '@/lib/scanHistory'
import { useAsync } from '@/hooks/useAsync'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/EmptyState'

export default function Scanning() {
  const { barcode = '' } = useParams()
  const navigate = useNavigate()
  const online = useOnlineStatus()
  const { data: report, loading, error } = useAsync(() => getProductReport(barcode), [barcode])
  const handledRef = useRef(false)

  useEffect(() => {
    if (loading || error || handledRef.current) return
    handledRef.current = true

    if (report) {
      addScanHistoryEntry({
        barcode,
        productName: report.product.name,
        brandName: report.product.brand?.name ?? null,
        imageUrl: report.product.image_url,
        grade: report.rating?.grade ?? null,
      })
      navigate(`/product/${encodeURIComponent(barcode)}`, { replace: true, state: { report } })
    } else {
      addScanHistoryEntry({ barcode, productName: null, brandName: null, imageUrl: null, grade: null })
      requestRatingForBarcode(barcode).catch(() => {
        // Best-effort: the confirmation screen still shows regardless of whether the log succeeded.
      })
      navigate(`/not-found/${encodeURIComponent(barcode)}`, { replace: true })
    }
  }, [report, loading, error, barcode, navigate])

  if (error) {
    return (
      <div className="flex h-dvh flex-col">
        <EmptyState
          icon={online ? AlertCircle : WifiOff}
          title={online ? "Couldn't look up that product" : "You're offline"}
          description={
            online
              ? error
              : "We don't have this product cached from a previous scan. Reconnect and try again."
          }
          action={
            <Button onClick={() => navigate('/', { replace: true })} variant="secondary">
              Back to scanner
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-6 bg-background px-8">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <div className="absolute inset-0 animate-pulse rounded-full bg-secondary" />
        <div className="absolute inset-3 rounded-full border-4 border-accent border-t-transparent animate-spin" />
      </div>
      <div className="w-full max-w-xs space-y-3">
        <Skeleton className="mx-auto h-4 w-40" />
        <Skeleton className="mx-auto h-3 w-28" />
      </div>
      <p className="text-sm font-medium text-muted-foreground" role="status" aria-live="polite">
        Looking up barcode {barcode}…
      </p>
    </div>
  )
}
