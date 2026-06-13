import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowPathRoundedSquareIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  HomeIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { ThemeToggle } from '@/components/ui/feedback'
import { ExperienceProvider, saveExperienceMode } from '@/lib/experience'
import AuroraScene from './AuroraScene'
import AuroraPointerEffects from './AuroraPointerEffects'
import { cn } from '@/components/lib'

const navItems = [
  { name: 'Início', href: '/aurora', icon: HomeIcon },
  { name: 'Blog', href: '/aurora/blog', icon: DocumentTextIcon },
  { name: 'Projetos', href: '/aurora/projects', icon: BriefcaseIcon },
  { name: 'Currículo', href: '/aurora/resume', icon: UserIcon },
]

export default function AuroraLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const shouldBeDark = savedTheme !== 'light'
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    document.documentElement.classList.toggle('dark', newDark)
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
  }

  const switchToClassic = () => {
    saveExperienceMode('classic')
    navigate('/classic')
  }

  return (
    <ExperienceProvider mode="aurora">
      <div className={cn(
        'aurora-shell relative min-h-screen overflow-x-hidden transition-colors',
        isDark ? 'aurora-dark bg-[#040001] text-white' : 'aurora-light bg-[#fbf7f8] text-[#140407]'
      )}>
        <AuroraScene theme={isDark ? 'dark' : 'light'} />
        <AuroraPointerEffects />
        <header className="fixed left-0 right-0 top-4 z-50 px-4">
          <nav className={cn(
            'mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border px-3 shadow-2xl backdrop-blur-xl',
            isDark
              ? 'border-rose-900/45 bg-black/60 shadow-rose-950/45'
              : 'border-rose-900/25 bg-white/95 shadow-rose-950/15'
          )}>
            <Link to="/aurora" className={cn('flex items-center gap-2 rounded-full px-2 text-sm font-semibold tracking-[0.18em]', isDark ? 'text-white' : 'text-[#140407]')}>
              <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
            </Link>
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full transition sm:w-auto sm:px-3 ${
                      isActive
                        ? isDark ? 'text-white' : 'text-rose-900'
                        : isDark ? 'text-white/72 hover:text-white' : 'text-rose-900 hover:bg-rose-950/10'
                    }`}
                    aria-label={item.name}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="aurora-nav-pill"
                        className={cn(
                          'absolute inset-0 rounded-full',
                          isDark ? 'bg-rose-900' : 'border border-rose-900/70 bg-transparent'
                        )}
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      />
                    )}
                    <Icon className="relative h-5 w-5" />
                    <span className="relative ml-2 hidden text-sm font-medium sm:inline">{item.name}</span>
                  </Link>
                )
              })}
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle
                theme={isDark ? 'dark' : 'light'}
                onToggle={toggleTheme}
                variant="ghost"
                size="sm"
                className={isDark ? 'text-white hover:bg-white/10' : 'text-[#140407] hover:bg-rose-950/10'}
              />
              <button
                type="button"
                onClick={switchToClassic}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full transition',
                  isDark ? 'text-white/72 hover:bg-white/10 hover:text-white' : 'text-[#140407] hover:bg-rose-950/10'
                )}
                aria-label="Trocar para modo tradicional"
                title="Trocar para modo tradicional"
              >
                <ArrowPathRoundedSquareIcon className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </header>
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </ExperienceProvider>
  )
}
