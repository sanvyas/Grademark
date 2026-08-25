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

const GRADE_TOKEN: Record<Grade, string> = {
  AAA: 'grade-aaa',
  AA: 'grade-aa',
  A: 'grade-a',
  B: 'grade-b',
  C: 'grade-c',
  D: 'grade-d',
}

export function gradeColorToken(grade: Grade): string {
  return GRADE_TOKEN[grade]
}
