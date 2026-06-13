import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Badge, Skeleton } from '@/components/ui'
import { useProjectGroups } from '@/api/projects/useProjectGroups'
import { projectSlug } from '@/features/projects/projectRoutes'
import { ArchitectureExplorer } from '@/features/playground/ArchitectureExplorer'
import { useSiteContent } from '@/api/site/useSiteContent'

export default function ProjectDetail() {
  const { projectId } = useParams()
  const location = useLocation()
  const projectsPath = location.pathname.startsWith('/classic') ? '/classic/projects' : '/projects'
  const { data: groups, isLoading } = useProjectGroups()
  const siteContentQuery = useSiteContent()
  const copy = siteContentQuery.data
  const project = groups?.flatMap((group) => group.projects).find((item) => projectSlug(item) === projectId)
  const group = groups?.find((item) => item.projects.some((candidate) => candidate.id === project?.id))

  if (isLoading || siteContentQuery.isLoading) {
    return <div className="mx-auto max-w-5xl space-y-5 px-4 py-12"><Skeleton className="h-8 w-40" /><Skeleton className="h-72 w-full" /></div>
  }

  if (!project || !copy) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-foreground">{copy?.projects.notFound}</div>
  }

  return (
    <div>
    <article className="mx-auto max-w-5xl px-4 pb-20 pt-8">
      <Link to={projectsPath} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeftIcon className="h-4 w-4" />
        {copy.projects.backToProjects}
      </Link>
      <header className="mt-10 border-b border-border pb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">{group?.title}</p>
        <div className="mt-5 flex items-start gap-5">
          {project.logo && <img src={project.logo} alt="" className="h-20 w-20 rounded-xl border border-border object-contain p-2" />}
          <div>
            <h1 className="text-4xl font-bold text-foreground md:text-6xl">{project.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{project.description}</p>
          </div>
        </div>
      </header>
      <div className="mt-8 flex flex-wrap gap-2">
        {project.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
      </div>
      {project.siteUrl && (
        <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground">
          {copy.common.viewSite}
          <ArrowTopRightOnSquareIcon className="h-5 w-5" />
        </a>
      )}
    </article>
    {project.architecture && <ArchitectureExplorer architecture={project.architecture} copy={copy.architecture} />}
    </div>
  )
}
