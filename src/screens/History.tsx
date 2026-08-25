import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { History as HistoryIcon, Trash2, ChevronRight } from 'lucide-react'
import { getScanHistory, clearScanHistory, type ScanHistoryEntry } from '@/lib/scanHistory'
import { relativeTime } from '@/lib/relativeTime'
import { BottomTabBar } from '@/components/BottomTabBar'
import { EmptyState } from '@/components/EmptyState'
import { GradeBadge } from '@/components/GradeBadge'
import { Button } from '@/components/ui/button'
import { isValidGrade } from '@/lib/grade'

export default function History() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<ScanHistoryEntry[]>(() => getScanHistory())

  return (
    <div className="relative min-h-dvh bg-background pb-[108px]">
      <header className="safe-top flex items-center justify-between px-5 pb-2.5 pt-[54px]">
        <h1 className="text-[28px] font-extrabold text-[#1A1A1A]">Scan History</h1>
        {entries.length > 0 && (
          <button
            type="button"
            aria-label="Clear scan history"
            onClick={() => {
              clearScanHistory()
              setEntries([])
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.06] active:scale-95"
          >
            <Trash2 className="h-4 w-4 text-black/60" aria-hidden="true" />
          </button>
        )}
      </header>

      {entries.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No scans yet"
          description="Products you scan will show up here so you can revisit their rating."
          action={<Button onClick={() => navigate('/')}>Scan a product</Button>}
        />
      ) : (
        <div className="flex flex-col gap-2.5 px-[18px] pt-1">
          {entries.map((entry) => (
            <button
              key={entry.barcode}
              type="button"
              onClick={() =>
                navigate(
                  entry.grade
                    ? `/product/${encodeURIComponent(entry.barcode)}`
                    : `/not-found/${encodeURIComponent(entry.barcode)}`,
                )
              }
              className="flex w-full items-center gap-3 rounded-2xl border border-black/[0.06] bg-white p-3 text-left"
            >
              {entry.grade && isValidGrade(entry.grade) ? (
                <GradeBadge grade={entry.grade} size="xs" />
              ) : (
                <div className="flex h-[41px] w-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.06] text-xs font-bold text-black/40">
                  ?
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-[#1A1A1A]">{entry.productName ?? `Barcode ${entry.barcode}`}</div>
                <div className="truncate text-xs text-black/45">
                  {entry.brandName ? `${entry.brandName} · ` : ''}
                  {relativeTime(entry.scannedAt)}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-black/25" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      <BottomTabBar active="history" />
    </div>
  )
}
