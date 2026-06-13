import { Accordion } from '@/components/ui/layout'
import { Badge } from '@/components/ui/feedback'
import {
  ArrowTopRightOnSquareIcon,
  RocketLaunchIcon,
  BuildingStorefrontIcon,
  PaintBrushIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline'
import {
  currentProjects,
  imperioCervejaProjects,
  otherProjects,
  Project,
  sherwinWilliamsProjects,
} from '@/data/projects'

function ProjectItem({ project }: { project: Project }) {
  const content = (
    <div className="py-7 first:pt-3 last:pb-3 transition-colors">
      <div className="flex items-start gap-4 mb-4">
        {project.logo && (
          <div className="w-16 h-16 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              src={project.logo}
              alt={project.title}
              className="object-contain p-2 w-full h-full"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-2xl font-semibold transition-colors text-foreground ${project.url ? 'group-hover:underline' : ''}`}>
              {project.title}
            </h3>
            {project.url && (
              <ArrowTopRightOnSquareIcon className="h-5 w-5 text-foreground group-hover:scale-110 transition-transform flex-shrink-0 mt-1" />
            )}
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
        </div>
      </div>
    </div>
  )

  if (project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        {content}
      </a>
    )
  }

  return <div className="block">{content}</div>
}

function ProjectSection({ projects }: { projects: Project[] }) {
  return (
    <div className="divide-y divide-border/70 px-1">
      {projects.map((project) => (
        <ProjectItem key={project.title} project={project} />
      ))}
    </div>
  )
}

export default function Projects() {
  const accordionItems = [
    {
      value: 'current',
      trigger: (
        <div className="flex items-center gap-3">
          <RocketLaunchIcon className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            Projetos Atuais ({currentProjects.length})
          </span>
        </div>
      ),
      content: <ProjectSection projects={currentProjects} />,
      defaultOpen: true,
    },
    {
      value: 'imperio',
      trigger: (
        <div className="flex items-center gap-3">
          <BuildingStorefrontIcon className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            Império Cerveja (Gold) ({imperioCervejaProjects.length})
          </span>
        </div>
      ),
      content: <ProjectSection projects={imperioCervejaProjects} />,
      defaultOpen: true,
    },
    {
      value: 'sherwin',
      trigger: (
        <div className="flex items-center gap-3">
          <PaintBrushIcon className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            Sherwin Williams (SW e Experiências) ({sherwinWilliamsProjects.length})
          </span>
        </div>
      ),
      content: <ProjectSection projects={sherwinWilliamsProjects} />,
      defaultOpen: true,
    },
    {
      value: 'others',
      trigger: (
        <div className="flex items-center gap-3">
          <BriefcaseIcon className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            Outros Projetos ({otherProjects.length})
          </span>
        </div>
      ),
      content: <ProjectSection projects={otherProjects} />,
      defaultOpen: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-foreground">Meus Projetos</h1>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            Uma seleção dos projetos em que trabalhei e contribuí ao longo dos anos
          </p>
        </div>

        <Accordion
          type="multiple"
          items={accordionItems}
          className="space-y-4"
        />
      </div>
    </div>
  )
}
