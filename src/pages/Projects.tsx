import { Badge } from '@/components/ui/feedback'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { projectGroups, Project } from '@/data/projects'

function ProjectItem({ project }: { project: Project }) {
  const content = (
    <div className="py-7 first:pt-3 last:pb-3 transition-colors">
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
            <h3 className={`text-2xl font-semibold text-foreground transition-colors ${project.url ? 'group-hover:underline' : ''}`}>
              {project.title}
            </h3>
            {project.url && (
              <ArrowTopRightOnSquareIcon className="mt-1 h-5 w-5 flex-shrink-0 text-foreground transition-transform group-hover:scale-110" />
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

  return <div>{content}</div>
}

export default function Projects() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold text-foreground">Meus Projetos</h1>
          <p className="mx-auto max-w-2xl text-xl text-foreground">
            Uma seleção dos produtos, empresas e projetos em que trabalhei e contribuí ao longo dos anos
          </p>
        </div>

        <div className="space-y-12">
          {projectGroups.map((group) => (
            <section key={group.id}>
              <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                <h2 className="text-2xl font-bold text-foreground">{group.title}</h2>
                <span className="text-sm text-muted-foreground">{group.projects.length} projetos</span>
              </div>
              <div className="divide-y divide-border/70 px-1">
                {group.projects.map((project) => (
                  <ProjectItem key={project.title} project={project} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
