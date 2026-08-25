import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

export default function NotFoundRoute() {
  const navigate = useNavigate()
  return (
    <div className="flex h-dvh flex-col">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="That page doesn't exist."
        action={<Button onClick={() => navigate('/')}>Back to scanner</Button>}
      />
    </div>
  )
}
