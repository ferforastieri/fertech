import { cn } from '@/components/lib'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted/80 dark:bg-muted/40',
        className,
      )}
    />
  )
}
