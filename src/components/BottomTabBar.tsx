import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

function ScanIcon({ opacity }: { opacity: number }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ opacity }}>
      <path d="M2 7V3a1 1 0 0 1 1-1h4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 7V3a1 1 0 0 0-1-1h-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2 13v4a1 1 0 0 0 1 1h4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 13v4a1 1 0 0 1-1 1h-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function HistoryIcon({ opacity }: { opacity: number }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ opacity }}>
      <circle cx="10" cy="10" r="7.5" stroke="#fff" strokeWidth="1.6" />
      <path d="M10 6v4l3 2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Floating pill nav shown only on root-level screens (Home / History) — matches the design's Scan/History tab bar. */
export function BottomTabBar({ active }: { active: 'scan' | 'history' }) {
  const navigate = useNavigate()
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[30px] z-20 flex justify-center">
      <div className="pointer-events-auto flex gap-1 rounded-[26px] bg-[#141414]/90 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
        <button
          type="button"
          onClick={() => navigate('/')}
          className={cn(
            'flex min-h-11 items-center justify-center gap-1.5 rounded-[22px] px-[18px]',
            active === 'scan' ? 'bg-white/[0.16]' : 'bg-transparent',
          )}
        >
          <ScanIcon opacity={active === 'scan' ? 1 : 0.55} />
          <span className="text-xs font-bold text-white" style={{ opacity: active === 'scan' ? 1 : 0.55 }}>
            Scan
          </span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/history')}
          className={cn(
            'flex min-h-11 items-center justify-center gap-1.5 rounded-[22px] px-[18px]',
            active === 'history' ? 'bg-white/[0.16]' : 'bg-transparent',
          )}
        >
          <HistoryIcon opacity={active === 'history' ? 1 : 0.55} />
          <span className="text-xs font-bold text-white" style={{ opacity: active === 'history' ? 1 : 0.55 }}>
            History
          </span>
        </button>
      </div>
    </div>
  )
}
