import { gradeBevel, gradeBg, gradeLabel, type Grade } from '@/lib/grade'
import { cn } from '@/lib/utils'

const HEX_CLIP = 'polygon(50% 0%, 100% 16%, 100% 58%, 82% 86%, 50% 100%, 18% 86%, 0% 58%, 0% 16%)'

const SIZES = {
  xs: { w: 36, h: 41, fontSize: 13, letterSpacing: '-0.5px', bevel: 5 },
  sm: { w: 58, h: 67, fontSize: 21, letterSpacing: '-0.8px', bevel: 6 },
  lg: { w: 106, h: 122, fontSize: 42, letterSpacing: '-1.5px', bevel: 10 },
} as const

/** Hexagonal "shield" grade badge — matches the GradeMark design system exactly. */
export function GradeBadge({
  grade,
  size = 'xs',
  className,
}: {
  grade: Grade
  size?: keyof typeof SIZES
  className?: string
}) {
  const s = SIZES[size]
  return (
    <div
      role="img"
      aria-label={`Grade ${grade}: ${gradeLabel(grade)}`}
      className={cn('relative shrink-0', className)}
      style={{ width: s.w, height: s.h }}
    >
      <div
        className="absolute inset-0"
        style={{
          clipPath: HEX_CLIP,
          background: gradeBg(grade),
          boxShadow:
            size === 'lg'
              ? `inset 0 -${s.bevel}px 14px ${gradeBevel(grade)}, inset 0 2px 0 rgba(255,255,255,0.28)`
              : `inset 0 -${s.bevel}px 8px ${gradeBevel(grade)}`,
        }}
      />
      <span
        className="relative flex h-full items-center justify-center font-extrabold text-white"
        style={{
          fontSize: s.fontSize,
          letterSpacing: s.letterSpacing,
          textShadow: size === 'lg' ? '0 1px 2px rgba(0,0,0,0.18)' : undefined,
        }}
      >
        {grade}
      </span>
    </div>
  )
}
