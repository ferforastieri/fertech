import { Navigate } from 'react-router-dom'
import { Skeleton } from '@/components/ui/feedback'
import { useAdminSession } from '@/api/admin/useAdminSession'

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAdminSession()

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </main>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
