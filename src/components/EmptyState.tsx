import type { LucideIcon } from 'lucide-react'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  )
}
