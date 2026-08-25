import { useParams } from 'react-router-dom'
import { ListTree, ShieldAlert } from 'lucide-react'
import { useProductReport } from '@/hooks/useProductReport'
import { AppHeader } from '@/components/AppHeader'
import { EmptyState } from '@/components/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ConcernLevel } from '@/types/database'

const CONCERN_LABEL: Record<Exclude<ConcernLevel, 'none'>, string> = {
  low: 'Low concern',
  moderate: 'Moderate concern',
  high: 'High concern',
}

export default function IngredientDetail() {
  const { barcode = '' } = useParams()
  const { data: report, loading, error } = useProductReport(barcode)

  if (loading) {
    return (
      <div className="min-h-dvh bg-background">
        <AppHeader title="Ingredients" />
        <div className="space-y-2 px-4 pt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex h-dvh flex-col">
        <AppHeader title="Ingredients" />
        <EmptyState icon={ListTree} title="Couldn't load ingredients" description={error ?? 'Something went wrong.'} />
      </div>
    )
  }

  const { ingredients, allergens } = report

  return (
    <div className="min-h-dvh bg-background pb-10">
      <AppHeader title="Ingredients" />
      <div className="space-y-4 px-4 pt-2">
        {allergens.length > 0 && (
          <Card className="border-verdict-misleading/30 bg-verdict-misleading/8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-verdict-misleading">
                <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                Contains allergens
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-0">
              {allergens.map((a) => (
                <Badge key={a.id} variant="destructive">
                  {a.name}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        {ingredients.length === 0 ? (
          <EmptyState icon={ListTree} title="No ingredient data" description="We don't have an ingredient list on file for this product yet." />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Full ingredient list</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/70 pt-0">
              {ingredients.map((ingredient) => (
                <div key={ingredient.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium">
                      {ingredient.name}
                      {ingredient.additive_code && (
                        <span className="ml-1.5 text-xs text-muted-foreground">({ingredient.additive_code})</span>
                      )}
                    </p>
                    {ingredient.is_additive && <p className="text-xs text-muted-foreground">Additive</p>}
                  </div>
                  {ingredient.concern_level && ingredient.concern_level !== 'none' && (
                    <Badge
                      variant={ingredient.concern_level === 'high' ? 'destructive' : 'warning'}
                      className={cn('shrink-0')}
                    >
                      {CONCERN_LABEL[ingredient.concern_level]}
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
