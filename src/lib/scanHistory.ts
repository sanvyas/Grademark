/**
 * Recent scans + scan history — kept entirely in localStorage. There is no login/account
 * system in v1, so this is per-device, per-browser only.
 */

const STORAGE_KEY = 'grademark:scan-history'
const MAX_ENTRIES = 50

export interface ScanHistoryEntry {
  barcode: string
  productName: string | null
  brandName: string | null
  imageUrl: string | null
  /** null when the scan resulted in "not found" (a rating request was filed instead). */
  grade: string | null
  scannedAt: string
}

function readAll(): ScanHistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as ScanHistoryEntry[]) : []
  } catch {
    return []
  }
}

function writeAll(entries: ScanHistoryEntry[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // Private browsing / quota-exceeded: history is a convenience, fail silently rather than
    // breaking the scan flow.
  }
}

export function getScanHistory(): ScanHistoryEntry[] {
  return readAll().sort((a, b) => b.scannedAt.localeCompare(a.scannedAt))
}

export function getRecentScans(limit = 8): ScanHistoryEntry[] {
  return getScanHistory().slice(0, limit)
}

export function addScanHistoryEntry(entry: Omit<ScanHistoryEntry, 'scannedAt'>): void {
  const deduped = readAll().filter((existing) => existing.barcode !== entry.barcode)
  deduped.unshift({ ...entry, scannedAt: new Date().toISOString() })
  writeAll(deduped.slice(0, MAX_ENTRIES))
}

export function clearScanHistory(): void {
  writeAll([])
}
