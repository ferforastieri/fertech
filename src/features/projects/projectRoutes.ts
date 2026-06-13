import { Project } from '@/api/projects/useProjectGroups'

export function projectSlug(project: Pick<Project, 'id' | 'title'>) {
  return (project.id || project.title)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function isExternalUrl(value?: string) {
  return Boolean(value && /^(https?:)?\/\//.test(value))
}

export function projectDetailPath(project: Project, aurora = false) {
  return `${aurora ? '/aurora' : ''}/projects/${projectSlug(project)}`
}
