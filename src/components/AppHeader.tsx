import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function AppHeader({
  title,
  onBack,
  transparent = false,
  right,
  className,
}: {
  title?: string
  onBack?: () => void
  transparent?: boolean
  right?: React.ReactNode
  className?: string
}) {
  const navigate = useNavigate()
  return (
    <header
      className={cn(
        'safe-top sticky top-0 z-20 flex h-14 items-center gap-2 px-2',
        transparent ? 'bg-transparent' : 'border-b border-border bg-background/95 backdrop-blur',
        className,
      )}
    >
      <button
        type="button"
        aria-label="Go back"
        onClick={() => (onBack ? onBack() : navigate(-1))}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-secondary active:scale-95"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
      </button>
      {title && <h1 className="flex-1 truncate text-base font-semibold">{title}</h1>}
      {right ?? <div className="w-10" />}
    </header>
  )
}
