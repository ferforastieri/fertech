import { QueryCache, QueryClient } from '@tanstack/react-query'
import { notifyError } from '@/components/ui/feedback/notifications'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => notifyError('Erro ao carregar dados do Supabase', error),
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
