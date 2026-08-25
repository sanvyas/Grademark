/**
 * Shared gram -> teaspoon conversion for the nutrient snapshot, so the Result screen and any
 * other screen showing "X teaspoons of sugar/salt" stay consistent.
 */

const GRAMS_PER_TEASPOON_SUGAR = 4 // standard nutrition-labeling approximation
const MG_SODIUM_PER_TEASPOON_SALT = 2300 // ~6g salt ≈ 2300mg sodium

export function sugarGramsToTeaspoons(grams: number): number {
  return grams / GRAMS_PER_TEASPOON_SUGAR
}

export function sodiumMgToSaltTeaspoons(mg: number): number {
  return mg / MG_SODIUM_PER_TEASPOON_SALT
}

/** Rounds to the nearest quarter-teaspoon and trims trailing zeros: 3, 3.25, 3.5, 0.75 */
export function formatTeaspoons(teaspoons: number): string {
  if (teaspoons <= 0) return '0'
  const rounded = Math.round(teaspoons * 4) / 4
  return String(rounded)
}
