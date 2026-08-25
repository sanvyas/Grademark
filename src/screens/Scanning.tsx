import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { WifiOff, AlertCircle } from 'lucide-react'
import { getProductReport, requestRatingForBarcode } from '@/data/queries'
import { addScanHistoryEntry } from '@/lib/scanHistory'
import { useAsync } from '@/hooks/useAsync'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { Button } from '@/components/ui/button'

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
    const Icon = online ? AlertCircle : WifiOff
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-[#0A0A0B] px-8 text-center text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-white/30">
          <Icon className="h-6 w-6 text-white/70" aria-hidden="true" />
        </div>
        <h1 className="text-lg font-extrabold">{online ? "Couldn't look up that product" : "You're offline"}</h1>
        <p className="max-w-xs text-sm leading-relaxed text-white/55">
          {online ? error : "We don't have this product cached from a previous scan. Reconnect and try again."}
        </p>
        <Button
          variant="secondary"
          className="rounded-full bg-white px-6 text-[#1A1A1A] hover:bg-white/90"
          onClick={() => navigate('/', { replace: true })}
        >
          Back to scanner
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-[#0A0A0B] text-white">
      <button
        type="button"
        onClick={() => navigate('/', { replace: true })}
        className="safe-top px-[18px] pt-3 text-left text-[13px] text-white/70"
      >
        Cancel
      </button>
      <div className="flex flex-1 flex-col items-center justify-center gap-[18px]">
        <div className="relative h-[150px] w-[250px] overflow-hidden rounded-2xl bg-white/[0.04]">
          <div
            className="absolute inset-x-0 top-1/2 h-0.5 animate-gm-scanline"
            style={{ background: 'oklch(0.75 0.12 150)', boxShadow: '0 0 14px oklch(0.75 0.12 150)' }}
          />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
          <p className="text-sm text-white/80" role="status" aria-live="polite">
            Reading barcode…
          </p>
        </div>
      </div>
    </div>
  )
}
