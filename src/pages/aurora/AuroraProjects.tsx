import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowTopRightOnSquareIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Project, ProjectGroup, useProjectGroups } from '@/api/projects/useProjectGroups'
import { AuroraLoading } from '@/components/aurora/AuroraLoading'
import { useAuroraLoadingTransition } from '@/hooks/aurora/useAuroraLoadingTransition'
import { AuroraPageReveal } from '@/components/aurora/AuroraPageReveal'

gsap.registerPlugin(ScrollTrigger)

function ProjectRow({ project }: { project: Project }) {
  const content = (
    <article className="project-reveal py-10 transition duration-300 first:pt-4 last:pb-4">
      <div className="mb-4 flex items-start gap-4">
        <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl border border-white/12 bg-white/8">
          <img src={project.logo} alt={project.title} className="h-full w-full object-contain p-2" />
        </div>
        <div className="min-w-0">
          <h3 className="text-2xl font-bold text-white">{project.title}</h3>
          {project.url && <ArrowTopRightOnSquareIcon className="mt-2 h-5 w-5 text-rose-500" />}
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
    </article>
  )

  return project.url ? (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  )
}

function ProjectGroupSection({ group }: { group: ProjectGroup }) {
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
          <span className="mt-1 block text-sm text-white/56">{group.projects.length} projetos</span>
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 shrink-0 text-rose-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="mt-5 divide-y divide-white/10">
          {group.projects.map((project) => (
            <ProjectRow key={project.title} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}

export default function AuroraProjects() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { data: projectGroups, isLoading, error } = useProjectGroups()
  const loadingTransition = useAuroraLoadingTransition(isLoading)

  useEffect(() => {
    if (isLoading) return

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

    return () => ctx.revert()
  }, [isLoading, projectGroups?.length])

  if (loadingTransition.visible) {
    return <AuroraLoading label="Carregando projetos" exiting={loadingTransition.exiting} />
  }

  if (error || !projectGroups) {
    return <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 text-white md:pt-32">Nao foi possivel carregar os projetos.</div>
  }

  return (
    <AuroraPageReveal>
    <div ref={rootRef} className="mx-auto max-w-6xl px-4 pb-24 pt-10 text-white md:pt-32">
      <header className="mb-14 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.32em] text-rose-500">Portfólio técnico</p>
        <h1 className="mt-4 text-5xl font-bold md:text-7xl">Meus Projetos</h1>
        <p className="mt-6 text-lg leading-8 text-white/70">
          Uma seleção dos produtos, empresas e projetos em que trabalhei e contribuí ao longo dos anos.
        </p>
      </header>

      <div className="space-y-10">
        {projectGroups.map((group) => (
          <ProjectGroupSection key={group.id} group={group} />
        ))}
      </div>
    </div>
    </AuroraPageReveal>
  )
}
