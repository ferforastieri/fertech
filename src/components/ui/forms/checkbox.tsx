import { CheckIcon } from '@heroicons/react/24/outline'
import { forwardRef, useState } from 'react'
import { cn } from '../../lib'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  error?: string
  labelClassName?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      error,
      labelClassName,
      id,
      checked: controlledChecked,
      onChange,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const [internalChecked, setInternalChecked] = useState(
      props.defaultChecked || false
    )

    const isChecked =
      controlledChecked !== undefined ? controlledChecked : internalChecked

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (controlledChecked === undefined) {
        setInternalChecked(e.target.checked)
      }
      onChange?.(e)
    }

    return (
      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              id={checkboxId}
              className="sr-only"
              ref={ref}
              checked={isChecked}
              onChange={handleChange}
              {...props}
            />
            <div
              className={cn(
                'w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer flex items-center justify-center',
                'border-gray-300 bg-white hover:border-blue-600',
                isChecked &&
                  'bg-blue-600 border-blue-600 hover:bg-blue-700',
                'focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2',
                props.disabled && 'opacity-50 cursor-not-allowed',
                'dark:border-gray-600 dark:bg-gray-800 dark:hover:border-blue-600',
                isChecked && 'dark:bg-blue-600 dark:border-blue-600',
                error && 'border-red-500',
                error && isChecked && 'bg-red-500 border-red-500',
                className
              )}
              onClick={() => {
                if (checkboxId && !props.disabled) {
                  const input = document.getElementById(
                    checkboxId
                  ) as HTMLInputElement
                  if (input) {
                    input.click()
                  }
                }
              }}
            >
              <CheckIcon
                className={cn(
                  'w-3 h-3 text-white transition-opacity duration-200',
                  isChecked ? 'opacity-100' : 'opacity-0'
                )}
              />
            </div>
          </div>

          {(label || description) && (
            <div className="flex-1 min-w-0">
              {label && (
                <label
                  htmlFor={checkboxId || undefined}
                  className={cn(
                    'text-sm font-medium cursor-pointer select-none',
                    'text-gray-900 dark:text-gray-100',
                    props.disabled && 'opacity-50 cursor-not-allowed',
                    error && 'text-red-600 dark:text-red-400',
                    labelClassName
                  )}
                >
                  {label}
                </label>
              )}
              {description && (
                <p
                  className={cn(
                    'text-sm text-gray-500 dark:text-gray-400 mt-1',
                    props.disabled && 'opacity-50',
                    error && 'text-red-500 dark:text-red-400'
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 ml-8">{error}</p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }

