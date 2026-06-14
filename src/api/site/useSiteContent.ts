import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/config/supabase/client'
import { localizeRow, TranslationMap } from '@/api/i18n/translations'
import { useLanguage } from '@/contexts/language/LanguageContext'

export type NavigationContent = {
  home: string
  blog: string
  projects: string
  resume: string
  playground: string
  switchToAurora: string
  switchToClassic: string
  socialLinks: string
  playgroundDialogTitle: string
  playgroundDialogDescription: string
  cancel: string
  goToAurora: string
}

export type PlaygroundTreeNode = {
  name: string
  description: string
  technologies?: string[]
  children?: PlaygroundTreeNode[]
}

export type PlaygroundPattern = {
  id: string
  name: string
  category: string
  description: string
  flow: string[]
  technologies: string[]
}

export type SiteContent = {
  navigation: NavigationContent
  gateway: {
    kicker: string
    titleLine1: string
    titleLine2: string
    descriptionTemplate: string
    redirectSeconds: number
    modes: Array<{
      id: 'classic' | 'aurora'
      name: string
      audience: string
      description: string
      href: string
    }>
  }
  common: {
    readTimeSuffix: string
    articlesCountLabel: string
    projectsCountLabel: string
    viewProject: string
    viewSite: string
    loadingPage: string
    homeLoading: string
    contentLoadError: string
    closeNavigation: string
  }
  blog: {
    title: string
    description: string
    auroraEyebrow: string
    workTitle: string
    personalTitle: string
    loading: string
    error: string
    notFoundTitle: string
    backToBlog: string
    backToArticles: string
  }
  projects: {
    title: string
    description: string
    auroraEyebrow: string
    loading: string
    error: string
    notFound: string
    backToProjects: string
  }
  resume: {
    loading: string
    error: string
    logoAlt: string
    pdfSuccess: string
    pdfError: string
  }
  playground: {
    eyebrow: string
    title: string
    description: string
    colors: string[]
    modes: Array<{ id: 'orbit' | 'wave' | 'chaos'; label: string }>
    controlsTitle: string
    pause: string
    resume: string
    randomize: string
    clear: string
    brush: string
    elements: string
    speed: string
    drawingEnabled: string
    enableDrawing: string
    experiments: Array<{ eyebrow: string; title: string; description: string }>
    architecture: {
      treeTitle: string
      rootLabel: string
      patternsTitle: string
      footer: string
      tree: PlaygroundTreeNode[]
      patterns: PlaygroundPattern[]
    }
  }
  architecture: {
    eyebrow: string
    title: string
    description: string
    flowLabel: string
    layerTitles: [string, string, string]
    foldersTitle: string
  }
}

type SiteContentRow = {
  content: SiteContent
  translations: TranslationMap<SiteContent> | null
}

async function getSiteContent(locale: ReturnType<typeof useLanguage>['locale']): Promise<SiteContent> {
  const { data, error } = await supabase.from('site_content').select('content,translations').eq('id', 'main').single()
  if (error) throw error

  const row = data as SiteContentRow
  return localizeRow(row.content, row.translations, locale, 'site_content/main')
}

export function useSiteContent() {
  const { locale } = useLanguage()

  return useQuery({
    queryKey: ['site-content', 'main', locale],
    queryFn: () => getSiteContent(locale),
  })
}
