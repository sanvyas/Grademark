import type { VerificationStatus } from '@/types/database'

interface VerdictMeta {
  label: string
  color: string
  soft: string
  mark: string
}

export const VERDICTS: Record<VerificationStatus, VerdictMeta> = {
  verified: { label: 'Verified', color: '#3F7D58', soft: 'rgba(63,125,88,0.12)', mark: '✓' },
  misleading: { label: 'Misleading', color: '#B3452F', soft: 'rgba(179,69,47,0.12)', mark: '✕' },
  unverifiable: { label: 'Unverifiable', color: '#7A7A72', soft: 'rgba(0,0,0,0.06)', mark: '?' },
}

/** Three-state compliance status: true = compliant, false = violation, null = "near limit" warning. */
export function statusColor(good: boolean | null): string {
  return good === true ? '#3F7D58' : good === false ? '#B3452F' : '#B8862E'
}

export function statusChar(good: boolean | null): string {
  return good === true ? '✓' : good === false ? '✕' : '!'
}
