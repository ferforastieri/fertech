import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/config/supabase/client'
import { localizeRow, TranslationMap } from '@/api/i18n/translations'
import { Locale, useLanguage } from '@/contexts/language/LanguageContext'

export type ArchitectureNode = {
  name: string
  description: string
  technologies: string[]
}

export type ProjectArchitecture = {
  name: string
  summary: string
  accent: string
  layers: {
    clients: ArchitectureNode[]
    services: ArchitectureNode[]
    platform: ArchitectureNode[]
  }
  folders: string[]
}

export type ProjectDetailModule = {
  title: string
  description: string
  technologies: string[]
}

export type ProjectDetailFlow = {
  title: string
  steps: string[]
}

export type ProjectDetails = {
  headline: string
  overview: string
  role: string
  period: string
  stack: string[]
  highlights: string[]
  responsibilities: string[]
  modules: ProjectDetailModule[]
  flows: ProjectDetailFlow[]
  metrics: string[]
  learnings: string[]
}

export type Project = {
  id: string
  groupId: string
  title: string
  description: string
  logo: string
  tags: string[]
  projectUrl?: string
  siteUrl?: string
  architecture?: ProjectArchitecture
  details?: ProjectDetails
  sortOrder: number
}

export type ProjectGroup = {
  id: string
  title: string
  sortOrder: number
  projects: Project[]
}

type ProjectGroupRow = {
  id: string
  title: string
  sort_order: number
  translations: TranslationMap<ProjectGroup> | null
}

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

async function getProjectGroups(locale: Locale): Promise<ProjectGroup[]> {
  const [groupsResult, projectsResult] = await Promise.all([
    supabase.from('project_groups').select('id,title,sort_order,translations').order('sort_order', { ascending: true }),
    supabase
      .from('projects')
      .select('id,group_id,title,description,logo,tags,url,project_url,site_url,architecture,details,sort_order,translations')
      .order('sort_order', { ascending: true }),
  ])

  if (groupsResult.error) throw groupsResult.error
  if (projectsResult.error) throw projectsResult.error

  const projectsByGroup = new Map<string, Project[]>()
  ;((projectsResult.data ?? []) as ProjectRow[]).forEach((project) => {
    const groupProjects = projectsByGroup.get(project.group_id) ?? []
    groupProjects.push(mapProject(project, locale))
    projectsByGroup.set(project.group_id, groupProjects)
  })

  return ((groupsResult.data ?? []) as ProjectGroupRow[]).map((group) => ({
    ...localizeRow(
      {
        id: group.id,
        title: group.title,
        sortOrder: group.sort_order,
        projects: projectsByGroup.get(group.id) ?? [],
      },
      group.translations,
      locale,
      `project_groups/${group.id}`,
    ),
  }))
}

export function useProjectGroups() {
  const { locale } = useLanguage()

  return useQuery({
    queryKey: ['projects', 'groups', locale],
    queryFn: () => getProjectGroups(locale),
  })
}
