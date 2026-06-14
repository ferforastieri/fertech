import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/components/lib'
import { localeOptions, useLanguage } from '@/contexts/language/LanguageContext'

export function LanguageSelect({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { locale, setLocale } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 })
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const selectedOption = localeOptions.find((option) => option.value === locale) ?? localeOptions[0]

  useLayoutEffect(() => {
    if (!isOpen || !rootRef.current) return

    const updatePosition = () => {
      if (!rootRef.current) return
      const rect = rootRef.current.getBoundingClientRect()
      const width = Math.max(rect.width, 48)
      const left = Math.min(Math.max(8, rect.right - width), window.innerWidth - width - 8)
      const top = Math.min(rect.bottom + 8, window.innerHeight - 156)

      setMenuPosition({ top, left, width })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [compact, isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative inline-flex shrink-0',
        compact ? 'w-10' : 'w-11',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="group inline-flex h-full min-h-9 w-full appearance-none items-center justify-center rounded-full border border-transparent bg-transparent p-0 text-current outline-none ring-0 transition hover:bg-current/10 focus:outline-none focus-visible:outline-none focus-visible:ring-0 [-webkit-tap-highlight-color:transparent]"
        aria-label="Selecionar idioma"
        aria-expanded={isOpen}
        title={selectedOption.label}
      >
        <span className="text-lg leading-none" aria-hidden="true">
          {selectedOption.flag}
        </span>
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[9999] overflow-hidden rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-2xl shadow-black/20 backdrop-blur-xl"
          style={{ top: menuPosition.top, left: menuPosition.left, width: menuPosition.width }}
        >
          {localeOptions.map((option) => {
            const active = option.value === locale

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setLocale(option.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'grid h-10 w-full place-items-center rounded-xl text-lg transition',
                  active ? 'bg-primary/15 ring-1 ring-primary/40' : 'hover:bg-accent hover:text-accent-foreground',
                )}
                title={option.label}
              >
                <span className="text-lg leading-none" aria-hidden="true">{option.flag}</span>
                <span className="sr-only">{option.label}</span>
              </button>
            )
          })}
        </div>,
        document.body,
      )}
    </div>
  )
}
