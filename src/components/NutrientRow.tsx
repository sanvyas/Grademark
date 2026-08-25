import { cn } from '@/lib/utils'

export function NutrientRow({
  label,
  value,
  unit,
  sublabel,
  level,
}: {
  label: string
  value: number | string
  unit: string
  sublabel?: string
  level?: 'good' | 'moderate' | 'high'
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/70 py-2.5 last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold tabular-nums">
          {value}
          <span className="ml-0.5 font-normal text-muted-foreground">{unit}</span>
        </span>
        {level && (
          <span
            aria-hidden="true"
            className={cn(
              'h-2 w-2 rounded-full',
              level === 'good' && 'bg-grade-aaa',
              level === 'moderate' && 'bg-grade-b',
              level === 'high' && 'bg-grade-d',
            )}
          />
        )}
      </div>
    </div>
  )
}
