import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/config/supabase/client'
import { Project, ProjectArchitecture, ProjectDetails } from './useProjectGroups'
import { localizeRow, TranslationMap } from '@/api/i18n/translations'
import { Locale, useLanguage } from '@/contexts/language/LanguageContext'

type ProjectRow = {
  id: string
  group_id: string
  title: string
  description: string
  logo: string
  tags: string[]
  url: string | null
  project_url: string | null
  site_url: string | null
  architecture: ProjectArchitecture | null
  details: ProjectDetails | null
  sort_order: number
  translations: TranslationMap<Project> | null
}

function mapProject(row: ProjectRow, locale: Locale): Project {
  const base = {
    id: row.id,
    groupId: row.group_id,
    title: row.title,
    description: row.description,
    logo: row.logo,
    tags: row.tags ?? [],
    projectUrl: row.project_url ?? undefined,
    siteUrl: row.site_url ?? row.url ?? undefined,
    architecture: row.architecture ?? undefined,
    details: row.details ?? undefined,
    sortOrder: row.sort_order,
  }

  return localizeRow(base, row.translations, locale, `projects/${row.id}`)
}

async function getProjects(locale: Locale): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('id,group_id,title,description,logo,tags,url,project_url,site_url,architecture,details,sort_order,translations')
    .order('sort_order', { ascending: true })

  if (error) throw error

  return ((data ?? []) as ProjectRow[]).map((project) => mapProject(project, locale))
}

export function useProjects() {
  const { locale } = useLanguage()

  return useQuery({
    queryKey: ['projects', 'list', locale],
    queryFn: () => getProjects(locale),
  })
}
