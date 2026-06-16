import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/components/lib'
import { Locale, localeOptions, useLanguage } from '@/contexts/language/LanguageContext'

function FlagIcon({ locale }: { locale: Locale }) {
  if (locale === 'pt-BR') {
    return (
      <span className="relative block h-4 w-5 overflow-hidden rounded-[3px] bg-[#009b3a] shadow-sm ring-1 ring-black/10" aria-hidden="true">
        <span className="absolute left-1/2 top-1/2 h-[0.72rem] w-[0.72rem] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#ffdf00]" />
        <span className="absolute left-1/2 top-1/2 h-[0.46rem] w-[0.46rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[#002776]">
          <span className="absolute left-1/2 top-[0.2rem] h-px w-[0.64rem] -translate-x-1/2 rotate-[14deg] rounded-full bg-white/95" />
        </span>
      </span>
    )
  }

  if (locale === 'en') {
    return (
      <span
        className="relative block h-4 w-5 overflow-hidden rounded-[3px] shadow-sm ring-1 ring-black/10"
        style={{ background: 'repeating-linear-gradient(to bottom, #b22234 0 2px, #fff 2px 4px)' }}
        aria-hidden="true"
      >
        <span className="absolute left-0 top-0 h-[8px] w-[9px] bg-[#3c3b6e]" />
      </span>
    )
  }

  return (
    <span
      className="block h-4 w-5 overflow-hidden rounded-[3px] shadow-sm ring-1 ring-black/10"
      style={{ background: 'linear-gradient(to bottom, #aa151b 0 25%, #f1bf00 25% 75%, #aa151b 75% 100%)' }}
      aria-hidden="true"
    />
  )
}

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
        'relative inline-flex shrink-0 items-center justify-center',
        compact ? 'w-10' : 'w-11',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="group grid h-full min-h-0 w-full appearance-none place-items-center rounded-full border border-transparent bg-transparent p-0 text-current leading-none outline-none ring-0 transition hover:bg-current/10 focus:outline-none focus-visible:outline-none focus-visible:ring-0 [-webkit-tap-highlight-color:transparent]"
        aria-label="Selecionar idioma"
        aria-expanded={isOpen}
        title={selectedOption.label}
      >
        <FlagIcon locale={selectedOption.value} />
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
                  'grid h-10 w-full place-items-center rounded-xl text-lg leading-none transition',
                  active ? 'bg-primary/15 ring-1 ring-primary/40' : 'hover:bg-accent hover:text-accent-foreground',
                )}
                title={option.label}
              >
                <FlagIcon locale={option.value} />
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
