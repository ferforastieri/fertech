import { useState, useEffect } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { 
  HomeIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  UserIcon,
  ArrowPathRoundedSquareIcon,
} from '@heroicons/react/24/outline'
import { ThemeToggle } from '@/components/ui/feedback'
import { cn } from '@/components/lib'
import {
  ExperienceProvider,
  saveExperienceMode,
} from '@/contexts/experience/ExperienceContext'
import { useProfileContent } from '@/api/profile/useProfileContent'
import { renderSocialIcon } from '@/components/profile/renderSocialIcon'
import { useSiteContent } from '@/api/site/useSiteContent'
import { LanguageSelect } from '@/components/language/LanguageSelect'

interface LayoutProps {
  children: React.ReactNode
  basePath?: string
}

export default function Layout({ children, basePath = '' }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(false)
  const { data: profile } = useProfileContent()
  const { data: siteContent } = useSiteContent()

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setIsDark(shouldBeDark)
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', shouldBeDark ? 'dark' : 'light')
  }, [])


  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    if (newDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  if (!siteContent) return null
  const copy = siteContent.navigation
  const navigationItems = [
    { name: copy.home, href: basePath || '/', icon: HomeIcon },
    { name: copy.blog, href: `${basePath}/blog`, icon: DocumentTextIcon },
    { name: copy.projects, href: `${basePath}/projects`, icon: BriefcaseIcon },
    { name: copy.resume, href: `${basePath}/resume`, icon: UserIcon },
  ]

  const switchToAurora = () => {
    saveExperienceMode('aurora')
    navigate('/aurora')
  }

  return (
    <ExperienceProvider mode="classic">
      <div className="min-h-screen bg-background flex flex-col overflow-x-hidden w-full">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-border bg-background">
        <div className="flex items-center justify-between h-16 px-4">
          <RouterLink to="/" className="flex items-center">
            {profile && (
              <img
                src={profile.logoUrl}
                alt="Logo"
                className="h-8 w-8 object-contain"
              />
            )}
          </RouterLink>
          
          <div className="flex items-center gap-2">
            {profile?.socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'p-2 rounded-xl transition-all duration-200',
                  'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
                aria-label={social.name}
              >
                {renderSocialIcon(social)}
              </a>
            ))}
            <ThemeToggle
              theme={isDark ? 'dark' : 'light'}
              onToggle={toggleTheme}
              variant="ghost"
              size="sm"
            />
            <LanguageSelect compact className="h-9 w-10" />
            <button
              type="button"
              onClick={switchToAurora}
              className={cn(
                'p-2 rounded-xl transition-all duration-200',
                'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
              aria-label={copy.switchToAurora}
              title={copy.switchToAurora}
            >
              <ArrowPathRoundedSquareIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className={cn(
        "flex-1 w-full overflow-x-hidden mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-10",
        "pt-20 md:pt-4 pb-20 md:pb-16"
      )}>
        {children}
      </main>


      {/* Desktop Bottom Navigation */}
      <nav className="hidden md:flex fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="flex items-center justify-between h-16">
            {/* Navigation Items */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-start">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <RouterLink
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                      isActive
                        ? 'text-foreground bg-accent shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-foreground" />
                    )}
                  </RouterLink>
                )
              })}
            </div>

            {/* Social Links & Theme Toggle */}
            <div className="flex items-center gap-3 sm:gap-4">
              {profile?.socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'p-2 rounded-xl transition-all duration-200',
                    'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                  aria-label={social.name}
                >
                  {renderSocialIcon(social)}
                </a>
              ))}
              <div className="h-6 w-px bg-border" />
              <LanguageSelect compact />
              <ThemeToggle
                theme={isDark ? 'dark' : 'light'}
                onToggle={toggleTheme}
                variant="ghost"
                size="sm"
              />
              <button
                type="button"
                onClick={switchToAurora}
                className={cn(
                  'p-2 rounded-xl transition-all duration-200',
                  'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
                aria-label={copy.switchToAurora}
                title={copy.switchToAurora}
              >
                <ArrowPathRoundedSquareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Simplified */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background md:hidden">
        <div className="flex h-16 items-center justify-around gap-1 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <RouterLink
                key={item.href}
                to={item.href}
                className={cn(
                  'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition-all duration-200',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="max-w-full truncate text-center text-[10px] font-medium leading-tight">{item.name}</span>
                {isActive && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-foreground" />
                )}
              </RouterLink>
            )
          })}
        </div>
      </nav>

      </div>
    </ExperienceProvider>
  )
}
