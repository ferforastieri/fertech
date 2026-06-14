import { DEFAULT_LOCALE, Locale } from '@/contexts/language/LanguageContext'

export type TranslationMap<T> = Partial<Record<Exclude<Locale, 'pt-BR'>, Partial<T>>>

export function localizeRow<T extends object>(
  base: T,
  translations: TranslationMap<T> | null | undefined,
  locale: Locale,
  entityName: string,
): T {
  if (locale === DEFAULT_LOCALE) return base

  const translated = translations?.[locale]
  if (!translated) {
    throw new Error(`Tradução ${locale} ausente para ${entityName}.`)
  }

  return { ...base, ...translated }
}
