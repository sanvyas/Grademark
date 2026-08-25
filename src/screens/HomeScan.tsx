import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { History, Keyboard, WifiOff, VideoOff, ShieldAlert } from 'lucide-react'
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { getRecentScans } from '@/lib/scanHistory'
import { GradeBadge } from '@/components/GradeBadge'
import { Viewfinder } from '@/components/Viewfinder'
import { Button } from '@/components/ui/button'
import { isValidGrade } from '@/lib/grade'

export default function HomeScan() {
  const navigate = useNavigate()
  const online = useOnlineStatus()
  const [manualOpen, setManualOpen] = useState(false)
  const [manualBarcode, setManualBarcode] = useState('')
  const recentScans = getRecentScans(8)

  const handleDetect = useCallback(
    (barcode: string) => {
      navigate(`/scanning/${encodeURIComponent(barcode)}`)
    },
    [navigate],
  )

  const { videoRef, status, error } = useBarcodeScanner({ onDetect: handleDetect, enabled: !manualOpen })

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-slate-950 text-white">
      <video
        ref={videoRef}
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/70" />

      <header className="safe-top relative z-10 flex items-center justify-between px-4 pt-3">
        <div>
          <p className="text-lg font-extrabold tracking-tight">GradeMark</p>
          <p className="text-xs text-white/70">Scan a barcode to see its rating</p>
        </div>
        <button
          type="button"
          aria-label="Scan history"
          onClick={() => navigate('/history')}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur active:scale-95"
        >
          <History className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        {status === 'scanning' && <Viewfinder active />}
        {status === 'scanning' && (
          <p className="mt-64 text-center text-sm font-medium text-white/85">
            Line up the barcode inside the frame
          </p>
        )}

        {status === 'requesting-permission' && (
          <p className="text-center text-sm font-medium text-white/85">Requesting camera access…</p>
        )}

        {status === 'denied' && (
          <div className="max-w-xs space-y-3 rounded-2xl bg-black/60 p-6 text-center backdrop-blur">
            <ShieldAlert className="mx-auto h-8 w-8 text-amber-400" aria-hidden="true" />
            <h2 className="text-base font-semibold">Camera access is off</h2>
            <p className="text-sm text-white/75">
              GradeMark needs your camera to scan barcodes. Enable it in your browser&apos;s site settings for this
              page, then reload — look for a camera icon in the address bar, or Settings → Site settings → Camera.
            </p>
            <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
              I&apos;ve enabled it — retry
            </Button>
          </div>
        )}

        {status === 'unsupported' && (
          <div className="max-w-xs space-y-3 rounded-2xl bg-black/60 p-6 text-center backdrop-blur">
            <VideoOff className="mx-auto h-8 w-8 text-amber-400" aria-hidden="true" />
            <h2 className="text-base font-semibold">Camera scanning isn&apos;t available</h2>
            <p className="text-sm text-white/75">
              This browser doesn&apos;t support camera access. You can still look up a product by typing its barcode.
            </p>
          </div>
        )}

        {status === 'error' && error && (
          <div className="max-w-xs space-y-3 rounded-2xl bg-black/60 p-6 text-center backdrop-blur">
            <ShieldAlert className="mx-auto h-8 w-8 text-amber-400" aria-hidden="true" />
            <p className="text-sm text-white/75">{error}</p>
          </div>
        )}
      </div>

      {!online && (
        <div className="relative z-10 mx-4 mb-2 flex items-center gap-2 rounded-xl bg-amber-500/15 px-3 py-2 text-xs font-medium text-amber-300">
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline — scanning needs a connection, but your recent scans still work below.
        </div>
      )}

      <div className="safe-bottom relative z-10 space-y-3 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-6">
        {manualOpen ? (
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              const trimmed = manualBarcode.trim()
              if (trimmed) handleDetect(trimmed)
            }}
          >
            <input
              autoFocus
              inputMode="numeric"
              placeholder="Enter barcode number"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              className="h-11 flex-1 rounded-xl border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button type="submit" size="default" variant="accent">
              Look up
            </Button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setManualOpen(true)}
            className="mx-auto flex items-center gap-1.5 text-xs font-medium text-white/70"
          >
            <Keyboard className="h-3.5 w-3.5" aria-hidden="true" />
            Enter barcode manually
          </button>
        )}

        {recentScans.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">Recent scans</p>
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {recentScans.map((scan) => (
                <button
                  key={scan.barcode}
                  type="button"
                  onClick={() => navigate(`/product/${encodeURIComponent(scan.barcode)}`)}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-white/10 py-1.5 pl-1.5 pr-3 backdrop-blur active:scale-95"
                >
                  {scan.imageUrl ? (
                    <img src={scan.imageUrl} alt="" className="h-9 w-9 rounded-lg object-cover" />
                  ) : (
                    <div className="h-9 w-9 rounded-lg bg-white/15" />
                  )}
                  {scan.grade && isValidGrade(scan.grade) ? (
                    <GradeBadge grade={scan.grade} size="sm" />
                  ) : (
                    <span className="text-xs text-white/60">Not rated</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
