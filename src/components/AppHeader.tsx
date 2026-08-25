import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

function IconButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.06] active:scale-95"
    >
      {children}
    </button>
  )
}

/** Small-caps section eyebrow header used on every light ("paper") screen — matches the design's RATING REPORT / INGREDIENT / COMPLIANCE style headers. */
export function AppHeader({
  title,
  onBack,
  right,
  className,
}: {
  title?: string
  onBack?: () => void
  right?: React.ReactNode
  className?: string
}) {
  const navigate = useNavigate()
  return (
    <header className={cn('safe-top sticky top-0 z-20 flex items-center justify-between px-4 pb-2 pt-3', className)}>
      <IconButton label="Go back" onClick={() => (onBack ? onBack() : navigate(-1))}>
        <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
          <path
            d="M7.5 1.5L1.5 7.5l6 6"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </IconButton>
      {title && (
        <div className="text-[11px] font-bold tracking-[0.08em] text-black/40">{title.toUpperCase()}</div>
      )}
      {right ?? <div className="w-9" />}
    </header>
  )
}
