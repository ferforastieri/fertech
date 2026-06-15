import { Suspense, useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  ArrowPathRoundedSquareIcon,
  BriefcaseIcon,
  BeakerIcon,
  DocumentTextIcon,
  HomeIcon,
  ShareIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { ThemeToggle } from '@/components/ui/feedback'
import {
  ExperienceProvider,
  saveExperienceMode,
} from '@/contexts/experience/ExperienceContext'
import AuroraScene from './AuroraScene'
import AuroraPointerEffects from './AuroraPointerEffects'
import { cn } from '@/components/lib'
import { useProfileContent } from '@/api/profile/useProfileContent'
import { renderSocialIcon } from '@/components/profile/renderSocialIcon'
import { AuroraLoading } from './AuroraLoading'
import { useSiteContent } from '@/api/site/useSiteContent'
import { LanguageSelect } from '@/components/language/LanguageSelect'

type AuroraNavPosition = 'top' | 'right' | 'bottom' | 'left'

const navPositions: AuroraNavPosition[] = ['top', 'right', 'bottom', 'left']
const navStorageKey = 'aurora-nav-position'

function getIsMobile() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
}

function getDefaultNavPosition(): AuroraNavPosition {
  return getIsMobile() ? 'bottom' : 'top'
}

export default function AuroraLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(true)
  const [navPosition, setNavPosition] = useState<AuroraNavPosition>(getDefaultNavPosition)
  const [isMobile, setIsMobile] = useState(getIsMobile)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSocialMenuOpen, setIsSocialMenuOpen] = useState(false)
  const { data: profile } = useProfileContent()
  const { data: siteContent } = useSiteContent()
  const isVerticalNav = navPosition === 'left' || navPosition === 'right'
  const isMobileDrawer = isMobile && isVerticalNav

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
    localStorage.setItem('theme', shouldBeDark ? 'dark' : 'light')

    const savedPosition = localStorage.getItem(navStorageKey)
    if (savedPosition && navPositions.includes(savedPosition as AuroraNavPosition)) {
      setNavPosition(savedPosition as AuroraNavPosition)
    } else {
      const defaultPosition = getDefaultNavPosition()
      setNavPosition(defaultPosition)
      localStorage.setItem(navStorageKey, defaultPosition)
    }

    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const handleMobileChange = () => setIsMobile(mobileQuery.matches)
    handleMobileChange()
    mobileQuery.addEventListener('change', handleMobileChange)

    return () => mobileQuery.removeEventListener('change', handleMobileChange)
  }, [])

  if (!siteContent) return null
  const copy = siteContent.navigation
  const navItems = [
    { name: copy.home, href: '/aurora', icon: HomeIcon },
    { name: copy.blog, href: '/aurora/blog', icon: DocumentTextIcon },
    { name: copy.projects, href: '/aurora/projects', icon: BriefcaseIcon },
    { name: copy.resume, href: '/aurora/resume', icon: UserIcon },
    { name: copy.playground, href: '/aurora/playground', icon: BeakerIcon },
  ]

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

  const cycleNavPosition = () => {
    setNavPosition((current) => {
      const nextPosition = navPositions[(navPositions.indexOf(current) + 1) % navPositions.length]
      localStorage.setItem(navStorageKey, nextPosition)
      setIsDrawerOpen(getIsMobile() && (nextPosition === 'left' || nextPosition === 'right'))
      return nextPosition
    })
  }

  const navPositionLabel = {
    top: 'em cima',
    right: 'à direita',
    bottom: 'embaixo',
    left: 'à esquerda',
  }[navPosition]

  const navInitial = {
    top: { opacity: 0, y: -24, scale: 0.96, filter: 'blur(10px)' },
    right: { opacity: 0, x: 24, scale: 0.96, filter: 'blur(10px)' },
    bottom: { opacity: 0, y: 24, scale: 0.96, filter: 'blur(10px)' },
    left: { opacity: 0, x: -24, scale: 0.96, filter: 'blur(10px)' },
  }[navPosition]

  const renderNavContent = (drawer = false) => {
    const vertical = isVerticalNav && !drawer
    const baseDelay = drawer ? 0.16 : 0.04
    const itemInitial = drawer
      ? { opacity: 0, x: navPosition === 'left' ? -24 : 24, y: 8, scale: 0.94, filter: 'blur(10px)' }
      : vertical
        ? { opacity: 0, y: 16, scale: 0.9, rotateX: -24, filter: 'blur(8px)' }
        : { opacity: 0, y: navPosition === 'bottom' ? 14 : -14, scale: 0.94, rotateX: -18, filter: 'blur(8px)' }
    const itemAnimate = { opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }

  const actions = [
      ...((profile?.socialLinks.length ?? 0) > 0 ? [{
        key: 'mobile-socials',
        hideOnMobileBar: false,
        mobileBarOnly: true,
        node: (
          <>
            <button
              type="button"
              onClick={() => setIsSocialMenuOpen((value) => !value)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full transition sm:h-10 sm:w-10',
                isDark ? 'text-white/72 hover:bg-white/10 hover:text-white' : 'text-[#140407] hover:bg-rose-950/10',
              )}
              aria-label={copy.socialLinks}
              aria-expanded={isSocialMenuOpen}
              title={copy.socialLinks}
            >
              <ShareIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <AnimatePresence>
              {isSocialMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: navPosition === 'bottom' ? 10 : -10, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: navPosition === 'bottom' ? 10 : -10, scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'absolute right-2 z-50 flex items-center gap-1 rounded-full border p-1.5 shadow-2xl backdrop-blur-xl sm:hidden',
                    navPosition === 'bottom' ? 'bottom-[calc(100%+0.5rem)]' : 'top-[calc(100%+0.5rem)]',
                    isDark ? 'border-rose-900/45 bg-black/85' : 'border-rose-900/25 bg-white/95',
                  )}
                >
                  {profile?.socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsSocialMenuOpen(false)}
                      className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full transition sm:h-10 sm:w-10',
                        isDark ? 'text-white/72 hover:bg-white/10 hover:text-white' : 'text-rose-900 hover:bg-rose-950/10',
                      )}
                      aria-label={social.name}
                      title={social.name}
                    >
                      {renderSocialIcon(social)}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ),
      }] : []),
      ...(profile?.socialLinks ?? []).map((social) => ({
        key: `social-${social.name}`,
        hideOnMobileBar: true,
        mobileBarOnly: false,
        node: (
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full transition',
              isDark ? 'text-white/72 hover:bg-white/10 hover:text-white' : 'text-[#140407] hover:bg-rose-950/10',
            )}
            aria-label={social.name}
            title={social.name}
          >
            {renderSocialIcon(social)}
          </a>
        ),
      })),
      {
        key: 'language',
        hideOnMobileBar: false,
        mobileBarOnly: false,
        node: (
          <LanguageSelect
            compact
            className="h-8 w-8 sm:h-10 sm:w-10"
          />
        ),
      },
      {
        key: 'theme',
        hideOnMobileBar: false,
        mobileBarOnly: false,
        node: (
          <ThemeToggle
            theme={isDark ? 'dark' : 'light'}
            onToggle={toggleTheme}
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 sm:h-10 sm:w-10',
              isDark ? 'text-white hover:bg-white/10' : 'text-[#140407] hover:bg-rose-950/10',
            )}
          />
        ),
      },
      {
        key: 'position',
        hideOnMobileBar: false,
        mobileBarOnly: false,
        node: (
          <button
            type="button"
            onClick={cycleNavPosition}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition sm:h-10 sm:w-10',
              isDark ? 'text-white/72 hover:bg-white/10 hover:text-white' : 'text-[#140407] hover:bg-rose-950/10',
            )}
            aria-label={`Mover navegação, posição atual ${navPositionLabel}`}
            title={`Mover navegação (${navPositionLabel})`}
          >
            {isVerticalNav ? <ArrowsRightLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" /> : <ArrowsUpDownIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        ),
      },
      {
        key: 'classic',
        hideOnMobileBar: false,
        mobileBarOnly: false,
        node: (
          <button
            type="button"
            onClick={switchToClassic}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition sm:h-10 sm:w-10',
              isDark ? 'text-white/72 hover:bg-white/10 hover:text-white' : 'text-[#140407] hover:bg-rose-950/10',
            )}
            aria-label={copy.switchToClassic}
            title={copy.switchToClassic}
          >
            <ArrowPathRoundedSquareIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        ),
      },
    ]

    return (
      <>
        <motion.div
          key={`logo-${navPosition}-${drawer ? 'drawer' : 'bar'}`}
          className={cn(!drawer && !vertical && 'hidden sm:block')}
          initial={itemInitial}
          animate={itemAnimate}
          transition={{ delay: baseDelay, type: 'spring', stiffness: 460, damping: 28 }}
        >
          <Link
            to="/aurora"
            className={cn(
              'flex items-center gap-2 rounded-full text-sm font-semibold tracking-[0.18em]',
              drawer ? 'justify-center px-3 py-2' : vertical ? 'px-0 py-1' : 'px-2',
              isDark ? 'text-white' : 'text-[#140407]',
            )}
          >
            {profile && <img src={profile.logoUrl} alt="Logo" className="h-8 w-8 object-contain" />}
          </Link>
        </motion.div>

        <div className={cn('flex items-center gap-1', vertical && 'flex-col', drawer && 'w-full flex-col items-stretch gap-2')}>
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <motion.div
                key={`${item.href}-${navPosition}-${drawer ? 'drawer' : 'bar'}-${isDrawerOpen}`}
                initial={itemInitial}
                animate={itemAnimate}
                transition={{ delay: baseDelay + 0.08 + index * 0.07, type: 'spring', stiffness: 420, damping: 26 }}
              >
                <Link
                  to={item.href}
                  className={cn(
                    'relative flex h-8 w-8 items-center justify-center rounded-full transition sm:h-10 sm:w-10',
                    drawer ? 'w-full justify-start gap-3 px-3' : vertical ? '' : 'sm:w-auto sm:px-3',
                    isActive
                      ? isDark ? 'text-white' : 'text-rose-900'
                      : isDark ? 'text-white/72 hover:text-white' : 'text-rose-900 hover:bg-rose-950/10',
                  )}
                  aria-label={item.name}
                >
                  {isActive && (
                    <motion.span
                      layoutId="aurora-nav-pill"
                      className={cn(
                        'absolute inset-0 rounded-full',
                        isDark ? 'bg-rose-900' : 'border border-rose-900/70 bg-transparent',
                      )}
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <Icon className="relative h-4 w-4 sm:h-5 sm:w-5" />
                  <span className={cn('relative text-sm font-medium', !drawer && (vertical ? 'sr-only' : 'ml-2 hidden sm:inline'))}>
                    {item.name}
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <div className={cn('flex items-center gap-1', vertical && 'flex-col', drawer && 'w-full justify-center border-t border-white/10 pt-3')}>
          {actions.filter((action) => {
            if (action.mobileBarOnly && (drawer || vertical)) return false
            if (action.mobileBarOnly && !drawer && !vertical && !isMobile) return false
            if (action.hideOnMobileBar && !drawer && !vertical && isMobile) return false
            return true
          }).map((action, index) => (
            <motion.div
              key={`${action.key}-${navPosition}-${drawer ? 'drawer' : 'bar'}-${isDrawerOpen}`}
              className="grid place-items-center"
              initial={itemInitial}
              animate={itemAnimate}
              transition={{ delay: baseDelay + 0.4 + index * 0.07, type: 'spring', stiffness: 420, damping: 26 }}
            >
              {action.node}
            </motion.div>
          ))}
        </div>
      </>
    )
  }

  return (
    <ExperienceProvider mode="aurora">
      <div className={cn(
        'aurora-shell relative min-h-screen overflow-x-hidden transition-colors',
        isDark ? 'aurora-dark bg-[#040001] text-white' : 'aurora-light bg-[#fbf7f8] text-[#140407]',
      )}>
        <AuroraScene theme={isDark ? 'dark' : 'light'} interactiveShip />
        <AuroraPointerEffects />

        {isMobileDrawer ? (
          <>
            <motion.button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className={cn(
                'fixed top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border shadow-2xl backdrop-blur-xl',
                navPosition === 'left' ? 'left-4' : 'right-4',
                isDark ? 'border-rose-900/45 bg-black/70 text-white shadow-rose-950/45' : 'border-rose-900/25 bg-white/95 text-rose-900 shadow-rose-950/15',
              )}
              initial={{ opacity: 0, x: navPosition === 'left' ? -18 : 18, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 520, damping: 28 }}
              aria-label={`Abrir navegação ${navPositionLabel}`}
            >
              <ArrowsRightLeftIcon className="h-5 w-5" />
            </motion.button>

            <AnimatePresence>
              {isDrawerOpen && (
                <>
                  <motion.button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    onClick={() => setIsDrawerOpen(false)}
                    aria-label={siteContent.common.closeNavigation}
                  />
                  <motion.aside
                    className={cn(
                      'fixed bottom-4 top-4 z-50 flex w-[min(18rem,calc(100vw-2rem))] flex-col justify-between rounded-[1.5rem] border px-4 py-4 shadow-2xl backdrop-blur-xl',
                      navPosition === 'left' ? 'left-4' : 'right-4',
                      isDark ? 'border-rose-900/45 bg-black/82 shadow-rose-950/45' : 'border-rose-900/25 bg-white/95 shadow-rose-950/15',
                    )}
                    initial={{
                      x: navPosition === 'left' ? -340 : 340,
                      opacity: 0,
                      scale: 0.92,
                      rotateY: navPosition === 'left' ? -12 : 12,
                      filter: 'blur(16px)',
                    }}
                    animate={{ x: 0, opacity: 1, scale: 1, rotateY: 0, filter: 'blur(0px)' }}
                    exit={{
                      x: navPosition === 'left' ? -320 : 320,
                      opacity: 0,
                      scale: 0.94,
                      rotateY: navPosition === 'left' ? -10 : 10,
                      filter: 'blur(14px)',
                    }}
                    transition={{ type: 'spring', stiffness: 360, damping: 30, mass: 0.9 }}
                  >
                    {renderNavContent(true)}
                  </motion.aside>
                </>
              )}
            </AnimatePresence>
          </>
        ) : (
          <header
            className={cn(
              'fixed z-50',
              !isVerticalNav && 'px-2 sm:px-4',
              navPosition === 'top' && 'left-0 right-0 top-4',
              navPosition === 'bottom' && 'bottom-4 left-0 right-0',
              navPosition === 'left' && 'bottom-4 left-4 top-4',
              navPosition === 'right' && 'bottom-4 right-4 top-4',
            )}
          >
            <motion.nav
              key={navPosition}
              layout
              initial={navInitial}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              className={cn(
                'relative mx-auto flex border shadow-2xl backdrop-blur-xl',
                isVerticalNav
                  ? 'h-full max-h-[calc(100vh-2rem)] w-16 flex-col items-center justify-between rounded-[2rem] px-2 py-3'
                  : 'h-12 w-fit max-w-[calc(100vw-1rem)] items-center justify-start gap-1 overflow-x-auto rounded-full px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:h-14 sm:w-full sm:max-w-5xl sm:justify-between sm:gap-0 sm:px-3',
                isDark
                  ? 'border-rose-900/45 bg-black/60 shadow-rose-950/45'
                  : 'border-rose-900/25 bg-white/95 shadow-rose-950/15',
              )}
            >
              {renderNavContent(false)}
            </motion.nav>
          </header>
        )}

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'relative z-10 transition-[margin,padding] duration-300',
              navPosition !== 'top' && !isMobile && '-mt-20',
              navPosition === 'left' && !isMobileDrawer && 'pl-20',
              navPosition === 'right' && !isMobileDrawer && 'pr-20',
              navPosition === 'bottom' && 'pb-20',
            )}
          >
            {children ?? (
                <Suspense fallback={<AuroraLoading label={siteContent.common.loadingPage} />}>
                <Outlet />
              </Suspense>
            )}
          </motion.main>
        </AnimatePresence>
      </div>
    </ExperienceProvider>
  )
}
