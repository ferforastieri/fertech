import { ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { forwardRef, useState, useRef, useEffect } from 'react'
import { cn } from '../../lib'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  label?: string
  error?: string
  placeholder?: string
  options: SelectOption[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  mode?: 'single' | 'multi'
  searchable?: boolean
  disabled?: boolean
  className?: string
  id?: string
  name?: string
  required?: boolean
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ 
    className, 
    label, 
    error, 
    placeholder, 
    options, 
    value, 
    onChange, 
    mode = 'single', 
    searchable = true, 
    disabled = false,
    id,
    required = false
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedValues, setSelectedValues] = useState<string[]>([])
    const selectRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    
    useEffect(() => {
      if (value) {
        setSelectedValues(Array.isArray(value) ? value : [value])
      } else {
        setSelectedValues([])
      }
    }, [value])

    
    const filteredOptions = options.filter(option =>
      option.label?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    
    const selectedOptions = options.filter(option => 
      selectedValues.includes(option.value)
    )

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen)
        if (!isOpen && searchable) {
          setTimeout(() => inputRef.current?.focus(), 0)
        }
      }
    }

    const handleSelect = (optionValue: string) => {
      if (mode === 'single') {
        setSelectedValues([optionValue])
        onChange?.(optionValue)
        setIsOpen(false)
        setSearchTerm('')
      } else {
        const newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter(v => v !== optionValue)
          : [...selectedValues, optionValue]
        setSelectedValues(newValues)
        onChange?.(newValues)
      }
    }

    const handleRemove = (optionValue: string) => {
      const newValues = selectedValues.filter(v => v !== optionValue)
      setSelectedValues(newValues)
      onChange?.(newValues)
    }

    const handleClear = () => {
      setSelectedValues([])
      onChange?.(mode === 'single' ? '' : [])
    }


    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          setSearchTerm('')
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
      <div className="space-y-2 w-full" ref={ref}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative w-full" ref={selectRef}>
          <div
            className={cn(
              'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100',
              'dark:focus:ring-blue-600',
              error && 'border-red-500 focus:ring-red-500',
              isOpen && 'ring-2 ring-blue-600 border-transparent',
              className
            )}
            onClick={handleToggle}
          >
            <div className="flex-1 flex items-center gap-2 min-w-0">
              {selectedOptions.length === 0 ? (
                <span className="text-gray-500 dark:text-gray-400">
                  {placeholder || 'Selecione uma opção'}
                </span>
              ) : mode === 'single' ? (
                <span className="truncate">{selectedOptions[0]?.label}</span>
              ) : (
                <div className="flex flex-wrap gap-1 min-w-0">
                  {selectedOptions.slice(0, 3).map((option) => (
                    <span
                      key={option.value}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/10 text-blue-600 text-xs rounded-md"
                    >
                      {option.label}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemove(option.value)
                        }}
                        className="hover:text-blue-700"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedOptions.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{selectedOptions.length - 3} mais
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {selectedValues.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-400" />
                </button>
              )}
              <ChevronDownIcon 
                className={cn(
                  "h-4 w-4 text-gray-400 transition-transform",
                  isOpen && "rotate-180"
                )} 
              />
            </div>
          </div>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden mb-2">
              {searchable && (
                <div className="p-3 border-b border-gray-200 dark:border-gray-600 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar..."
                      className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 min-w-0"
                      onClick={(e) => e.stopPropagation()}
                      style={{ minWidth: '120px' }}
                    />
                  </div>
                </div>
              )}
              
              <div className="overflow-y-auto pb-3" style={{ maxHeight: searchable ? '180px' : '220px' }}>
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    Nenhuma opção encontrada
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        'px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
                        'flex items-center gap-3 min-w-0',
                        selectedValues.includes(option.value) && 'bg-blue-600/10 text-blue-600',
                        option.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                    >
                      {mode === 'multi' && (
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={selectedValues.includes(option.value)}
                            onChange={() => {}}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 focus:ring-2"
                          />
                        </div>
                      )}
                      <span className="flex-1">{option.label}</span>
                      {selectedValues.includes(option.value) && mode === 'single' && (
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }

