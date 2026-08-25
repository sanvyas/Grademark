export type Grade = 'AAA' | 'AA' | 'A' | 'B' | 'C' | 'D'

// Ordered best -> worst. Index is used to compare grades ("strictly better than").
export const GRADE_ORDER: Grade[] = ['AAA', 'AA', 'A', 'B', 'C', 'D']

export function isValidGrade(value: string): value is Grade {
  return (GRADE_ORDER as string[]).includes(value)
}

export function isStrictlyBetterGrade(a: Grade, b: Grade): boolean {
  return GRADE_ORDER.indexOf(a) < GRADE_ORDER.indexOf(b)
}

const GRADE_LABEL: Record<Grade, string> = {
  AAA: 'Excellent',
  AA: 'Very good',
  A: 'Good',
  B: 'Fair',
  C: 'Poor',
  D: 'Very poor',
}

export function gradeLabel(grade: Grade): string {
  return GRADE_LABEL[grade]
}

// oklch hue per grade — AAA reads as the deepest green, D as a warm red-orange.
const GRADE_HUES: Record<Grade, number> = { AAA: 150, AA: 135, A: 105, B: 78, C: 48, D: 22 }

/** Badge fill. */
export function gradeBg(grade: Grade): string {
  return `oklch(0.56 0.1 ${GRADE_HUES[grade]})`
}

/** Darker shade for the badge's inset-shadow bevel along its bottom edge. */
export function gradeBevel(grade: Grade): string {
  return `oklch(0.44 0.1 ${GRADE_HUES[grade]})`
}
