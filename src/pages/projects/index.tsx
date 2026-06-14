import { Badge, Skeleton } from '@/components/ui/feedback'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRightIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Project, useProjectGroups } from '@/api/projects/useProjectGroups'
import { isExternalUrl, projectDetailPath } from '@/api/projects/projectRoutes'
import { SiteContent, useSiteContent } from '@/api/site/useSiteContent'

function hasListItems(items: unknown[] | undefined) {
  return Boolean(items?.length)
}

function hasProjectDetail(project: Project) {
  const details = project.details

  return Boolean(
    project.architecture ||
      details?.headline?.trim() ||
      details?.overview?.trim() ||
      details?.role?.trim() ||
      details?.period?.trim() ||
      details?.repositoryPath?.trim() ||
      hasListItems(details?.stack) ||
      hasListItems(details?.highlights) ||
      hasListItems(details?.responsibilities) ||
      hasListItems(details?.modules) ||
      hasListItems(details?.flows) ||
      hasListItems(details?.metrics) ||
      hasListItems(details?.learnings),
  )
}

function ProjectItem({ project, classic, copy }: { project: Project; classic: boolean; copy: SiteContent }) {
  const configuredProjectUrl = project.projectUrl?.trim()
  const detailUrl = configuredProjectUrl || (hasProjectDetail(project) ? `${classic ? '/classic' : ''}${projectDetailPath(project)}` : '')
  const siteUrl = project.siteUrl?.trim()
  const hasActions = Boolean(detailUrl || siteUrl)

  return (
    <article className="py-10 first:pt-6 last:pb-6 transition-colors">
      <div className="mb-4 flex items-start gap-4">
        {project.logo && (
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
            <img
              src={project.logo}
              alt={project.title}
              className="h-full w-full object-contain p-2"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-2xl font-semibold text-foreground">{project.title}</h3>
          </div>
          <p className="mt-3 text-base leading-relaxed text-foreground">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          {hasActions && (
            <div className="mt-6 flex flex-wrap gap-3">
              {detailUrl && (
                isExternalUrl(detailUrl) ? (
                  <a href={detailUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                    {copy.common.viewProject} <ArrowRightIcon className="h-4 w-4" />
                  </a>
                ) : (
                  <Link to={detailUrl} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                    {copy.common.viewProject} <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                )
              )}
              {siteUrl && (
                <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground">
                  {copy.common.viewSite} <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const location = useLocation()
  const classic = location.pathname.startsWith('/classic')
  const { data: projectGroups, isLoading, error } = useProjectGroups()
  const siteContentQuery = useSiteContent()
  const copy = siteContentQuery.data

  if (isLoading || siteContentQuery.isLoading) {
    return (
      <div className="container mx-auto px-4 pt-4 pb-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 space-y-4 text-center">
            <Skeleton className="mx-auto h-14 w-72" />
            <Skeleton className="mx-auto h-6 w-full max-w-2xl" />
          </div>
          <div className="space-y-12">
            {Array.from({ length: 3 }).map((_, groupIndex) => (
              <section key={groupIndex}>
                <div className="mb-4 flex items-end justify-between border-b border-border pb-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="space-y-7">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex gap-4 py-2">
                      <Skeleton className="h-16 w-16 rounded-lg" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-7 w-56" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-10/12" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-20 rounded-full" />
                          <Skeleton className="h-6 w-24 rounded-full" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !projectGroups || !copy) {
    return (
      <div className="container mx-auto px-4 pt-4 pb-12">
        <div className="mx-auto max-w-6xl text-foreground">{copy?.projects.error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-4 pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold text-foreground">{copy.projects.title}</h1>
          <p className="mx-auto max-w-2xl text-xl text-foreground">
            {copy.projects.description}
          </p>
        </div>

        <div className="space-y-12">
          {projectGroups.map((group) => (
            <section key={group.id}>
              <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                <h2 className="text-2xl font-bold text-foreground">{group.title}</h2>
                <span className="text-sm text-muted-foreground">{group.projects.length} {copy.common.projectsCountLabel}</span>
              </div>
              <div className="divide-y divide-border/60 px-1">
                {group.projects.map((project) => (
                  <ProjectItem key={project.title} project={project} classic={classic} copy={copy} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
