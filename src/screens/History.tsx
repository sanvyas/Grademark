import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { History as HistoryIcon, Trash2 } from 'lucide-react'
import { getScanHistory, clearScanHistory, type ScanHistoryEntry } from '@/lib/scanHistory'
import { AppHeader } from '@/components/AppHeader'
import { EmptyState } from '@/components/EmptyState'
import { GradeBadge } from '@/components/GradeBadge'
import { Button } from '@/components/ui/button'
import { isValidGrade } from '@/lib/grade'

export default function History() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<ScanHistoryEntry[]>(() => getScanHistory())

  return (
    <div className="min-h-dvh bg-background pb-10">
      <AppHeader
        title="Scan history"
        right={
          entries.length > 0 ? (
            <button
              type="button"
              aria-label="Clear scan history"
              onClick={() => {
                clearScanHistory()
                setEntries([])
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary active:scale-95"
            >
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : undefined
        }
      />

      {entries.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No scans yet"
          description="Products you scan will show up here so you can revisit their rating."
          action={<Button onClick={() => navigate('/')}>Scan a product</Button>}
        />
      ) : (
        <div className="space-y-2 px-4 pt-2">
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
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left active:scale-[0.99]"
            >
              {entry.imageUrl ? (
                <img src={entry.imageUrl} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
              ) : (
                <div className="h-14 w-14 shrink-0 rounded-xl bg-secondary" aria-hidden="true" />
              )}
              <div className="min-w-0 flex-1">
                {entry.brandName && <p className="truncate text-xs text-muted-foreground">{entry.brandName}</p>}
                <p className="truncate text-sm font-semibold">{entry.productName ?? `Barcode ${entry.barcode}`}</p>
                <p className="text-xs text-muted-foreground">{new Date(entry.scannedAt).toLocaleString()}</p>
              </div>
              {entry.grade && isValidGrade(entry.grade) ? (
                <GradeBadge grade={entry.grade} size="sm" />
              ) : (
                <span className="shrink-0 text-xs text-muted-foreground">Not rated</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
