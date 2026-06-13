import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Project, useProjectGroups } from '@/api/projects/useProjectGroups'
import { AuroraLoading } from '@/components/aurora/AuroraLoading'

gsap.registerPlugin(ScrollTrigger)

function ProjectRow({ project }: { project: Project }) {
  const content = (
    <article className="project-reveal py-6 opacity-0 translate-y-8 transition duration-300 first:pt-0 last:pb-0">
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

export default function AuroraProjects() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { data: projectGroups, isLoading, error } = useProjectGroups()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
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
  }, [])

  if (isLoading) {
    return <AuroraLoading label="Carregando projetos" />
  }

  if (error || !projectGroups) {
    return <div className="mx-auto max-w-6xl px-4 pb-24 pt-32 text-white">Nao foi possivel carregar os projetos.</div>
  }

  return (
    <div ref={rootRef} className="mx-auto max-w-6xl px-4 pb-24 pt-32 text-white">
      <header className="mb-14 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.32em] text-rose-500">Projetos</p>
        <h1 className="mt-4 text-5xl font-bold md:text-7xl">Meus Projetos</h1>
        <p className="mt-6 text-lg leading-8 text-white/70">
          Uma seleção dos produtos, empresas e projetos em que trabalhei e contribuí ao longo dos anos.
        </p>
      </header>

      <div className="space-y-10">
        {projectGroups.map((group) => (
          <section key={group.id} className="rounded-[1.5rem] border border-white/12 bg-white/[0.07] p-6 backdrop-blur">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
              <h2 className="text-3xl font-bold text-white">{group.title}</h2>
              <span className="text-sm text-white/56">{group.projects.length} projetos</span>
            </div>
            <div className="divide-y divide-white/10">
              {group.projects.map((project) => (
                <ProjectRow key={project.title} project={project} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
