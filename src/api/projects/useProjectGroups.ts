import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/config/supabase/client'

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
  sort_order: number
}

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    groupId: row.group_id,
    title: row.title,
    description: row.description,
    logo: row.logo,
    tags: row.tags ?? [],
    projectUrl: row.project_url ?? undefined,
    siteUrl: row.site_url ?? row.url ?? undefined,
    architecture: row.architecture ?? undefined,
    sortOrder: row.sort_order,
  }
}

async function getProjectGroups(): Promise<ProjectGroup[]> {
  const [groupsResult, projectsResult] = await Promise.all([
    supabase.from('project_groups').select('id,title,sort_order').order('sort_order', { ascending: true }),
    supabase
      .from('projects')
      .select('id,group_id,title,description,logo,tags,url,project_url,site_url,architecture,sort_order')
      .order('sort_order', { ascending: true }),
  ])

  if (groupsResult.error) throw groupsResult.error
  if (projectsResult.error) throw projectsResult.error

  const projectsByGroup = new Map<string, Project[]>()
  ;((projectsResult.data ?? []) as ProjectRow[]).forEach((project) => {
    const groupProjects = projectsByGroup.get(project.group_id) ?? []
    groupProjects.push(mapProject(project))
    projectsByGroup.set(project.group_id, groupProjects)
  })

  return ((groupsResult.data ?? []) as ProjectGroupRow[]).map((group) => ({
    id: group.id,
    title: group.title,
    sortOrder: group.sort_order,
    projects: projectsByGroup.get(group.id) ?? [],
  }))
}

export function useProjectGroups() {
  return useQuery({
    queryKey: ['projects', 'groups'],
    queryFn: getProjectGroups,
  })
}
