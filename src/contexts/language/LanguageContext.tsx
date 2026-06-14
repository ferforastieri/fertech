import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Locale = 'pt-BR' | 'en' | 'es'

export const DEFAULT_LOCALE: Locale = 'pt-BR'
export const LANGUAGE_STORAGE_KEY = 'fertech-locale'

export const localeOptions: Array<{ value: Locale; label: string; shortLabel: string; flag: string; htmlLang: string }> = [
  { value: 'pt-BR', label: 'Português', shortLabel: 'PT', flag: '🇧🇷', htmlLang: 'pt-BR' },
  { value: 'en', label: 'English', shortLabel: 'EN', flag: '🇺🇸', htmlLang: 'en' },
  { value: 'es', label: 'Español', shortLabel: 'ES', flag: '🇪🇸', htmlLang: 'es' },
]

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => undefined,
})

function isLocale(value: string | null): value is Locale {
  return value === 'pt-BR' || value === 'en' || value === 'es'
}

function getInitialLocale() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

  const storedLocale = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (isLocale(storedLocale)) return storedLocale

  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language]
  const matchedLanguage = browserLanguages.find((language) => {
    const normalizedLanguage = language.toLowerCase()
    return normalizedLanguage.startsWith('pt') || normalizedLanguage.startsWith('en') || normalizedLanguage.startsWith('es')
  })

  if (matchedLanguage?.toLowerCase().startsWith('en')) return 'en'
  if (matchedLanguage?.toLowerCase().startsWith('es')) return 'es'

  return DEFAULT_LOCALE
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLocale)
  }

  useEffect(() => {
    const option = localeOptions.find((item) => item.value === locale)
    document.documentElement.lang = option?.htmlLang ?? DEFAULT_LOCALE
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale }), [locale])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
