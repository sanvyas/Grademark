import { useLocation } from 'react-router-dom'
import { useAsync } from './useAsync'
import { getProductReport, type ProductReport } from '@/data/queries'

interface ScanLocationState {
  report?: ProductReport
}

/**
 * Result/detail screens reuse the report the Scanning screen already fetched (passed via
 * router state) when navigated to from a live scan, so there's no double fetch on the happy
 * path. Direct navigation — a deep link, a browser refresh, tapping a history entry — has no
 * router state, so it fetches fresh.
 */
export function useProductReport(barcode: string) {
  const location = useLocation()
  const preloaded = (location.state as ScanLocationState | null)?.report
  const fetched = useAsync(() => getProductReport(barcode), [barcode], { enabled: !preloaded })

  if (preloaded) {
    return { data: preloaded, loading: false, error: null }
  }
  return fetched
}
