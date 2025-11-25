import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { cn } from '../../lib'

export interface SidebarNavigationItem {
  name: string
  href: string
  icon: React.ElementType
}

export interface SidebarSocialLink {
  name: string
  href: string
  icon: React.ReactNode
}

export interface SidebarProps {
  navigation: SidebarNavigationItem[]
  socialLinks?: SidebarSocialLink[]
  showThemeToggle?: boolean
  onThemeToggle?: () => void
  theme?: 'light' | 'dark'
  className?: string
}

export function Sidebar({
  navigation,
  socialLinks = [],
  showThemeToggle = true,
  onThemeToggle,
  theme = 'light',
  className,
}: SidebarProps) {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className={cn("fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black", className)}>
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-center h-16 gap-1 sm:gap-2 overflow-x-auto">
          {/* Navigation Links */}
          {navigation.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 min-w-0 h-full transition-colors px-1",
                  active
                    ? 'text-black dark:text-white'
                    : 'text-gray-500 dark:text-gray-500'
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 sm:h-6 sm:w-6 mb-0.5 sm:mb-1 transition-transform flex-shrink-0",
                  active && 'scale-110'
                )} />
                <span className={cn(
                  "text-[10px] sm:text-xs font-medium truncate w-full text-center",
                  active && 'font-semibold'
                )}>
                  {item.name}
                </span>
              </Link>
            )
          })}

          {/* Divider */}
          {socialLinks.length > 0 && (
            <div className="h-6 sm:h-8 w-px bg-black dark:bg-white mx-1 sm:mx-2 flex-shrink-0" />
          )}

          {/* Social Links */}
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center flex-1 min-w-0 h-full text-gray-500 dark:text-gray-500 transition-colors hover:text-black dark:hover:text-white px-1"
            >
              <div className="h-5 w-5 sm:h-6 sm:w-6 mb-0.5 sm:mb-1 flex-shrink-0 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-[10px] sm:text-xs font-medium truncate w-full text-center">
                {item.name}
              </span>
            </a>
          ))}

          {/* Theme Toggle */}
          {showThemeToggle && (
            <button
              onClick={onThemeToggle}
              className="flex flex-col items-center justify-center flex-1 min-w-0 h-full text-gray-500 dark:text-gray-500 transition-colors hover:text-black dark:hover:text-white px-1"
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5 sm:h-6 sm:w-6 mb-0.5 sm:mb-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 sm:h-6 sm:w-6 mb-0.5 sm:mb-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
              <span className="text-[10px] sm:text-xs font-medium truncate w-full text-center">Tema</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

