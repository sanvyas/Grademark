import { cn } from '@/lib/utils'
import { gradeLabel, type Grade } from '@/lib/grade'

const SIZE_CLASSES = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-14 w-14 text-lg',
  lg: 'h-24 w-24 text-3xl',
  xl: 'h-32 w-32 text-5xl',
} as const

// Written as literal class strings (not template-composed) so Tailwind's JIT scanner picks them up.
const GRADE_BG_CLASSES: Record<Grade, string> = {
  AAA: 'bg-grade-aaa',
  AA: 'bg-grade-aa',
  A: 'bg-grade-a',
  B: 'bg-grade-b',
  C: 'bg-grade-c',
  D: 'bg-grade-d',
}

export function GradeBadge({
  grade,
  size = 'md',
  className,
}: {
  grade: Grade
  size?: keyof typeof SIZE_CLASSES
  className?: string
}) {
  return (
    <div
      role="img"
      aria-label={`Grade ${grade}: ${gradeLabel(grade)}`}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-extrabold text-white shadow-sm',
        GRADE_BG_CLASSES[grade],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {grade}
    </div>
  )
}
