import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { useProjectGroups } from '@/api/projects/useProjectGroups'
import { ArchitectureExplorer } from '@/components/playground/ArchitectureExplorer'
import { projectSlug } from '@/api/projects/projectRoutes'
import { AuroraLoading } from '@/components/aurora/AuroraLoading'
import { AuroraPageReveal } from '@/components/aurora/AuroraPageReveal'
import { useSiteContent } from '@/api/site/useSiteContent'
import { ProjectDetailsShowcase } from '@/components/projects/ProjectDetailsShowcase'

export default function AuroraProjectDetail() {
  const { projectId } = useParams()
  const { data: groups, isLoading } = useProjectGroups()
  const siteContentQuery = useSiteContent()
  const copy = siteContentQuery.data
  const project = groups?.flatMap((group) => group.projects).find((item) => projectSlug(item) === projectId)
  const group = groups?.find((item) => item.projects.some((candidate) => candidate.id === project?.id))

  if (isLoading || siteContentQuery.isLoading) return <AuroraLoading label={copy?.projects.loading ?? ''} />
  if (!project || !copy) return <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 text-white md:pt-32">{copy?.projects.notFound}</div>

  return (
    <AuroraPageReveal>
      <div className="bg-[#050106] text-white">
        <article className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:pt-32">
          <Link to="/aurora/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white">
            <ArrowLeftIcon className="h-4 w-4" />
            {copy.projects.backToProjects}
          </Link>
          <header className="mt-10 border-b border-white/12 pb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-400">{group?.title}</p>
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
              {project.logo && <img src={project.logo} alt="" className="h-24 w-24 rounded-2xl bg-white/8 object-contain p-3" />}
              <div>
                <h1 className="text-5xl font-bold md:text-7xl">{project.title}</h1>
                <p className="mt-6 max-w-4xl text-lg leading-8 text-white/68">{project.description}</p>
              </div>
            </div>
          </header>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.tags.map((tag) => <span key={tag} className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-sm text-white/70">{tag}</span>)}
          </div>
          {project.siteUrl && (
            <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-2 rounded-full bg-rose-900 px-6 py-3 font-semibold text-white transition hover:bg-rose-800">
              {copy.common.viewSite}
              <ArrowTopRightOnSquareIcon className="h-5 w-5" />
            </a>
          )}
        </article>
        <ProjectDetailsShowcase project={project} variant="aurora" />
        {project.architecture && <ArchitectureExplorer architecture={project.architecture} copy={copy.architecture} />}
      </div>
    </AuroraPageReveal>
  )
}
