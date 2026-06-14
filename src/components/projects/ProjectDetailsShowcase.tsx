import { ArrowRightIcon, BeakerIcon, BoltIcon, BriefcaseIcon, ChartBarIcon, CodeBracketSquareIcon, FolderOpenIcon, LightBulbIcon } from '@heroicons/react/24/outline'
import { motion } from 'motion/react'
import { ReactNode } from 'react'
import { Badge } from '@/components/ui'
import { Project, ProjectDetails } from '@/api/projects/useProjectGroups'

type Variant = 'classic' | 'aurora'

type ProjectDetailsShowcaseProps = {
  project: Project
  variant?: Variant
}

const sectionMap = {
  classic: {
    shell: 'mx-auto max-w-5xl px-4 pb-20',
    panel: 'border-border bg-card text-card-foreground',
    mutedPanel: 'border-border bg-muted/35',
    eyebrow: 'text-muted-foreground',
    title: 'text-foreground',
    text: 'text-muted-foreground',
    badge: 'outline' as const,
    accent: 'text-primary',
    line: 'border-border',
  },
  aurora: {
    shell: 'mx-auto max-w-6xl px-4 pb-24',
    panel: 'border-white/12 bg-white/[0.07] text-white backdrop-blur',
    mutedPanel: 'border-white/10 bg-black/20',
    eyebrow: 'text-rose-300',
    title: 'text-white',
    text: 'text-white/68',
    badge: 'secondary' as const,
    accent: 'text-rose-300',
    line: 'border-white/10',
  },
}

function hasDetails(details: ProjectDetails | undefined) {
  if (!details) return false

  return Boolean(
      details.headline ||
      details.overview ||
      details.role ||
      details.period ||
      details.stack.length ||
      details.highlights.length ||
      details.responsibilities.length ||
      details.modules.length ||
      details.flows.length ||
      details.metrics.length ||
      details.learnings.length,
  )
}

function SectionTitle({ eyebrow, title, variant }: { eyebrow: string; title: string; variant: Variant }) {
  const styles = sectionMap[variant]

  return (
    <div>
      <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${styles.eyebrow}`}>{eyebrow}</p>
      <h2 className={`mt-2 text-2xl font-bold md:text-3xl ${styles.title}`}>{title}</h2>
    </div>
  )
}

function BulletList({ items, variant }: { items: string[]; variant: Variant }) {
  const styles = sectionMap[variant]

  if (!items.length) return null

  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item} className={`flex gap-3 text-sm leading-6 ${styles.text}`}>
          <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${variant === 'aurora' ? 'bg-rose-300' : 'bg-primary'}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function DetailPanel({
  icon,
  title,
  children,
  variant,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
  variant: Variant
}) {
  const styles = sectionMap[variant]

  return (
    <section className={`rounded-3xl border p-6 ${styles.panel}`}>
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-2xl border ${styles.line} ${styles.accent}`}>{icon}</span>
        <h3 className={`text-lg font-semibold ${styles.title}`}>{title}</h3>
      </div>
      {children}
    </section>
  )
}

export function ProjectDetailsShowcase({ project, variant = 'classic' }: ProjectDetailsShowcaseProps) {
  const styles = sectionMap[variant]
  const details = project.details

  if (!hasDetails(details)) {
    return (
      <section className={styles.shell}>
        <div className={`rounded-3xl border p-6 ${styles.panel}`}>
          <SectionTitle eyebrow="Detalhe do projeto" title="Resumo técnico" variant={variant} />
          <p className={`mt-5 max-w-3xl text-base leading-7 ${styles.text}`}>{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant={styles.badge}>{tag}</Badge>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.shell}>
      <div className={`rounded-[2rem] border p-6 md:p-8 ${styles.panel}`}>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <SectionTitle eyebrow="Detalhe do projeto" title={details.headline || project.title} variant={variant} />
            <p className={`mt-5 text-base leading-8 ${styles.text}`}>{details.overview || project.description}</p>
          </div>
          <div className={`rounded-3xl border p-5 ${styles.mutedPanel}`}>
            <div className="space-y-4">
              {details.role && (
                <div>
                  <p className={`text-xs uppercase tracking-[0.2em] ${styles.eyebrow}`}>Papel</p>
                  <p className={`mt-1 font-semibold ${styles.title}`}>{details.role}</p>
                </div>
              )}
              {details.period && (
                <div>
                  <p className={`text-xs uppercase tracking-[0.2em] ${styles.eyebrow}`}>Contexto</p>
                  <p className={`mt-1 font-semibold ${styles.title}`}>{details.period}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {(details.stack.length || project.tags.length) && (
          <div className={`mt-8 border-t pt-6 ${styles.line}`}>
            <p className={`text-sm font-semibold ${styles.title}`}>Stack e tecnologias</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[...details.stack, ...project.tags.filter((tag) => !details.stack.includes(tag))].map((item) => (
                <Badge key={item} variant={styles.badge}>{item}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DetailPanel icon={<BoltIcon className="h-5 w-5" />} title="Destaques técnicos" variant={variant}>
          <BulletList items={details.highlights} variant={variant} />
        </DetailPanel>
        <DetailPanel icon={<BriefcaseIcon className="h-5 w-5" />} title="Responsabilidades" variant={variant}>
          <BulletList items={details.responsibilities} variant={variant} />
        </DetailPanel>
      </div>

      {details.modules.length > 0 && (
        <div className="mt-8">
          <SectionTitle eyebrow="Componentes" title="Módulos e responsabilidades" variant={variant} />
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {details.modules.map((module, index) => (
              <motion.article
                key={`${module.title}-${index}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className={`rounded-3xl border p-5 ${styles.panel}`}
              >
                <div className="flex items-center gap-3">
                  <FolderOpenIcon className={`h-6 w-6 ${styles.accent}`} />
                  <h3 className={`text-lg font-semibold ${styles.title}`}>{module.title}</h3>
                </div>
                <p className={`mt-4 text-sm leading-6 ${styles.text}`}>{module.description}</p>
                {module.technologies.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {module.technologies.map((technology) => (
                      <Badge key={technology} variant={styles.badge}>{technology}</Badge>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      )}

      {details.flows.length > 0 && (
        <div className="mt-10">
          <SectionTitle eyebrow="Fluxos" title="Como o projeto funciona" variant={variant} />
          <div className="mt-5 space-y-5">
            {details.flows.map((flow, flowIndex) => (
              <div key={`${flow.title}-${flowIndex}`} className={`rounded-3xl border p-5 ${styles.panel}`}>
                <div className="flex items-center gap-3">
                  <CodeBracketSquareIcon className={`h-6 w-6 ${styles.accent}`} />
                  <h3 className={`text-lg font-semibold ${styles.title}`}>{flow.title}</h3>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {flow.steps.map((step, stepIndex) => (
                    <span key={`${step}-${stepIndex}`} className="inline-flex items-center gap-3">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.92 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.25, delay: stepIndex * 0.05 }}
                        className={`rounded-full border px-4 py-2 text-sm ${styles.mutedPanel} ${styles.text}`}
                      >
                        {step}
                      </motion.span>
                      {stepIndex < flow.steps.length - 1 && <ArrowRightIcon className={`h-4 w-4 ${styles.accent}`} />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DetailPanel icon={<ChartBarIcon className="h-5 w-5" />} title="Métricas e resultados" variant={variant}>
          <BulletList items={details.metrics} variant={variant} />
        </DetailPanel>
        <DetailPanel icon={<LightBulbIcon className="h-5 w-5" />} title="Aprendizados e decisões" variant={variant}>
          <BulletList items={details.learnings} variant={variant} />
        </DetailPanel>
      </div>

      {details.modules.length === 0 && details.flows.length === 0 && details.metrics.length === 0 && details.learnings.length === 0 && (
        <div className={`mt-8 rounded-3xl border p-6 ${styles.panel}`}>
          <div className="flex items-center gap-3">
            <BeakerIcon className={`h-6 w-6 ${styles.accent}`} />
            <p className={`font-semibold ${styles.title}`}>Complete módulos, fluxos, métricas e aprendizados no painel para enriquecer esta página.</p>
          </div>
        </div>
      )}
    </section>
  )
}
