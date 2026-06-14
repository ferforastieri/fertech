import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/config/supabase/client'
import { localizeRow, TranslationMap } from '@/api/i18n/translations'
import { Locale, useLanguage } from '@/contexts/language/LanguageContext'

export type ProfileHighlight = {
  icon: 'code' | 'rocket' | 'sparkles'
  title: string
  description: string
}

export type SocialLink = {
  name: string
  href: string
  icon: 'x' | 'github' | 'linkedin' | 'link'
}

export type ProfileContent = {
  name: string
  role: string
  intro: string
  contactUrl: string
  logoUrl: string
  socialLinks: SocialLink[]
  technologies: string[]
  aboutParagraphs: string[]
  highlights: ProfileHighlight[]
  translations?: TranslationMap<ProfileContent>
}

type ProfileRow = {
  id: string
  name: string
  role: string
  intro: string
  contact_url: string
  logo_url: string
  social_links: SocialLink[]
  technologies: string[]
  about_paragraphs: string[]
  highlights: ProfileHighlight[]
  translations: TranslationMap<ProfileContent> | null
}

function mapProfile(row: ProfileRow, locale: Locale): ProfileContent {
  const base = {
    name: row.name,
    role: row.role,
    intro: row.intro,
    contactUrl: row.contact_url,
    logoUrl: row.logo_url,
    socialLinks: row.social_links,
    technologies: row.technologies ?? [],
    aboutParagraphs: row.about_paragraphs ?? [],
    highlights: row.highlights ?? [],
  }

  return localizeRow(base, row.translations, locale, 'profile/main')
}

async function getProfileContent(locale: Locale): Promise<ProfileContent> {
  const { data, error } = await supabase
    .from('profile')
    .select('id,name,role,intro,contact_url,logo_url,social_links,technologies,about_paragraphs,highlights,translations')
    .eq('id', 'main')
    .single()

  if (error) throw error

  return mapProfile(data as ProfileRow, locale)
}

export function useProfileContent() {
  const { locale } = useLanguage()

  return useQuery({
    queryKey: ['profile', 'main', locale],
    queryFn: () => getProfileContent(locale),
  })
}
