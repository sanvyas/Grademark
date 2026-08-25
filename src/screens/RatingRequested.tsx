import { useNavigate, useParams } from 'react-router-dom'
import { PackageSearch } from 'lucide-react'
import { AppHeader } from '@/components/AppHeader'
import { Button } from '@/components/ui/button'

export default function RatingRequested() {
  const { barcode = '' } = useParams()
  const navigate = useNavigate()

  return (
    <div className="flex h-dvh flex-col">
      <AppHeader onBack={() => navigate('/')} />
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-verdict-unverifiable/12">
          <PackageSearch className="h-8 w-8 text-verdict-unverifiable" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">We don&apos;t have this one yet</h1>
          <p className="text-sm text-muted-foreground">
            Barcode <span className="font-medium text-foreground">{barcode}</span> isn&apos;t in our database. We&apos;ve
            logged it for our team to review and rate.
          </p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-2">
          <Button size="lg" onClick={() => navigate('/')}>
            Scan another product
          </Button>
          <Button size="lg" variant="ghost" onClick={() => navigate('/history')}>
            View scan history
          </Button>
        </div>
      </div>
    </div>
  )
}
