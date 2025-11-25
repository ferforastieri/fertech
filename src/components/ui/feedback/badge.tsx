import { forwardRef } from 'react'
import { cn } from '../../lib'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-blue-600 text-white border-blue-600 dark:bg-blue-600 dark:text-white dark:border-blue-600',
      secondary: 'bg-gray-100 text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
      destructive: 'bg-red-500 text-white border-red-500 dark:bg-red-600 dark:text-white dark:border-red-600',
      outline: 'text-gray-900 border-gray-200 dark:text-gray-100 dark:border-gray-700',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }

