import { Badge, Skeleton } from '@/components/ui/feedback'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Project, useProjectGroups } from '@/api/projects/useProjectGroups'

function ProjectItem({ project }: { project: Project }) {
  const content = (
    <div className="py-10 first:pt-6 last:pb-6 transition-colors">
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
  const { data: projectGroups, isLoading, error } = useProjectGroups()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
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

  if (error || !projectGroups) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl text-foreground">Nao foi possivel carregar os projetos.</div>
      </div>
    )
  }

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
              <div className="divide-y divide-border/60 px-1">
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
