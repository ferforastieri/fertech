import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, ArrowTopRightOnSquareIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Project, ProjectGroup, useProjectGroups } from '@/api/projects/useProjectGroups'
import { AuroraLoading } from '@/components/aurora/AuroraLoading'
import { useAuroraLoadingTransition } from '@/hooks/aurora/useAuroraLoadingTransition'
import { AuroraPageReveal } from '@/components/aurora/AuroraPageReveal'
import { projectDetailPath } from '@/api/projects/projectRoutes'
import { SiteContent, useSiteContent } from '@/api/site/useSiteContent'

gsap.registerPlugin(ScrollTrigger)

function ProjectRow({ project, copy }: { project: Project; copy: SiteContent }) {
  const detailUrl = projectDetailPath(project, true)

  return (
    <article className="project-reveal py-10 transition duration-300 first:pt-4 last:pb-4">
      <div className="mb-4 flex items-start gap-4">
        <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl border border-white/12 bg-white/8">
          <img src={project.logo} alt={project.title} className="h-full w-full object-contain p-2" />
        </div>
        <div className="min-w-0">
          <h3 className="text-2xl font-bold text-white">{project.title}</h3>
        </div>
      </div>
      <p className="max-w-4xl leading-7 text-white/68">{project.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to={detailUrl} className="inline-flex items-center gap-2 rounded-full bg-rose-900 px-5 py-2.5 text-sm font-semibold text-white">
          {copy.common.viewProject} <ArrowRightIcon className="h-4 w-4" />
        </Link>
        {project.siteUrl && (
          <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/16 px-5 py-2.5 text-sm font-semibold text-white">
            {copy.common.viewSite} <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  )
}

function ProjectGroupSection({ group, copy }: { group: ProjectGroup; copy: SiteContent }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <section className="rounded-[1.5rem] border border-white/12 bg-white/[0.07] p-6 backdrop-blur">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <span>
          <span className="block text-3xl font-bold text-white">{group.title}</span>
          <span className="mt-1 block text-sm text-white/56">{group.projects.length} {copy.common.projectsCountLabel}</span>
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 shrink-0 text-rose-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="mt-5 divide-y divide-white/10">
          {group.projects.map((project) => (
            <ProjectRow key={project.title} project={project} copy={copy} />
          ))}
        </div>
      )}
    </section>
  )
}

export default function AuroraProjects() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { data: projectGroups, isLoading, error } = useProjectGroups()
  const siteContentQuery = useSiteContent()
  const copy = siteContentQuery.data
  const loadingTransition = useAuroraLoadingTransition(isLoading || siteContentQuery.isLoading)

  useEffect(() => {
    if (loadingTransition.visible || !rootRef.current) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.project-reveal', { opacity: 1, y: 0 })
      })
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        ScrollTrigger.batch('.project-reveal', {
          start: 'top 88%',
          onEnter: (elements) => gsap.to(elements, { opacity: 1, y: 0, rotateX: 0, duration: 0.75, stagger: 0.07, ease: 'power3.out' }),
          once: true,
        })
      })
      return () => mm.revert()
    }, rootRef)
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.cancelAnimationFrame(refreshFrame)
      ctx.revert()
    }
  }, [loadingTransition.visible, projectGroups?.length])

  if (loadingTransition.visible) {
    return <AuroraLoading label={copy?.projects.loading ?? ''} exiting={loadingTransition.exiting} />
  }

  if (error || !projectGroups || !copy) {
    return <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 text-white md:pt-32">{copy?.projects.error}</div>
  }

  return (
    <AuroraPageReveal>
    <div ref={rootRef} className="mx-auto max-w-6xl px-4 pb-24 pt-10 text-white md:pt-32">
      <header className="mb-14 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.32em] text-rose-500">{copy.projects.auroraEyebrow}</p>
        <h1 className="mt-4 text-5xl font-bold md:text-7xl">{copy.projects.title}</h1>
        <p className="mt-6 text-lg leading-8 text-white/70">
          {copy.projects.description}
        </p>
      </header>

      <div className="space-y-10">
        {projectGroups.map((group) => (
          <ProjectGroupSection key={group.id} group={group} copy={copy} />
        ))}
      </div>
    </div>
    </AuroraPageReveal>
  )
}
