import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/config/supabase'
import { Project } from './useProjectGroups'

type ProjectRow = {
  id: string
  group_id: string
  title: string
  description: string
  logo: string
  tags: string[]
  url: string | null
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
    url: row.url ?? undefined,
    sortOrder: row.sort_order,
  }
}

async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('id,group_id,title,description,logo,tags,url,sort_order')
    .order('sort_order', { ascending: true })

  if (error) throw error

  return ((data ?? []) as ProjectRow[]).map(mapProject)
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects', 'list'],
    queryFn: getProjects,
  })
}
