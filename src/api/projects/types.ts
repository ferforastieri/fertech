export type Project = {
  id: string
  groupId: string
  title: string
  description: string
  logo: string
  tags: string[]
  url?: string
  sortOrder: number
}

export type ProjectGroup = {
  id: string
  title: string
  sortOrder: number
  projects: Project[]
}

export type ProjectGroupRow = {
  id: string
  title: string
  sort_order: number
}

export type ProjectRow = {
  id: string
  group_id: string
  title: string
  description: string
  logo: string
  tags: string[]
  url: string | null
  sort_order: number
}
