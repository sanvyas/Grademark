import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Keyboard, WifiOff, VideoOff, ShieldAlert } from 'lucide-react'
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { getRecentScans } from '@/lib/scanHistory'
import { GradeBadge } from '@/components/GradeBadge'
import { Viewfinder } from '@/components/Viewfinder'
import { BottomTabBar } from '@/components/BottomTabBar'
import { Button } from '@/components/ui/button'
import { isValidGrade } from '@/lib/grade'

const HATCH_BG = {
  backgroundImage:
    'repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 6px)',
}

export default function HomeScan() {
  const navigate = useNavigate()
  const online = useOnlineStatus()
  const [manualOpen, setManualOpen] = useState(false)
  const [manualBarcode, setManualBarcode] = useState('')
  const recentScans = getRecentScans(5)

  const handleDetect = useCallback(
    (barcode: string) => {
      navigate(`/scanning/${encodeURIComponent(barcode)}`)
    },
    [navigate],
  )

  const { videoRef, status, error } = useBarcodeScanner({ onDetect: handleDetect, enabled: !manualOpen })

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[#0A0A0B] text-white" style={HATCH_BG}>
      <video
        ref={videoRef}
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/5 to-black/60" />

      <header className="safe-top relative z-10 flex items-center gap-1.5 px-[18px] pt-3">
        <span className="text-base font-extrabold tracking-[-0.3px]">GradeMark</span>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'oklch(0.7 0.09 150)' }} />
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-3.5 px-6">
        {status === 'scanning' && (
          <>
            <Viewfinder />
            <p className="text-center text-[13px] tracking-[0.03em] text-white/55">
              Line up the barcode inside the frame
            </p>
          </>
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
        <div className="relative z-10 mx-[18px] mb-2 flex items-center gap-2 rounded-xl bg-amber-500/15 px-3 py-2 text-xs font-medium text-amber-300">
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline — scanning needs a connection, but your recent scans still work below.
        </div>
      )}

      <div className="safe-bottom relative z-10 space-y-3 px-[18px] pb-[108px] pt-2">
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
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-white/50">Recent scans</div>
            <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1">
              {recentScans.map((scan) => (
                <button
                  key={scan.barcode}
                  type="button"
                  onClick={() => navigate(`/product/${encodeURIComponent(scan.barcode)}`)}
                  className="flex w-[94px] shrink-0 flex-col items-center gap-1.5 rounded-[14px] bg-white/[0.08] p-2.5"
                >
                  {scan.grade && isValidGrade(scan.grade) ? (
                    <GradeBadge grade={scan.grade} size="xs" />
                  ) : (
                    <div className="flex h-[41px] w-9 items-center justify-center rounded-lg bg-white/15 text-xs font-bold text-white/50">
                      ?
                    </div>
                  )}
                  <div className="w-full truncate text-center text-[11px] font-bold leading-tight text-white">
                    {scan.productName ?? 'Not rated yet'}
                  </div>
                  {scan.brandName && <div className="truncate text-[10px] text-white/45">{scan.brandName}</div>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomTabBar active="scan" />
    </div>
  )
}
