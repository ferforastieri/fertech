import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, ArrowUpTrayIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Badge, ThemeToggle } from '@/components/ui/feedback'
import { Button, Input } from '@/components/ui/forms'
import { Article, ArticleKind, useArticleList } from '@/api/articles/useArticleList'
import { useProfileContent } from '@/api/profile/useProfileContent'
import { useHomeContent } from '@/api/home/useHomeContent'
import { ArchitectureNode, Project, ProjectArchitecture, ProjectDetails, ProjectGroup, useProjectGroups } from '@/api/projects/useProjectGroups'
import { ResumeSectionKey, useResumeContent } from '@/api/resume/useResumeContent'
import { supabase } from '@/config/supabase/client'
import { useStoredTheme } from '@/hooks/theme/useStoredTheme'
import { PlaygroundPattern, PlaygroundTreeNode, SiteContent, useSiteContent } from '@/api/site/useSiteContent'
import { notifyError, notifySuccess } from '@/components/ui/feedback/notifications'
import { LanguageSelect } from '@/components/language/LanguageSelect'
import { DEFAULT_LOCALE, Locale, useLanguage } from '@/contexts/language/LanguageContext'

type AdminTab = 'profile' | 'home' | 'content' | 'projects' | 'articles' | 'resume'

type ProfileForm = {
  name: string
  role: string
  intro: string
  contactUrl: string
  logoUrl: string
  photoUrl: string
  socialLinks: SocialLinkForm[]
  technologies: string
  aboutParagraphs: string
  highlights: HighlightForm[]
}

type SocialLinkForm = {
  name: string
  href: string
  icon: string
}

type HighlightForm = {
  icon: string
  title: string
  description: string
}

type HomeForm = {
  heroEyebrow: string
  heroHeadline: string
  heroDescription: string
  projectsButtonLabel: string
  resumeButtonLabel: string
  contactButtonLabel: string
  stackTitle: string
  stackGroups: StackGroupForm[]
  classicAboutTitle: string
  classicHighlightsTitle: string
  classicCapabilitiesTitle: string
  languageNote: string
  auroraAboutEyebrow: string
  auroraAboutTitle: string
  projectsEyebrow: string
  projectsTitle: string
  projectsLinkLabel: string
  projectsTotalLabel: string
  blogEyebrow: string
  blogTitle: string
  contactTitle: string
  contactDescription: string
}

type StackGroupForm = {
  title: string
  items: string
}

type ProjectGroupForm = {
  id: string
  title: string
  sortOrder: number
  projects: ProjectForm[]
}

type ProjectForm = {
  id: string
  groupId: string
  title: string
  description: string
  logo: string
  tags: string
  projectUrl: string
  siteUrl: string
  architecture: ProjectArchitecture | null
  details: ProjectDetails
  sortOrder: number
}

type ArticleForm = {
  slug: string
  title: string
  category: string
  description: string
  date: string
  readTime: string
  content: string
  kind: ArticleKind
  sortOrder: number
}

type ResumeForm = {
  technologies: string
  aboutParagraphs: string
  languages: LanguageForm[]
  sections: ResumeSectionForm[]
  location: string
  downloadLabel: string
  generatingLabel: string
  pdfFilename: string
  projectTechnologiesLabel: string
  education: EducationForm[]
  experiences: ExperienceForm[]
}

type LanguageForm = {
  name: string
  description: string
}

type ResumeSectionForm = {
  key: ResumeSectionKey
  title: string
  enabled: boolean
}

type EducationForm = {
  id: string
  institution: string
  course: string
  location: string
  period: string
  sortOrder: number
}

type ExperienceForm = {
  id: string
  company: string
  position: string
  location: string
  period: string
  responsibilities: string
  roles: ResumeRoleForm[]
  sortOrder: number
}

type ResumeRoleForm = {
  position: string
  period: string
}

const tabs: Array<{ id: AdminTab; label: string }> = [
  { id: 'profile', label: 'Perfil' },
  { id: 'home', label: 'Home' },
  { id: 'content', label: 'Conteúdo do site' },
  { id: 'projects', label: 'Projetos' },
  { id: 'articles', label: 'Artigos' },
  { id: 'resume', label: 'Currículo' },
]

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseTextList(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function formatTextList(value: string[] | undefined) {
  return (value ?? []).join('\n')
}

function Textarea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-transparent focus:ring-2 focus:ring-foreground"
      />
    </label>
  )
}

function FileUploadButton({
  label,
  disabled,
  onFile,
}: {
  label: string
  disabled?: boolean
  onFile: (file: File) => void
}) {
  return (
    <label
      className={`grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-xl border border-border bg-background text-foreground transition hover:bg-accent hover:text-accent-foreground ${
        disabled ? 'pointer-events-none opacity-60' : ''
      }`}
      title={label}
      aria-label={label}
    >
      <ArrowUpTrayIcon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onFile(file)
          event.target.value = ''
        }}
      />
    </label>
  )
}

function RemoveIconButton({ label, onClick, className = '' }: { label: string; onClick: () => void; className?: string }) {
  return (
    <Button type="button" variant="destructive" className={`h-10 !w-10 shrink-0 px-0 ${className}`} aria-label={label} title={label} onClick={onClick}>
      <TrashIcon className="h-4 w-4" />
    </Button>
  )
}

function AdminSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-7">
      <div className="border-b border-border pb-5">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-7">{children}</div>
    </section>
  )
}

function AdminCard({
  title,
  description,
  children,
  action,
}: {
  title: string
  description?: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card/40 p-4 sm:p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>}
        </div>
        {action && <AdminActions className="sm:shrink-0">{action}</AdminActions>}
      </div>
      {children}
    </section>
  )
}

function AdminInlineSection({
  title,
  description,
  children,
  action,
}: {
  title: string
  description?: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <section className="space-y-5 border-t border-border/70 pt-6 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>}
        </div>
        {action && <AdminActions className="sm:shrink-0">{action}</AdminActions>}
      </div>
      {children}
    </section>
  )
}

function AdminActions({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 [&>button]:w-full [&>label]:w-full sm:[&>button]:w-auto sm:[&>label]:w-auto ${className}`}>
      {children}
    </div>
  )
}

function cloneSiteContent(content: SiteContent): SiteContent {
  return structuredClone(content)
}

function cloneArchitecture(architecture: ProjectArchitecture | undefined): ProjectArchitecture | null {
  return architecture ? structuredClone(architecture) : null
}

function cloneProjectDetails(details: ProjectDetails | undefined): ProjectDetails {
  return details ? structuredClone(details) : createProjectDetails()
}

function createProjectDetails(): ProjectDetails {
  return {
    headline: '',
    overview: '',
    role: '',
    period: '',
    stack: [],
    highlights: [],
    responsibilities: [],
    modules: [],
    flows: [],
    metrics: [],
    learnings: [],
  }
}

function createDetailModule() {
  return {
    title: '',
    description: '',
    technologies: [],
  }
}

function createDetailFlow() {
  return {
    title: '',
    steps: [],
  }
}

function createArchitecture(): ProjectArchitecture {
  return {
    name: '',
    summary: '',
    accent: '#fb7185',
    layers: {
      clients: [],
      services: [],
      platform: [],
    },
    folders: [],
  }
}

function createArchitectureNode(): ArchitectureNode {
  return {
    name: '',
    description: '',
    technologies: [],
  }
}

function ProjectArchitectureEditor({
  value,
  onChange,
}: {
  value: ProjectArchitecture | null
  onChange: (value: ProjectArchitecture | null) => void
}) {
  if (!value) {
    return (
      <AdminInlineSection
        title="Arquitetura do projeto"
        description="Aparece na página de detalhe do projeto, abaixo da apresentação. Ative somente quando quiser mostrar camadas, tecnologias e pastas desse projeto."
        action={
          <Button type="button" variant="outline" onClick={() => onChange(createArchitecture())}>
            Adicionar arquitetura
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground">Este projeto ainda não tem seção de arquitetura.</p>
      </AdminInlineSection>
    )
  }

  const updateLayer = (layer: keyof ProjectArchitecture['layers'], nodes: ArchitectureNode[]) => {
    onChange({ ...value, layers: { ...value.layers, [layer]: nodes } })
  }

  return (
    <AdminInlineSection
      title="Arquitetura do projeto"
      description="Aparece no detalhe do projeto. Use camadas para explicar clientes, serviços e plataforma."
      action={
        <RemoveIconButton label="Remover arquitetura" onClick={() => onChange(null)} />
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nome exibido na seção" value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} />
        <Input label="Cor de destaque" value={value.accent} onChange={(event) => onChange({ ...value, accent: event.target.value })} />
        <div className="md:col-span-2">
          <Textarea label="Resumo da arquitetura" value={value.summary} onChange={(summary) => onChange({ ...value, summary })} rows={3} />
        </div>
        <div className="md:col-span-2">
          <Textarea label="Pastas exibidas, uma por linha" value={formatTextList(value.folders)} onChange={(folders) => onChange({ ...value, folders: parseTextList(folders) })} rows={5} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {(['clients', 'services', 'platform'] as Array<keyof ProjectArchitecture['layers']>).map((layer) => (
          <section key={layer} className="space-y-3">
            <h4 className="text-base font-semibold text-foreground">{layer === 'clients' ? 'Camada cliente' : layer === 'services' ? 'Camada serviços' : 'Camada plataforma'}</h4>
            <div className="space-y-4">
              {value.layers[layer].map((node, index) => (
                <div key={`${node.name}-${index}`} className="space-y-3 border-b border-border/60 pb-4 last:border-b-0">
                  <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                    <Input
                      label="Nome"
                      value={node.name}
                      onChange={(event) =>
                        updateLayer(
                          layer,
                          value.layers[layer].map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)),
                        )
                      }
                    />
                    <RemoveIconButton label="Remover item" onClick={() => updateLayer(layer, value.layers[layer].filter((_, itemIndex) => itemIndex !== index))} />
                  </div>
                  <Textarea
                    label="Descrição"
                    value={node.description}
                    onChange={(description) =>
                      updateLayer(
                        layer,
                        value.layers[layer].map((item, itemIndex) => (itemIndex === index ? { ...item, description } : item)),
                      )
                    }
                    rows={3}
                  />
                  <Textarea
                    label="Tecnologias, uma por linha"
                    value={formatTextList(node.technologies)}
                    onChange={(technologies) =>
                      updateLayer(
                        layer,
                        value.layers[layer].map((item, itemIndex) => (itemIndex === index ? { ...item, technologies: parseTextList(technologies) } : item)),
                      )
                    }
                    rows={4}
                  />
                </div>
              ))}
              <Button type="button" variant="outline" className="w-full" onClick={() => updateLayer(layer, [...value.layers[layer], createArchitectureNode()])}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Adicionar item
              </Button>
            </div>
          </section>
        ))}
      </div>
    </AdminInlineSection>
  )
}

function ProjectDetailsEditor({
  value,
  onChange,
}: {
  value: ProjectDetails
  onChange: (value: ProjectDetails) => void
}) {
  return (
    <AdminInlineSection
      title="Detalhes do projeto"
      description="Aparece na página interna de detalhe quando o usuário clica em Ver projeto. Use estes campos para explicar profundamente contexto, módulos, fluxos e decisões técnicas."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Headline da página" value={value.headline} onChange={(event) => onChange({ ...value, headline: event.target.value })} />
        <Input label="Seu papel no projeto" value={value.role} onChange={(event) => onChange({ ...value, role: event.target.value })} />
        <Input label="Período ou contexto" value={value.period} onChange={(event) => onChange({ ...value, period: event.target.value })} />
        <div className="md:col-span-2">
          <Textarea label="Visão geral detalhada" value={value.overview} onChange={(overview) => onChange({ ...value, overview })} rows={5} />
        </div>
        <Textarea label="Stack principal, uma por linha" value={formatTextList(value.stack)} onChange={(stack) => onChange({ ...value, stack: parseTextList(stack) })} rows={6} />
        <Textarea label="Destaques técnicos, um por linha" value={formatTextList(value.highlights)} onChange={(highlights) => onChange({ ...value, highlights: parseTextList(highlights) })} rows={6} />
        <Textarea label="Responsabilidades, uma por linha" value={formatTextList(value.responsibilities)} onChange={(responsibilities) => onChange({ ...value, responsibilities: parseTextList(responsibilities) })} rows={6} />
        <Textarea label="Métricas/resultados, um por linha" value={formatTextList(value.metrics)} onChange={(metrics) => onChange({ ...value, metrics: parseTextList(metrics) })} rows={6} />
        <div className="md:col-span-2">
          <Textarea label="Aprendizados e decisões, um por linha" value={formatTextList(value.learnings)} onChange={(learnings) => onChange({ ...value, learnings: parseTextList(learnings) })} rows={5} />
        </div>
      </div>

      <section className="space-y-5 border-t border-border/70 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h4 className="text-base font-semibold text-foreground">Módulos do projeto</h4>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Explique partes como API, app, painel, workers, integrações e infraestrutura.</p>
          </div>
          <AdminActions className="sm:shrink-0">
            <Button type="button" variant="outline" onClick={() => onChange({ ...value, modules: [...value.modules, createDetailModule()] })}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Adicionar módulo
            </Button>
          </AdminActions>
        </div>
        <div className="space-y-4">
          {value.modules.map((module, index) => (
            <div key={`${module.title}-${index}`} className="grid gap-3 border-b border-border/60 pb-4 last:border-b-0 md:grid-cols-2">
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <Input label="Nome do módulo" value={module.title} onChange={(event) => onChange({ ...value, modules: value.modules.map((item, itemIndex) => (itemIndex === index ? { ...item, title: event.target.value } : item)) })} />
                <RemoveIconButton label="Remover módulo" onClick={() => onChange({ ...value, modules: value.modules.filter((_, itemIndex) => itemIndex !== index) })} />
              </div>
              <Textarea label="Tecnologias do módulo, uma por linha" value={formatTextList(module.technologies)} onChange={(technologies) => onChange({ ...value, modules: value.modules.map((item, itemIndex) => (itemIndex === index ? { ...item, technologies: parseTextList(technologies) } : item)) })} rows={4} />
              <div className="md:col-span-2">
                <Textarea label="Descrição do módulo" value={module.description} onChange={(description) => onChange({ ...value, modules: value.modules.map((item, itemIndex) => (itemIndex === index ? { ...item, description } : item)) })} rows={3} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5 border-t border-border/70 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h4 className="text-base font-semibold text-foreground">Fluxos importantes</h4>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Use para mostrar jornadas como autenticação, upload, integração, notificações ou processamento.</p>
          </div>
          <AdminActions className="sm:shrink-0">
            <Button type="button" variant="outline" onClick={() => onChange({ ...value, flows: [...value.flows, createDetailFlow()] })}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Adicionar fluxo
            </Button>
          </AdminActions>
        </div>
        <div className="space-y-4">
          {value.flows.map((flow, index) => (
            <div key={`${flow.title}-${index}`} className="grid gap-3 border-b border-border/60 pb-4 last:border-b-0 md:grid-cols-2">
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <Input label="Nome do fluxo" value={flow.title} onChange={(event) => onChange({ ...value, flows: value.flows.map((item, itemIndex) => (itemIndex === index ? { ...item, title: event.target.value } : item)) })} />
                <RemoveIconButton label="Remover fluxo" onClick={() => onChange({ ...value, flows: value.flows.filter((_, itemIndex) => itemIndex !== index) })} />
              </div>
              <Textarea label="Passos do fluxo, um por linha" value={formatTextList(flow.steps)} onChange={(steps) => onChange({ ...value, flows: value.flows.map((item, itemIndex) => (itemIndex === index ? { ...item, steps: parseTextList(steps) } : item)) })} rows={5} />
            </div>
          ))}
        </div>
      </section>
    </AdminInlineSection>
  )
}

function createTreeNode(): PlaygroundTreeNode {
  return {
    name: '',
    description: '',
    technologies: [],
    children: [],
  }
}

function createPattern(index: number): PlaygroundPattern {
  return {
    id: `pattern-${index + 1}`,
    name: '',
    category: '',
    description: '',
    flow: [],
    technologies: [],
  }
}

function createPlaygroundExperiment(index: number) {
  return {
    eyebrow: `Experimento ${index + 1}`,
    title: '',
    description: '',
  }
}

function TreeNodeEditor({
  node,
  depth = 0,
  onChange,
  onRemove,
}: {
  node: PlaygroundTreeNode
  depth?: number
  onChange: (node: PlaygroundTreeNode) => void
  onRemove: () => void
}) {
  const children = node.children ?? []

  return (
    <div className="space-y-3 border-b border-border/60 pb-4 last:border-b-0" style={{ marginLeft: depth ? `${Math.min(depth * 1.25, 3)}rem` : undefined }}>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <Input label="Nome da pasta ou arquivo" value={node.name} onChange={(event) => onChange({ ...node, name: event.target.value })} />
          <RemoveIconButton label="Remover pasta ou arquivo" onClick={onRemove} />
        </div>
        <Textarea label="Tecnologias mostradas, uma por linha" value={formatTextList(node.technologies)} onChange={(technologies) => onChange({ ...node, technologies: parseTextList(technologies) })} rows={3} />
        <div className="md:col-span-2">
          <Textarea label="Descrição exibida ao abrir" value={node.description} onChange={(description) => onChange({ ...node, description })} rows={2} />
        </div>
      </div>
      <div className="space-y-3">
        {children.map((child, index) => (
          <TreeNodeEditor
            key={`${child.name}-${index}`}
            node={child}
            depth={depth + 1}
            onChange={(nextChild) => onChange({ ...node, children: children.map((item, itemIndex) => (itemIndex === index ? nextChild : item)) })}
            onRemove={() => onChange({ ...node, children: children.filter((_, itemIndex) => itemIndex !== index) })}
          />
        ))}
      </div>
      <AdminActions>
        <Button type="button" variant="outline" onClick={() => onChange({ ...node, children: [...children, createTreeNode()] })}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Adicionar dentro
        </Button>
      </AdminActions>
    </div>
  )
}

function SiteContentEditor({
  value,
  onChange,
}: {
  value: SiteContent
  onChange: (value: SiteContent) => void
}) {
  const update = <Key extends keyof SiteContent>(key: Key, nextValue: SiteContent[Key]) => onChange({ ...value, [key]: nextValue })
  const [selectedContentSection, setSelectedContentSection] = useState('navigation')
  const contentSections = [
    { id: 'navigation', title: 'Menu e modos', description: 'Navegação, troca de experiência e modal.' },
    { id: 'gateway', title: 'Entrada', description: 'Tela de escolha entre tradicional e Aurora.' },
    { id: 'common', title: 'Textos comuns', description: 'Labels, botões, loading e erros globais.' },
    { id: 'pages', title: 'Páginas', description: 'Blog, Projetos e Currículo.' },
    { id: 'playground', title: 'Playground', description: 'Topo, controles e experiências WebGL.' },
    { id: 'playground-architecture', title: 'Playground arquitetura', description: 'Pastas abríveis e design patterns.' },
    { id: 'project-architecture', title: 'Detalhe arquitetura', description: 'Textos da arquitetura dentro dos projetos.' },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <aside className="space-y-2 rounded-xl border border-border p-3">
        <h3 className="px-2 text-sm font-semibold text-foreground">Selecione a seção</h3>
        {contentSections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setSelectedContentSection(section.id)}
            className={`w-full rounded-lg px-3 py-2 text-left transition ${selectedContentSection === section.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <span className="block text-sm font-semibold">{section.title}</span>
            <span className="block text-xs opacity-75">{section.description}</span>
          </button>
        ))}
      </aside>

      <div className="space-y-6">
      {selectedContentSection === 'navigation' && (
      <AdminCard title="Menu e troca de modo" description="Muda os textos da navegação nos layouts tradicional e Aurora, incluindo o modal que leva para o playground Aurora.">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Menu: Home" value={value.navigation.home} onChange={(event) => update('navigation', { ...value.navigation, home: event.target.value })} />
          <Input label="Menu: Blog" value={value.navigation.blog} onChange={(event) => update('navigation', { ...value.navigation, blog: event.target.value })} />
          <Input label="Menu: Projetos" value={value.navigation.projects} onChange={(event) => update('navigation', { ...value.navigation, projects: event.target.value })} />
          <Input label="Menu: Currículo" value={value.navigation.resume} onChange={(event) => update('navigation', { ...value.navigation, resume: event.target.value })} />
          <Input label="Menu: Playground" value={value.navigation.playground} onChange={(event) => update('navigation', { ...value.navigation, playground: event.target.value })} />
          <Input label="Botão para Aurora" value={value.navigation.switchToAurora} onChange={(event) => update('navigation', { ...value.navigation, switchToAurora: event.target.value })} />
          <Input label="Botão para tradicional" value={value.navigation.switchToClassic} onChange={(event) => update('navigation', { ...value.navigation, switchToClassic: event.target.value })} />
          <Input label="Rótulo de redes sociais" value={value.navigation.socialLinks} onChange={(event) => update('navigation', { ...value.navigation, socialLinks: event.target.value })} />
          <Input label="Modal playground: título" value={value.navigation.playgroundDialogTitle} onChange={(event) => update('navigation', { ...value.navigation, playgroundDialogTitle: event.target.value })} />
          <Input label="Modal playground: botão cancelar" value={value.navigation.cancel} onChange={(event) => update('navigation', { ...value.navigation, cancel: event.target.value })} />
          <Input label="Modal playground: botão continuar" value={value.navigation.goToAurora} onChange={(event) => update('navigation', { ...value.navigation, goToAurora: event.target.value })} />
          <Textarea label="Modal playground: descrição" value={value.navigation.playgroundDialogDescription} onChange={(playgroundDialogDescription) => update('navigation', { ...value.navigation, playgroundDialogDescription })} rows={3} />
        </div>
      </AdminCard>
      )}

      {selectedContentSection === 'gateway' && (
      <AdminCard title="Tela de escolha de experiência" description="Muda a tela inicial que apresenta os modos tradicional e Aurora antes de redirecionar.">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Chamada pequena" value={value.gateway.kicker} onChange={(event) => update('gateway', { ...value.gateway, kicker: event.target.value })} />
          <Input label="Título linha 1" value={value.gateway.titleLine1} onChange={(event) => update('gateway', { ...value.gateway, titleLine1: event.target.value })} />
          <Input label="Título linha 2" value={value.gateway.titleLine2} onChange={(event) => update('gateway', { ...value.gateway, titleLine2: event.target.value })} />
          <Input label="Segundos para redirecionar" value={String(value.gateway.redirectSeconds)} onChange={(event) => update('gateway', { ...value.gateway, redirectSeconds: Number(event.target.value) || 0 })} />
          <div className="md:col-span-2">
            <Textarea label="Descrição. Use {seconds} onde entra a contagem regressiva." value={value.gateway.descriptionTemplate} onChange={(descriptionTemplate) => update('gateway', { ...value.gateway, descriptionTemplate })} rows={3} />
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {value.gateway.modes.map((mode, index) => (
            <div key={mode.id} className="space-y-3 border-b border-border/60 pb-4 last:border-b-0">
              <Input label={`Modo ${mode.id}: nome`} value={mode.name} onChange={(event) => update('gateway', { ...value.gateway, modes: value.gateway.modes.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)) })} />
              <Input label="Público" value={mode.audience} onChange={(event) => update('gateway', { ...value.gateway, modes: value.gateway.modes.map((item, itemIndex) => (itemIndex === index ? { ...item, audience: event.target.value } : item)) })} />
              <Input label="Destino" value={mode.href} onChange={(event) => update('gateway', { ...value.gateway, modes: value.gateway.modes.map((item, itemIndex) => (itemIndex === index ? { ...item, href: event.target.value } : item)) })} />
              <Textarea label="Descrição" value={mode.description} onChange={(description) => update('gateway', { ...value.gateway, modes: value.gateway.modes.map((item, itemIndex) => (itemIndex === index ? { ...item, description } : item)) })} rows={3} />
            </div>
          ))}
        </div>
      </AdminCard>
      )}

      {selectedContentSection === 'common' && (
      <AdminCard title="Textos comuns" description="Muda botões, estados de carregamento, erros e rótulos usados em mais de uma tela.">
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(value.common).map(([key, item]) => (
            <Input
              key={key}
              label={commonContentLabels[key] ?? key}
              value={String(item)}
              onChange={(event) => update('common', { ...value.common, [key]: event.target.value })}
            />
          ))}
        </div>
      </AdminCard>
      )}

      {selectedContentSection === 'pages' && (
      <div className="grid gap-5 lg:grid-cols-3">
        <AdminCard title="Blog" description="Muda títulos, descrições e mensagens da listagem e detalhe de artigos.">
          <ContentObjectFields value={value.blog} labels={blogContentLabels} onChange={(blog) => update('blog', blog)} />
        </AdminCard>
        <AdminCard title="Projetos" description="Muda títulos, descrições e mensagens da listagem e detalhe de projetos.">
          <ContentObjectFields value={value.projects} labels={projectsContentLabels} onChange={(projects) => update('projects', projects)} />
        </AdminCard>
        <AdminCard title="Currículo" description="Muda mensagens e textos auxiliares do currículo.">
          <ContentObjectFields value={value.resume} labels={resumeContentLabels} onChange={(resume) => update('resume', resume)} />
        </AdminCard>
      </div>
      )}

      {selectedContentSection === 'playground' && (
      <AdminCard title="Playground WebGL" description="Muda o topo, controles, cores e cards das experiências WebGL.">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Chamada superior" value={value.playground.eyebrow} onChange={(event) => update('playground', { ...value.playground, eyebrow: event.target.value })} />
          <Input label="Título" value={value.playground.title} onChange={(event) => update('playground', { ...value.playground, title: event.target.value })} />
          <Textarea label="Descrição" value={value.playground.description} onChange={(description) => update('playground', { ...value.playground, description })} rows={3} />
          <Textarea label="Cores, uma por linha" value={formatTextList(value.playground.colors)} onChange={(colors) => update('playground', { ...value.playground, colors: parseTextList(colors) })} rows={5} />
          <Input label="Título dos controles" value={value.playground.controlsTitle} onChange={(event) => update('playground', { ...value.playground, controlsTitle: event.target.value })} />
          <Input label="Botão pausar" value={value.playground.pause} onChange={(event) => update('playground', { ...value.playground, pause: event.target.value })} />
          <Input label="Botão continuar" value={value.playground.resume} onChange={(event) => update('playground', { ...value.playground, resume: event.target.value })} />
          <Input label="Botão randomizar" value={value.playground.randomize} onChange={(event) => update('playground', { ...value.playground, randomize: event.target.value })} />
          <Input label="Botão limpar" value={value.playground.clear} onChange={(event) => update('playground', { ...value.playground, clear: event.target.value })} />
          <Input label="Controle: pincel" value={value.playground.brush} onChange={(event) => update('playground', { ...value.playground, brush: event.target.value })} />
          <Input label="Controle: elementos" value={value.playground.elements} onChange={(event) => update('playground', { ...value.playground, elements: event.target.value })} />
          <Input label="Controle: velocidade" value={value.playground.speed} onChange={(event) => update('playground', { ...value.playground, speed: event.target.value })} />
          <Input label="Status desenho ativo" value={value.playground.drawingEnabled} onChange={(event) => update('playground', { ...value.playground, drawingEnabled: event.target.value })} />
          <Input label="Botão ativar desenho" value={value.playground.enableDrawing} onChange={(event) => update('playground', { ...value.playground, enableDrawing: event.target.value })} />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {value.playground.modes.map((mode, index) => (
            <Input
              key={mode.id}
              label={`Modo visual: ${mode.id}`}
              value={mode.label}
              onChange={(event) => update('playground', { ...value.playground, modes: value.playground.modes.map((item, itemIndex) => (itemIndex === index ? { ...item, label: event.target.value } : item)) })}
            />
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {value.playground.experiments.map((experiment, index) => (
            <div key={`${experiment.title}-${index}`} className="space-y-3 border-b border-border/60 pb-4 last:border-b-0">
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <Input label={`Experimento ${index + 1}: chamada`} value={experiment.eyebrow} onChange={(event) => update('playground', { ...value.playground, experiments: value.playground.experiments.map((item, itemIndex) => (itemIndex === index ? { ...item, eyebrow: event.target.value } : item)) })} />
                <RemoveIconButton label="Remover experimento" onClick={() => update('playground', { ...value.playground, experiments: value.playground.experiments.filter((_, itemIndex) => itemIndex !== index) })} />
              </div>
              <Input label="Título" value={experiment.title} onChange={(event) => update('playground', { ...value.playground, experiments: value.playground.experiments.map((item, itemIndex) => (itemIndex === index ? { ...item, title: event.target.value } : item)) })} />
              <Textarea label="Descrição" value={experiment.description} onChange={(description) => update('playground', { ...value.playground, experiments: value.playground.experiments.map((item, itemIndex) => (itemIndex === index ? { ...item, description } : item)) })} rows={3} />
            </div>
          ))}
        </div>
        <AdminActions className="mt-4">
          <Button type="button" variant="outline" onClick={() => update('playground', { ...value.playground, experiments: [...value.playground.experiments, createPlaygroundExperiment(value.playground.experiments.length)] })}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar experimento
          </Button>
        </AdminActions>
      </AdminCard>
      )}

      {selectedContentSection === 'playground-architecture' && (
      <AdminCard title="Playground: arquitetura animada" description="Muda a seção com pastas abríveis e design patterns animados dentro do playground.">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Título da árvore de pastas" value={value.playground.architecture.treeTitle} onChange={(event) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, treeTitle: event.target.value } })} />
          <Input label="Rótulo da raiz" value={value.playground.architecture.rootLabel} onChange={(event) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, rootLabel: event.target.value } })} />
          <Input label="Título dos design patterns" value={value.playground.architecture.patternsTitle} onChange={(event) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patternsTitle: event.target.value } })} />
          <Input label="Rodapé da seção" value={value.playground.architecture.footer} onChange={(event) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, footer: event.target.value } })} />
        </div>
        <h4 className="mt-6 text-base font-semibold">Pastas e tecnologias</h4>
        <div className="mt-3 space-y-3">
          {value.playground.architecture.tree.map((node, index) => (
            <TreeNodeEditor
              key={`${node.name}-${index}`}
              node={node}
              onChange={(nextNode) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, tree: value.playground.architecture.tree.map((item, itemIndex) => (itemIndex === index ? nextNode : item)) } })}
              onRemove={() => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, tree: value.playground.architecture.tree.filter((_, itemIndex) => itemIndex !== index) } })}
            />
          ))}
        </div>
        <AdminActions className="mt-4">
          <Button type="button" variant="outline" onClick={() => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, tree: [...value.playground.architecture.tree, createTreeNode()] } })}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar pasta raiz
          </Button>
        </AdminActions>
        <h4 className="mt-6 text-base font-semibold">Design patterns</h4>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {value.playground.architecture.patterns.map((pattern, index) => (
            <div key={`${pattern.id}-${index}`} className="space-y-3 border-b border-border/60 pb-4 last:border-b-0">
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <Input label="Identificador" value={pattern.id} onChange={(event) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: value.playground.architecture.patterns.map((item, itemIndex) => (itemIndex === index ? { ...item, id: slugify(event.target.value) || event.target.value } : item)) } })} />
                <RemoveIconButton label="Remover pattern" onClick={() => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: value.playground.architecture.patterns.filter((_, itemIndex) => itemIndex !== index) } })} />
              </div>
              <Input label="Nome do pattern" value={pattern.name} onChange={(event) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: value.playground.architecture.patterns.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)) } })} />
              <Input label="Categoria" value={pattern.category} onChange={(event) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: value.playground.architecture.patterns.map((item, itemIndex) => (itemIndex === index ? { ...item, category: event.target.value } : item)) } })} />
              <Textarea label="Descrição" value={pattern.description} onChange={(description) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: value.playground.architecture.patterns.map((item, itemIndex) => (itemIndex === index ? { ...item, description } : item)) } })} rows={3} />
              <Textarea label="Fluxo animado, um passo por linha" value={formatTextList(pattern.flow)} onChange={(flow) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: value.playground.architecture.patterns.map((item, itemIndex) => (itemIndex === index ? { ...item, flow: parseTextList(flow) } : item)) } })} rows={4} />
              <Textarea label="Tecnologias, uma por linha" value={formatTextList(pattern.technologies)} onChange={(technologies) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: value.playground.architecture.patterns.map((item, itemIndex) => (itemIndex === index ? { ...item, technologies: parseTextList(technologies) } : item)) } })} rows={4} />
            </div>
          ))}
        </div>
        <AdminActions className="mt-4">
          <Button type="button" variant="outline" onClick={() => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: [...value.playground.architecture.patterns, createPattern(value.playground.architecture.patterns.length)] } })}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar pattern
          </Button>
        </AdminActions>
      </AdminCard>
      )}

      {selectedContentSection === 'project-architecture' && (
      <AdminCard title="Detalhe do projeto: seção Arquitetura" description="Muda apenas os textos fixos da seção de arquitetura que aparece dentro de cada projeto com arquitetura ativa. O conteúdo específico de cada projeto fica na aba Projetos.">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Chamada superior" value={value.architecture.eyebrow} onChange={(event) => update('architecture', { ...value.architecture, eyebrow: event.target.value })} />
          <Input label="Título" value={value.architecture.title} onChange={(event) => update('architecture', { ...value.architecture, title: event.target.value })} />
          <Input label="Rótulo do fluxo" value={value.architecture.flowLabel} onChange={(event) => update('architecture', { ...value.architecture, flowLabel: event.target.value })} />
          <Input label="Título das pastas" value={value.architecture.foldersTitle} onChange={(event) => update('architecture', { ...value.architecture, foldersTitle: event.target.value })} />
          <Textarea label="Descrição da seção" value={value.architecture.description} onChange={(description) => update('architecture', { ...value.architecture, description })} rows={3} />
          <Textarea
            label="Títulos das camadas, um por linha"
            value={value.architecture.layerTitles.join('\n')}
            onChange={(layerTitles) => {
              const [first = '', second = '', third = ''] = parseTextList(layerTitles)
              update('architecture', { ...value.architecture, layerTitles: [first, second, third] })
            }}
            rows={3}
          />
        </div>
      </AdminCard>
      )}
      </div>
    </div>
  )
}

function ContentObjectFields<T extends Record<string, string>>({
  value,
  labels,
  onChange,
}: {
  value: T
  labels: Record<string, string>
  onChange: (value: T) => void
}) {
  return (
    <div className="space-y-3">
      {Object.entries(value).map(([key, item]) =>
        item.length > 90 ? (
          <Textarea key={key} label={labels[key] ?? key} value={item} onChange={(nextValue) => onChange({ ...value, [key]: nextValue })} rows={3} />
        ) : (
          <Input key={key} label={labels[key] ?? key} value={item} onChange={(event) => onChange({ ...value, [key]: event.target.value })} />
        ),
      )}
    </div>
  )
}

const commonContentLabels: Record<string, string> = {
  readTimeSuffix: 'Sufixo de tempo de leitura',
  articlesCountLabel: 'Legenda de quantidade de artigos',
  projectsCountLabel: 'Legenda de quantidade de projetos',
  viewProject: 'Botão: Ver projeto',
  viewSite: 'Botão: Ver site',
  loadingPage: 'Carregando página',
  homeLoading: 'Carregando home',
  contentLoadError: 'Erro ao carregar conteúdo',
  closeNavigation: 'Acessibilidade: fechar navegação',
}

const blogContentLabels: Record<string, string> = {
  title: 'Título da página Blog',
  description: 'Descrição da página Blog',
  auroraEyebrow: 'Chamada no modo Aurora',
  workTitle: 'Título da lista profissional',
  personalTitle: 'Título da lista pessoal',
  loading: 'Carregando',
  error: 'Erro',
  notFoundTitle: 'Artigo não encontrado',
  backToBlog: 'Voltar para blog',
  backToArticles: 'Voltar para artigos',
}

const projectsContentLabels: Record<string, string> = {
  title: 'Título da página Projetos',
  description: 'Descrição da página Projetos',
  auroraEyebrow: 'Chamada no modo Aurora',
  loading: 'Carregando',
  error: 'Erro',
  notFound: 'Projeto não encontrado',
  backToProjects: 'Voltar para projetos',
}

const resumeContentLabels: Record<string, string> = {
  loading: 'Carregando',
  error: 'Erro',
  logoAlt: 'Texto alternativo da logo',
  pdfSuccess: 'PDF gerado com sucesso',
  pdfError: 'Erro ao gerar PDF',
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { locale } = useLanguage()
  const [activeTab, setActiveTab] = useState<AdminTab>('profile')
  const [status, setStatus] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState('')
  const [selectedProjectGroupIndex, setSelectedProjectGroupIndex] = useState(0)
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0)
  const [selectedArticleIndex, setSelectedArticleIndex] = useState(0)
  const { theme, toggleTheme } = useStoredTheme()

  const profileQuery = useProfileContent()
  const homeQuery = useHomeContent()
  const projectGroupsQuery = useProjectGroups()
  const workArticlesQuery = useArticleList('work')
  const personalArticlesQuery = useArticleList('personal')
  const resumeQuery = useResumeContent()
  const siteContentQuery = useSiteContent()
  const [siteContentForm, setSiteContentForm] = useState<SiteContent | null>(null)

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: '',
    role: '',
    intro: '',
    contactUrl: '',
    logoUrl: '',
    photoUrl: '',
    socialLinks: [],
    technologies: '',
    aboutParagraphs: '',
    highlights: [],
  })
  const [projectGroupsForm, setProjectGroupsForm] = useState<ProjectGroupForm[]>([])
  const [homeForm, setHomeForm] = useState<HomeForm>({
    heroEyebrow: '',
    heroHeadline: '',
    heroDescription: '',
    projectsButtonLabel: '',
    resumeButtonLabel: '',
    contactButtonLabel: '',
    stackTitle: '',
    stackGroups: [],
    classicAboutTitle: '',
    classicHighlightsTitle: '',
    classicCapabilitiesTitle: '',
    languageNote: '',
    auroraAboutEyebrow: '',
    auroraAboutTitle: '',
    projectsEyebrow: '',
    projectsTitle: '',
    projectsLinkLabel: '',
    projectsTotalLabel: '',
    blogEyebrow: '',
    blogTitle: '',
    contactTitle: '',
    contactDescription: '',
  })
  const [articleForms, setArticleForms] = useState<ArticleForm[]>([])
  const [resumeForm, setResumeForm] = useState<ResumeForm>({
    technologies: '',
    aboutParagraphs: '',
    languages: [],
    sections: [],
    location: '',
    downloadLabel: '',
    generatingLabel: '',
    pdfFilename: '',
    projectTechnologiesLabel: '',
    education: [],
    experiences: [],
  })

  const isLoading =
    profileQuery.isLoading ||
    homeQuery.isLoading ||
    projectGroupsQuery.isLoading ||
    workArticlesQuery.isLoading ||
    personalArticlesQuery.isLoading ||
    resumeQuery.isLoading ||
    siteContentQuery.isLoading

  const articleQueries = useMemo(
    () => [...(workArticlesQuery.data ?? []), ...(personalArticlesQuery.data ?? [])],
    [workArticlesQuery.data, personalArticlesQuery.data],
  )

  useEffect(() => {
    if (siteContentQuery.data) setSiteContentForm(cloneSiteContent(siteContentQuery.data))
  }, [siteContentQuery.data])

  useEffect(() => {
    if (!profileQuery.data) return
    setProfileForm({
      name: profileQuery.data.name,
      role: profileQuery.data.role,
      intro: profileQuery.data.intro,
      contactUrl: profileQuery.data.contactUrl,
      logoUrl: profileQuery.data.logoUrl,
      photoUrl: profileQuery.data.photoUrl,
      socialLinks: profileQuery.data.socialLinks.map((social) => ({ ...social })),
      technologies: formatTextList(profileQuery.data.technologies),
      aboutParagraphs: formatTextList(profileQuery.data.aboutParagraphs),
      highlights: profileQuery.data.highlights.map((highlight) => ({ ...highlight })),
    })
  }, [profileQuery.data])

  useEffect(() => {
    if (!projectGroupsQuery.data) return
    setProjectGroupsForm(projectGroupsQuery.data.map(mapProjectGroupToForm))
  }, [projectGroupsQuery.data])

  useEffect(() => {
    setSelectedProjectGroupIndex((current) => Math.min(current, Math.max(projectGroupsForm.length - 1, 0)))
  }, [projectGroupsForm.length])

  useEffect(() => {
    const selectedGroup = projectGroupsForm[selectedProjectGroupIndex]
    setSelectedProjectIndex((current) => Math.min(current, Math.max((selectedGroup?.projects.length ?? 1) - 1, 0)))
  }, [projectGroupsForm, selectedProjectGroupIndex])

  useEffect(() => {
    if (!homeQuery.data) return
    setHomeForm({
      ...homeQuery.data,
      stackGroups: homeQuery.data.stackGroups.map((group) => ({
        title: group.title,
        items: formatTextList(group.items),
      })),
    })
  }, [homeQuery.data])

  useEffect(() => {
    setArticleForms(articleQueries.map(mapArticleToForm))
  }, [articleQueries])

  useEffect(() => {
    setSelectedArticleIndex((current) => Math.min(current, Math.max(articleForms.length - 1, 0)))
  }, [articleForms.length])

  useEffect(() => {
    if (!resumeQuery.data) return
    setResumeForm({
      technologies: formatTextList(resumeQuery.data.technologies),
      aboutParagraphs: formatTextList(resumeQuery.data.aboutParagraphs),
      languages: resumeQuery.data.languages.map((language) => ({ ...language })),
      sections: resumeQuery.data.sections.map((section) => ({ ...section })),
      location: resumeQuery.data.location,
      downloadLabel: resumeQuery.data.downloadLabel,
      generatingLabel: resumeQuery.data.generatingLabel,
      pdfFilename: resumeQuery.data.pdfFilename,
      projectTechnologiesLabel: resumeQuery.data.projectTechnologiesLabel,
      education: resumeQuery.data.education.map((item) => ({ ...item })),
      experiences: resumeQuery.data.experiences.map((experience) => ({
        id: experience.id,
        company: experience.company,
        position: experience.position,
        location: experience.location,
        period: experience.period,
        responsibilities: formatTextList(experience.responsibilities),
        roles: (experience.roles ?? []).map((role) => ({ ...role })),
        sortOrder: experience.sortOrder,
      })),
    })
  }, [resumeQuery.data])

  const invalidatePublicData = async () => {
    await queryClient.invalidateQueries()
  }

  const runSave = async (callback: () => Promise<void>, successMessage: string) => {
    setStatus('')
    setIsSaving(true)
    try {
      await callback()
      await invalidatePublicData()
      setStatus(successMessage)
      notifySuccess(successMessage)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erro ao salvar.')
      notifyError('Erro ao salvar no Supabase', error)
    } finally {
      setIsSaving(false)
    }
  }

  const saveTranslation = async (
    table: string,
    filters: Record<string, string | number>,
    translation: Record<string, unknown>,
    activeLocale: Exclude<Locale, 'pt-BR'>,
  ) => {
    let selectQuery = supabase.from(table).select('translations')
    Object.entries(filters).forEach(([key, value]) => {
      selectQuery = selectQuery.eq(key, value)
    })

    const { data, error } = await selectQuery.single()
    if (error) throw error

    const nextTranslations = {
      ...((data as { translations?: Record<string, unknown> } | null)?.translations ?? {}),
      [activeLocale]: translation,
    }

    let updateQuery = supabase.from(table).update({ translations: nextTranslations })
    Object.entries(filters).forEach(([key, value]) => {
      updateQuery = updateQuery.eq(key, value)
    })

    const { error: updateError } = await updateQuery
    if (updateError) throw updateError
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      notifyError('Erro ao sair', error)
      return
    }
    notifySuccess('Sessão encerrada.')
    navigate('/admin/login')
  }

  const saveSiteContent = () =>
    runSave(async () => {
      if (!siteContentForm) throw new Error('Conteúdo do site ainda não carregou.')
      if (locale !== DEFAULT_LOCALE) {
        await saveTranslation('site_content', { id: 'main' }, siteContentForm as unknown as Record<string, unknown>, locale)
        return
      }
      const { error } = await supabase.from('site_content').upsert({ id: 'main', content: siteContentForm })
      if (error) throw error
    }, 'Conteúdo do site salvo.')

  const uploadProjectLogo = async (groupIndex: number, projectIndex: number, file: File) => {
    setStatus('')
    setUploadingLogo(`${groupIndex}-${projectIndex}`)

    try {
      const group = projectGroupsForm[groupIndex]
      const project = group.projects[projectIndex]
      const extension = file.name.split('.').pop() || 'png'
      const path = `projects/${slugify(group.title || 'grupo')}/${slugify(project.title || file.name)}-${Date.now()}.${extension}`
      const { error } = await supabase.storage.from('logos').upload(path, file, {
        cacheControl: '31536000',
        upsert: true,
      })

      if (error) throw error

      const { data } = supabase.storage.from('logos').getPublicUrl(path)
      updateProject(groupIndex, projectIndex, { logo: data.publicUrl }, projectGroupsForm, setProjectGroupsForm)
      setStatus('Logo enviada. Salve os projetos para persistir o caminho.')
      notifySuccess('Logo enviada.', 'Salve os projetos para persistir o caminho.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erro ao enviar logo.')
      notifyError('Erro ao enviar logo', error)
    } finally {
      setUploadingLogo('')
    }
  }

  const uploadProfileAsset = async (file: File, target: 'logoUrl' | 'photoUrl') => {
    setStatus('')
    setUploadingLogo(target)

    try {
      const extension = file.name.split('.').pop() || 'png'
      const path = `site/${target}-${Date.now()}.${extension}`
      const { error } = await supabase.storage.from('logos').upload(path, file, {
        cacheControl: '31536000',
        upsert: true,
      })

      if (error) throw error

      const { data } = supabase.storage.from('logos').getPublicUrl(path)
      setProfileForm((current) => ({ ...current, [target]: data.publicUrl }))
      setStatus('Logo enviada. Salve o perfil para persistir o caminho.')
      notifySuccess('Logo enviada.', 'Salve o perfil para persistir o caminho.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erro ao enviar logo.')
      notifyError('Erro ao enviar logo', error)
    } finally {
      setUploadingLogo('')
    }
  }

  const saveProfile = () =>
    runSave(async () => {
      if (locale !== DEFAULT_LOCALE) {
        await saveTranslation('profile', { id: 'main' }, {
          name: profileForm.name,
          role: profileForm.role,
          intro: profileForm.intro,
          technologies: parseTextList(profileForm.technologies),
          aboutParagraphs: parseTextList(profileForm.aboutParagraphs),
          highlights: profileForm.highlights,
        }, locale)
        return
      }

      const { error } = await supabase.from('profile').upsert({
        id: 'main',
        name: profileForm.name,
        role: profileForm.role,
        intro: profileForm.intro,
        contact_url: profileForm.contactUrl,
        logo_url: profileForm.logoUrl,
        photo_url: profileForm.photoUrl,
        social_links: profileForm.socialLinks,
        technologies: parseTextList(profileForm.technologies),
        about_paragraphs: parseTextList(profileForm.aboutParagraphs),
        highlights: profileForm.highlights,
      })

      if (error) throw error
    }, 'Perfil salvo.')

  const saveHome = () =>
    runSave(async () => {
      const homeTranslation = {
        heroEyebrow: homeForm.heroEyebrow,
        heroHeadline: homeForm.heroHeadline,
        heroDescription: homeForm.heroDescription,
        projectsButtonLabel: homeForm.projectsButtonLabel,
        resumeButtonLabel: homeForm.resumeButtonLabel,
        contactButtonLabel: homeForm.contactButtonLabel,
        stackTitle: homeForm.stackTitle,
        stackGroups: homeForm.stackGroups.map((group) => ({
          title: group.title,
          items: parseTextList(group.items),
        })),
        classicAboutTitle: homeForm.classicAboutTitle,
        classicHighlightsTitle: homeForm.classicHighlightsTitle,
        classicCapabilitiesTitle: homeForm.classicCapabilitiesTitle,
        languageNote: homeForm.languageNote,
        auroraAboutEyebrow: homeForm.auroraAboutEyebrow,
        auroraAboutTitle: homeForm.auroraAboutTitle,
        projectsEyebrow: homeForm.projectsEyebrow,
        projectsTitle: homeForm.projectsTitle,
        projectsLinkLabel: homeForm.projectsLinkLabel,
        projectsTotalLabel: homeForm.projectsTotalLabel,
        blogEyebrow: homeForm.blogEyebrow,
        blogTitle: homeForm.blogTitle,
        contactTitle: homeForm.contactTitle,
        contactDescription: homeForm.contactDescription,
      }

      if (locale !== DEFAULT_LOCALE) {
        await saveTranslation('home_content', { id: 'main' }, homeTranslation, locale)
        return
      }

      const { error } = await supabase.from('home_content').upsert({
        id: 'main',
        hero_eyebrow: homeForm.heroEyebrow,
        hero_headline: homeForm.heroHeadline,
        hero_description: homeForm.heroDescription,
        projects_button_label: homeForm.projectsButtonLabel,
        resume_button_label: homeForm.resumeButtonLabel,
        contact_button_label: homeForm.contactButtonLabel,
        stack_title: homeForm.stackTitle,
        stack_groups: homeForm.stackGroups.map((group) => ({
          title: group.title,
          items: parseTextList(group.items),
        })),
        classic_about_title: homeForm.classicAboutTitle,
        classic_highlights_title: homeForm.classicHighlightsTitle,
        classic_capabilities_title: homeForm.classicCapabilitiesTitle,
        language_note: homeForm.languageNote,
        aurora_about_eyebrow: homeForm.auroraAboutEyebrow,
        aurora_about_title: homeForm.auroraAboutTitle,
        projects_eyebrow: homeForm.projectsEyebrow,
        projects_title: homeForm.projectsTitle,
        projects_link_label: homeForm.projectsLinkLabel,
        projects_total_label: homeForm.projectsTotalLabel,
        blog_eyebrow: homeForm.blogEyebrow,
        blog_title: homeForm.blogTitle,
        contact_title: homeForm.contactTitle,
        contact_description: homeForm.contactDescription,
      })

      if (error) throw error
    }, 'Home salva.')

  const saveProjects = () =>
    runSave(async () => {
      const groups = projectGroupsForm.map((group, index) => ({
        id: group.id || slugify(group.title),
        title: group.title,
        sort_order: index,
      }))
      const projects = projectGroupsForm.flatMap((group, groupIndex) =>
        group.projects.map((project, projectIndex) => ({
          id: project.id || `${groups[groupIndex].id}-${projectIndex + 1}-${slugify(project.title)}`,
          group_id: groups[groupIndex].id,
          title: project.title,
          description: project.description,
          logo: project.logo,
          tags: parseTextList(project.tags),
          project_url: null,
          site_url: project.siteUrl || null,
          url: project.siteUrl || null,
          architecture: project.architecture,
          details: project.details,
          sort_order: projectIndex,
        })),
      )

      if (locale !== DEFAULT_LOCALE) {
        for (const group of projectGroupsForm) {
          await saveTranslation('project_groups', { id: group.id }, { title: group.title }, locale)
          for (const project of group.projects) {
            await saveTranslation('projects', { id: project.id }, {
              title: project.title,
              description: project.description,
              tags: parseTextList(project.tags),
              architecture: project.architecture,
              details: project.details,
            }, locale)
          }
        }
        return
      }

      const { error: deleteProjectsError } = await supabase.from('projects').delete().neq('id', '')
      if (deleteProjectsError) throw deleteProjectsError
      const { error: deleteGroupsError } = await supabase.from('project_groups').delete().neq('id', '')
      if (deleteGroupsError) throw deleteGroupsError

      if (groups.length) {
        const { error } = await supabase.from('project_groups').insert(groups)
        if (error) throw error
      }
      if (projects.length) {
        const { error } = await supabase.from('projects').insert(projects)
        if (error) throw error
      }
    }, 'Projetos salvos.')

  const saveArticles = () =>
    runSave(async () => {
      const articles = articleForms.map((article, index) => ({
        slug: article.slug || slugify(article.title),
        title: article.title,
        category: article.category,
        description: article.description,
        date: article.date,
        read_time: article.readTime,
        content: article.content,
        kind: article.kind,
        sort_order: index,
      }))

      if (locale !== DEFAULT_LOCALE) {
        for (const article of articleForms) {
          await saveTranslation('articles', { slug: article.slug }, {
            title: article.title,
            category: article.category,
            description: article.description,
            date: article.date,
            readTime: article.readTime,
            content: article.content,
          }, locale)
        }
        return
      }

      const { error: deleteError } = await supabase.from('articles').delete().neq('slug', '')
      if (deleteError) throw deleteError
      if (articles.length) {
        const { error } = await supabase.from('articles').insert(articles)
        if (error) throw error
      }
    }, 'Artigos salvos.')

  const saveResume = () =>
    runSave(async () => {
      const experiences = resumeForm.experiences.map((experience, index) => ({
        id: experience.id || `${index + 1}-${slugify(experience.company)}-${slugify(experience.position)}`,
        company: experience.company,
        position: experience.position,
        location: experience.location,
        period: experience.period,
        responsibilities: parseTextList(experience.responsibilities),
        sort_order: index,
      }))
      const roles = resumeForm.experiences.flatMap((experience, experienceIndex) =>
        experience.roles.map((role, roleIndex) => {
          return {
            id: `${experiences[experienceIndex].id}-${roleIndex + 1}-${slugify(role.position)}`,
            experience_id: experiences[experienceIndex].id,
            position: role.position.trim(),
            period: role.period.trim(),
            sort_order: roleIndex,
          }
        }),
      )
      const education = resumeForm.education.map((item, index) => ({
        id: item.id || `${index + 1}-${slugify(item.institution)}-${slugify(item.course)}`,
        institution: item.institution,
        course: item.course,
        location: item.location,
        period: item.period,
        sort_order: index,
      }))
      const technologies = parseTextList(resumeForm.technologies).map((name, index) => ({
        name,
        sort_order: index,
      }))
      const languages = resumeForm.languages.map((language) => ({
        name: language.name.trim(),
        description: language.description.trim(),
      }))
      const sections = resumeForm.sections.map((section) => ({ ...section }))

      if (locale !== DEFAULT_LOCALE) {
        await saveTranslation('resume_settings', { id: 'main' }, {
          technologies: parseTextList(resumeForm.technologies),
          aboutParagraphs: parseTextList(resumeForm.aboutParagraphs),
          languages,
          sections,
          location: resumeForm.location,
          downloadLabel: resumeForm.downloadLabel,
          generatingLabel: resumeForm.generatingLabel,
          pdfFilename: resumeForm.pdfFilename,
          projectTechnologiesLabel: resumeForm.projectTechnologiesLabel,
        }, locale)

        for (const experience of experiences) {
          await saveTranslation('resume_experiences', { id: experience.id }, {
            company: experience.company,
            position: experience.position,
            location: experience.location,
            period: experience.period,
            responsibilities: experience.responsibilities,
          }, locale)
        }

        for (const educationItem of education) {
          await saveTranslation('resume_education', { id: educationItem.id }, {
            institution: educationItem.institution,
            course: educationItem.course,
            location: educationItem.location,
            period: educationItem.period,
          }, locale)
        }

        for (const role of roles) {
          await saveTranslation('resume_roles', { experience_id: role.experience_id, sort_order: role.sort_order }, {
            position: role.position,
            period: role.period,
          }, locale)
        }
        return
      }

      const deleteSteps = [
        supabase.from('resume_roles').delete().neq('id', ''),
        supabase.from('resume_experiences').delete().neq('id', ''),
        supabase.from('resume_education').delete().neq('id', ''),
        supabase.from('resume_technologies').delete().neq('name', ''),
      ]
      for (const step of deleteSteps) {
        const { error } = await step
        if (error) throw error
      }

      if (experiences.length) {
        const { error } = await supabase.from('resume_experiences').insert(experiences)
        if (error) throw error
      }
      if (roles.length) {
        const { error } = await supabase.from('resume_roles').insert(roles)
        if (error) throw error
      }
      if (education.length) {
        const { error } = await supabase.from('resume_education').insert(education)
        if (error) throw error
      }
      if (technologies.length) {
        const { error } = await supabase.from('resume_technologies').insert(technologies)
        if (error) throw error
      }
      const { error: settingsError } = await supabase.from('resume_settings').upsert({
        id: 'main',
        about_paragraphs: parseTextList(resumeForm.aboutParagraphs),
        languages,
        sections,
        location: resumeForm.location,
        download_label: resumeForm.downloadLabel,
        generating_label: resumeForm.generatingLabel,
        pdf_filename: resumeForm.pdfFilename,
        project_technologies_label: resumeForm.projectTechnologiesLabel,
      })
      if (settingsError) throw settingsError
    }, 'Currículo salvo.')

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-6xl space-y-7">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Link to="/classic" className="mb-3 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Voltar ao site
            </Link>
            <h1 className="text-4xl font-bold">Painel</h1>
          </div>
          <AdminActions className="sm:justify-end">
            {status && <Badge variant={status.includes('Erro') || status.includes('policy') ? 'destructive' : 'secondary'}>{status}</Badge>}
            <LanguageSelect />
            <ThemeToggle theme={theme} onToggle={toggleTheme} variant="outline" size="lg" />
            <Button type="button" variant="outline" className="min-w-20" onClick={handleLogout}>
              Sair
            </Button>
          </AdminActions>
        </header>

        <nav className="grid gap-2 border-b border-border pb-4 sm:flex sm:flex-wrap sm:items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`h-10 w-full rounded-xl px-4 text-sm font-medium transition sm:w-auto ${
                activeTab === tab.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {isLoading ? (
          <div className="rounded-xl border border-border p-8 text-muted-foreground">Carregando dados...</div>
        ) : (
          <>
            {activeTab === 'profile' && (
              <AdminSection title="Perfil" description="Dados principais usados no topo do site, navegação social, apresentação pessoal e destaques da Home tradicional.">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Nome" value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} />
                  <Input label="Cargo" value={profileForm.role} onChange={(event) => setProfileForm({ ...profileForm, role: event.target.value })} />
                  <Input label="Contato" value={profileForm.contactUrl} onChange={(event) => setProfileForm({ ...profileForm, contactUrl: event.target.value })} />
                  <Input label="Intro" value={profileForm.intro} onChange={(event) => setProfileForm({ ...profileForm, intro: event.target.value })} />
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 md:items-end">
                  <Input label="Logo do site" value={profileForm.logoUrl} onChange={(event) => setProfileForm({ ...profileForm, logoUrl: event.target.value })} />
                  <FileUploadButton
                    label={uploadingLogo === 'logoUrl' ? 'Enviando...' : 'Enviar'}
                    disabled={uploadingLogo === 'logoUrl'}
                    onFile={(file) => void uploadProfileAsset(file, 'logoUrl')}
                  />
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 md:items-end">
                  <Input label="Foto do currículo" value={profileForm.photoUrl} onChange={(event) => setProfileForm({ ...profileForm, photoUrl: event.target.value })} />
                  <FileUploadButton
                    label={uploadingLogo === 'photoUrl' ? 'Enviando...' : 'Enviar'}
                    disabled={uploadingLogo === 'photoUrl'}
                    onFile={(file) => void uploadProfileAsset(file, 'photoUrl')}
                  />
                </div>
                <div>
                  <AdminInlineSection title="Redes sociais" description="Aparecem no topo, rodapé ou navegação social do site.">
                    <div className="space-y-4">
                      {profileForm.socialLinks.map((social, index) => (
                        <div key={`${social.name}-${index}`} className="grid gap-3 border-b border-border/60 pb-4 last:border-b-0 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
                          <Input label="Nome" value={social.name} onChange={(event) => setProfileForm({ ...profileForm, socialLinks: profileForm.socialLinks.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)) })} />
                          <Input label="URL" value={social.href} onChange={(event) => setProfileForm({ ...profileForm, socialLinks: profileForm.socialLinks.map((item, itemIndex) => (itemIndex === index ? { ...item, href: event.target.value } : item)) })} />
                          <Input label="Ícone" value={social.icon} onChange={(event) => setProfileForm({ ...profileForm, socialLinks: profileForm.socialLinks.map((item, itemIndex) => (itemIndex === index ? { ...item, icon: event.target.value } : item)) })} />
                          <RemoveIconButton label="Remover rede" onClick={() => setProfileForm({ ...profileForm, socialLinks: profileForm.socialLinks.filter((_, itemIndex) => itemIndex !== index) })} />
                        </div>
                      ))}
                    </div>
                    <AdminActions className="mt-3">
                      <Button type="button" variant="outline" onClick={() => setProfileForm({ ...profileForm, socialLinks: [...profileForm.socialLinks, { name: '', href: '', icon: 'link' }] })}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Adicionar rede
                      </Button>
                    </AdminActions>
                  </AdminInlineSection>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Textarea label="Tecnologias, uma por linha" value={profileForm.technologies} onChange={(value) => setProfileForm({ ...profileForm, technologies: value })} rows={8} />
                  <Textarea label="Sobre, um parágrafo por linha" value={profileForm.aboutParagraphs} onChange={(value) => setProfileForm({ ...profileForm, aboutParagraphs: value })} rows={8} />
                </div>
                <div>
                  <AdminInlineSection title="Destaques" description="Aparecem na Home tradicional como cards de diferenciais.">
                    <div className="space-y-4">
                      {profileForm.highlights.map((highlight, index) => (
                        <div key={`${highlight.title}-${index}`} className="grid gap-3 border-b border-border/60 pb-4 last:border-b-0 md:grid-cols-[1fr_1fr_auto] md:items-end">
                          <Input label="Ícone" value={highlight.icon} onChange={(event) => setProfileForm({ ...profileForm, highlights: profileForm.highlights.map((item, itemIndex) => (itemIndex === index ? { ...item, icon: event.target.value } : item)) })} />
                          <Input label="Título" value={highlight.title} onChange={(event) => setProfileForm({ ...profileForm, highlights: profileForm.highlights.map((item, itemIndex) => (itemIndex === index ? { ...item, title: event.target.value } : item)) })} />
                          <RemoveIconButton label="Remover destaque" onClick={() => setProfileForm({ ...profileForm, highlights: profileForm.highlights.filter((_, itemIndex) => itemIndex !== index) })} />
                          <div className="md:col-span-2">
                            <Textarea label="Descrição" value={highlight.description} onChange={(description) => setProfileForm({ ...profileForm, highlights: profileForm.highlights.map((item, itemIndex) => (itemIndex === index ? { ...item, description } : item)) })} rows={3} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <AdminActions className="mt-3">
                      <Button type="button" variant="outline" onClick={() => setProfileForm({ ...profileForm, highlights: [...profileForm.highlights, { icon: 'sparkles', title: '', description: '' }] })}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Adicionar destaque
                      </Button>
                    </AdminActions>
                  </AdminInlineSection>
                </div>
                <AdminActions>
                  <Button type="button" className="min-w-36" loading={isSaving} onClick={saveProfile}>
                    Salvar perfil
                  </Button>
                </AdminActions>
              </AdminSection>
            )}

            {activeTab === 'home' && (
              <AdminSection title="Home" description="Textos e blocos que aparecem na página inicial dos modos tradicional e Aurora.">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Chamada superior" value={homeForm.heroEyebrow} onChange={(event) => setHomeForm({ ...homeForm, heroEyebrow: event.target.value })} />
                  <Input label="Título de impacto" value={homeForm.heroHeadline} onChange={(event) => setHomeForm({ ...homeForm, heroHeadline: event.target.value })} />
                </div>
                <div>
                  <Textarea label="Apresentação principal" value={homeForm.heroDescription} onChange={(value) => setHomeForm({ ...homeForm, heroDescription: value })} rows={4} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Input label="Botão de projetos" value={homeForm.projectsButtonLabel} onChange={(event) => setHomeForm({ ...homeForm, projectsButtonLabel: event.target.value })} />
                  <Input label="Botão de currículo" value={homeForm.resumeButtonLabel} onChange={(event) => setHomeForm({ ...homeForm, resumeButtonLabel: event.target.value })} />
                  <Input label="Botão de contato" value={homeForm.contactButtonLabel} onChange={(event) => setHomeForm({ ...homeForm, contactButtonLabel: event.target.value })} />
                </div>
                <div>
                  <AdminInlineSection title="Grupos da stack" description="Aparecem na Home como blocos de capacidades e tecnologias.">
                    <div className="mb-4">
                      <Input label="Aurora: título acima das skills" value={homeForm.stackTitle} onChange={(event) => setHomeForm({ ...homeForm, stackTitle: event.target.value })} />
                    </div>
                    <div className="space-y-4">
                      {homeForm.stackGroups.map((group, index) => (
                        <div key={`${group.title}-${index}`} className="grid gap-3 border-b border-border/60 pb-4 last:border-b-0 md:grid-cols-[1fr_auto] md:items-end">
                          <Input label="Título do grupo" value={group.title} onChange={(event) => setHomeForm({ ...homeForm, stackGroups: homeForm.stackGroups.map((item, itemIndex) => (itemIndex === index ? { ...item, title: event.target.value } : item)) })} />
                          <RemoveIconButton label="Remover grupo" onClick={() => setHomeForm({ ...homeForm, stackGroups: homeForm.stackGroups.filter((_, itemIndex) => itemIndex !== index) })} />
                          <div className="md:col-span-2">
                            <Textarea label="Itens, um por linha" value={group.items} onChange={(items) => setHomeForm({ ...homeForm, stackGroups: homeForm.stackGroups.map((item, itemIndex) => (itemIndex === index ? { ...item, items } : item)) })} rows={5} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <AdminActions className="mt-3">
                      <Button type="button" variant="outline" onClick={() => setHomeForm({ ...homeForm, stackGroups: [...homeForm.stackGroups, { title: '', items: '' }] })}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Adicionar grupo
                      </Button>
                    </AdminActions>
                  </AdminInlineSection>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Tradicional: título sobre" value={homeForm.classicAboutTitle} onChange={(event) => setHomeForm({ ...homeForm, classicAboutTitle: event.target.value })} />
                  <Input label="Tradicional: título diferenciais" value={homeForm.classicHighlightsTitle} onChange={(event) => setHomeForm({ ...homeForm, classicHighlightsTitle: event.target.value })} />
                  <Input label="Tradicional: título capacidades" value={homeForm.classicCapabilitiesTitle} onChange={(event) => setHomeForm({ ...homeForm, classicCapabilitiesTitle: event.target.value })} />
                  <Input label="Observação de idioma" value={homeForm.languageNote} onChange={(event) => setHomeForm({ ...homeForm, languageNote: event.target.value })} />
                  <Input label="Aurora: chamada sobre" value={homeForm.auroraAboutEyebrow} onChange={(event) => setHomeForm({ ...homeForm, auroraAboutEyebrow: event.target.value })} />
                  <Input label="Aurora: título sobre" value={homeForm.auroraAboutTitle} onChange={(event) => setHomeForm({ ...homeForm, auroraAboutTitle: event.target.value })} />
                  <Input label="Chamada de projetos" value={homeForm.projectsEyebrow} onChange={(event) => setHomeForm({ ...homeForm, projectsEyebrow: event.target.value })} />
                  <Input label="Título de projetos" value={homeForm.projectsTitle} onChange={(event) => setHomeForm({ ...homeForm, projectsTitle: event.target.value })} />
                  <Input label="Link de projetos" value={homeForm.projectsLinkLabel} onChange={(event) => setHomeForm({ ...homeForm, projectsLinkLabel: event.target.value })} />
                  <Input label="Legenda do total de projetos" value={homeForm.projectsTotalLabel} onChange={(event) => setHomeForm({ ...homeForm, projectsTotalLabel: event.target.value })} />
                  <Input label="Chamada do blog" value={homeForm.blogEyebrow} onChange={(event) => setHomeForm({ ...homeForm, blogEyebrow: event.target.value })} />
                  <Input label="Título do blog" value={homeForm.blogTitle} onChange={(event) => setHomeForm({ ...homeForm, blogTitle: event.target.value })} />
                  <Input label="Título do contato" value={homeForm.contactTitle} onChange={(event) => setHomeForm({ ...homeForm, contactTitle: event.target.value })} />
                </div>
                <div>
                  <Textarea label="Descrição do contato" value={homeForm.contactDescription} onChange={(value) => setHomeForm({ ...homeForm, contactDescription: value })} rows={3} />
                </div>
                <AdminActions>
                  <Button type="button" className="min-w-36" loading={isSaving} onClick={saveHome}>
                    Salvar home
                  </Button>
                </AdminActions>
              </AdminSection>
            )}

            {activeTab === 'projects' && (
              <AdminSection title="Projetos" description="Empresas, cards, links e detalhes técnicos exibidos nas páginas de projetos dos dois modos.">
                <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
                  <aside className="space-y-4 rounded-xl border border-border p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-semibold text-foreground">Selecione</h3>
                    </div>
                    <div className="space-y-3">
                      {projectGroupsForm.map((group, groupIndex) => (
                        <div key={`${group.id}-${groupIndex}`} className="space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProjectGroupIndex(groupIndex)
                              setSelectedProjectIndex(0)
                            }}
                            className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${selectedProjectGroupIndex === groupIndex ? 'bg-foreground text-background' : 'bg-muted/50 text-foreground hover:bg-muted'}`}
                          >
                            {group.title || `Grupo ${groupIndex + 1}`}
                          </button>
                          {selectedProjectGroupIndex === groupIndex && (
                            <div className="space-y-1 pl-2">
                              {group.projects.map((project, projectIndex) => (
                                <button
                                  key={`${project.id}-${projectIndex}`}
                                  type="button"
                                  onClick={() => setSelectedProjectIndex(projectIndex)}
                                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${selectedProjectIndex === projectIndex ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                                >
                                  {project.title || `Projeto ${projectIndex + 1}`}
                                </button>
                              ))}
                              <Button type="button" variant="outline" className="mt-2 w-full" onClick={() => addProject(groupIndex, projectGroupsForm, setProjectGroupsForm)}>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Projeto
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </aside>

                  {projectGroupsForm[selectedProjectGroupIndex] ? (
                    <div className="space-y-5">
                      <div className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-[1fr_auto] md:items-end">
                        <div className="min-w-0">
                          <Input
                            label="Empresa/grupo selecionado"
                            value={projectGroupsForm[selectedProjectGroupIndex].title}
                            onChange={(event) => updateProjectGroup(selectedProjectGroupIndex, { title: event.target.value }, projectGroupsForm, setProjectGroupsForm)}
                          />
                        </div>
                        <RemoveIconButton label="Remover grupo" onClick={() => setProjectGroupsForm(projectGroupsForm.filter((_, index) => index !== selectedProjectGroupIndex))} />
                      </div>

                      {projectGroupsForm[selectedProjectGroupIndex].projects[selectedProjectIndex] ? (
                        <div className="grid gap-5 rounded-xl bg-muted/40 p-4 md:grid-cols-2">
                          {(() => {
                            const groupIndex = selectedProjectGroupIndex
                            const projectIndex = selectedProjectIndex
                            const project = projectGroupsForm[groupIndex].projects[projectIndex]
                            return (
                              <>
                                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                                  <Input label="Projeto selecionado" value={project.title} onChange={(event) => updateProject(groupIndex, projectIndex, { title: event.target.value }, projectGroupsForm, setProjectGroupsForm)} />
                                  <RemoveIconButton label="Remover projeto" onClick={() => removeProject(groupIndex, projectIndex, projectGroupsForm, setProjectGroupsForm)} />
                                </div>
                                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 md:items-end">
                                  <Input label="Logo" value={project.logo} onChange={(event) => updateProject(groupIndex, projectIndex, { logo: event.target.value }, projectGroupsForm, setProjectGroupsForm)} />
                                  <FileUploadButton
                                    label={uploadingLogo === `${groupIndex}-${projectIndex}` ? 'Enviando logo...' : 'Enviar nova logo'}
                                    disabled={uploadingLogo === `${groupIndex}-${projectIndex}`}
                                    onFile={(file) => void uploadProjectLogo(groupIndex, projectIndex, file)}
                                  />
                                </div>
                                <div className="rounded-xl border border-border/70 p-4 text-sm leading-6 text-muted-foreground">
                                  <p className="font-semibold text-foreground">Botão Ver projeto</p>
                                  <p>Abre a página interna quando houver detalhes ou arquitetura preenchidos.</p>
                                </div>
                                <Input label="Link do botão Ver site" value={project.siteUrl} onChange={(event) => updateProject(groupIndex, projectIndex, { siteUrl: event.target.value }, projectGroupsForm, setProjectGroupsForm)} />
                                <div className="md:col-span-2">
                                  <Textarea label="Tags, uma por linha" value={project.tags} onChange={(value) => updateProject(groupIndex, projectIndex, { tags: value }, projectGroupsForm, setProjectGroupsForm)} rows={4} />
                                </div>
                                <div className="md:col-span-2">
                                  <Textarea label="Descrição" value={project.description} onChange={(value) => updateProject(groupIndex, projectIndex, { description: value }, projectGroupsForm, setProjectGroupsForm)} rows={3} />
                                </div>
                                <div className="md:col-span-2">
                                  <ProjectDetailsEditor value={project.details} onChange={(details) => updateProject(groupIndex, projectIndex, { details }, projectGroupsForm, setProjectGroupsForm)} />
                                </div>
                                <div className="md:col-span-2">
                                  <ProjectArchitectureEditor value={project.architecture} onChange={(architecture) => updateProject(groupIndex, projectIndex, { architecture }, projectGroupsForm, setProjectGroupsForm)} />
                                </div>
                              </>
                            )
                          })()}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-border p-6 text-sm text-muted-foreground">Selecione ou adicione um projeto neste grupo.</div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border p-6 text-sm text-muted-foreground">Adicione um grupo para começar.</div>
                  )}
                </div>
                <AdminActions>
                  <Button type="button" className="min-w-36" loading={isSaving} onClick={saveProjects}>
                    Salvar projetos
                  </Button>
                </AdminActions>
              </AdminSection>
            )}

            {activeTab === 'content' && (
              <AdminSection title="Conteúdo público do site" description="Textos globais, navegação, mensagens de erro, labels e conteúdo do Playground usado no tradicional e no Aurora.">
                {siteContentForm ? (
                  <SiteContentEditor value={siteContentForm} onChange={setSiteContentForm} />
                ) : (
                  <div className="rounded-xl border border-border p-6 text-sm text-muted-foreground">Conteúdo do site ainda não carregou.</div>
                )}
                <AdminActions>
                  <Button type="button" className="min-w-40" loading={isSaving} onClick={saveSiteContent}>
                    Salvar conteúdo
                  </Button>
                </AdminActions>
              </AdminSection>
            )}

            {activeTab === 'articles' && (
              <AdminSection title="Artigos" description="Posts profissionais e pessoais exibidos no Blog. Use o tipo para controlar em qual grupo o artigo aparece.">
                <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
                  <aside className="space-y-3 rounded-xl border border-border p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-semibold text-foreground">Selecione</h3>
                    </div>
                    <div className="space-y-1">
                      {articleForms.map((article, index) => (
                        <button
                          key={`${article.slug}-${index}`}
                          type="button"
                          onClick={() => setSelectedArticleIndex(index)}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${selectedArticleIndex === index ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        >
                          <span className="block font-semibold">{article.title || `Artigo ${index + 1}`}</span>
                          <span className="text-xs opacity-75">{article.kind === 'work' ? 'Profissional' : 'Pessoal'}</span>
                        </button>
                      ))}
                    </div>
                  </aside>

                  {articleForms[selectedArticleIndex] ? (
                    <div className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-2">
                      {(() => {
                        const index = selectedArticleIndex
                        const article = articleForms[index]
                        return (
                          <>
                            <div className="grid gap-3 md:col-span-2 md:grid-cols-[1fr_auto] md:items-end">
                              <Input label="Título" value={article.title} onChange={(event) => updateArticle(index, { title: event.target.value }, articleForms, setArticleForms)} />
                              <RemoveIconButton label="Remover artigo" onClick={() => setArticleForms(articleForms.filter((_, itemIndex) => itemIndex !== index))} />
                            </div>
                            <Input label="Slug" value={article.slug} onChange={(event) => updateArticle(index, { slug: event.target.value }, articleForms, setArticleForms)} />
                            <label className="space-y-2">
                              <span className="text-sm font-medium text-foreground">Tipo</span>
                              <select
                                value={article.kind}
                                onChange={(event) => updateArticle(index, { kind: event.target.value as ArticleKind }, articleForms, setArticleForms)}
                                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
                              >
                                <option value="work">Profissional</option>
                                <option value="personal">Pessoal</option>
                              </select>
                            </label>
                            <Input label="Categoria" value={article.category} onChange={(event) => updateArticle(index, { category: event.target.value }, articleForms, setArticleForms)} />
                            <Input label="Data" value={article.date} onChange={(event) => updateArticle(index, { date: event.target.value }, articleForms, setArticleForms)} />
                            <Input label="Tempo de leitura" value={article.readTime} onChange={(event) => updateArticle(index, { readTime: event.target.value }, articleForms, setArticleForms)} />
                            <div className="md:col-span-2">
                              <Textarea label="Descrição" value={article.description} onChange={(value) => updateArticle(index, { description: value }, articleForms, setArticleForms)} rows={3} />
                            </div>
                            <div className="md:col-span-2">
                              <Textarea label="Conteúdo Markdown" value={article.content} onChange={(value) => updateArticle(index, { content: value }, articleForms, setArticleForms)} rows={12} />
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border p-6 text-sm text-muted-foreground">Selecione ou adicione um artigo.</div>
                  )}
                </div>
                <AdminActions>
                  <Button type="button" className="min-w-36" loading={isSaving} onClick={saveArticles}>
                    Salvar artigos
                  </Button>
                </AdminActions>
              </AdminSection>
            )}

            {activeTab === 'resume' && (
              <AdminSection title="Currículo" description="Conteúdo usado na página de currículo e no PDF gerado pelo painel.">
                <div className="grid gap-4 md:grid-cols-2">
                  <Textarea label="Sobre do currículo, um parágrafo por linha" value={resumeForm.aboutParagraphs} onChange={(value) => setResumeForm({ ...resumeForm, aboutParagraphs: value })} rows={6} />
                  <Textarea label="Habilidades técnicas, uma por linha" value={resumeForm.technologies} onChange={(value) => setResumeForm({ ...resumeForm, technologies: value })} rows={8} />
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <AdminInlineSection title="Idiomas" description="Aparecem na seção de idiomas do currículo e no PDF.">
                    <div className="space-y-4">
                      {resumeForm.languages.map((language, index) => (
                        <div key={`${language.name}-${index}`} className="grid gap-3 border-b border-border/60 pb-4 last:border-b-0 md:grid-cols-[1fr_1fr_auto] md:items-end">
                          <Input label="Idioma" value={language.name} onChange={(event) => setResumeForm({ ...resumeForm, languages: resumeForm.languages.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)) })} />
                          <Input label="Descrição" value={language.description} onChange={(event) => setResumeForm({ ...resumeForm, languages: resumeForm.languages.map((item, itemIndex) => (itemIndex === index ? { ...item, description: event.target.value } : item)) })} />
                          <RemoveIconButton label="Remover idioma" onClick={() => setResumeForm({ ...resumeForm, languages: resumeForm.languages.filter((_, itemIndex) => itemIndex !== index) })} />
                        </div>
                      ))}
                    </div>
                    <AdminActions className="mt-3">
                      <Button type="button" variant="outline" onClick={() => setResumeForm({ ...resumeForm, languages: [...resumeForm.languages, { name: '', description: '' }] })}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Adicionar idioma
                      </Button>
                    </AdminActions>
                  </AdminInlineSection>

                  <AdminInlineSection title="Seções do currículo" description="Controla ordem, título e visibilidade das seções no currículo.">
                    <div className="space-y-4">
                      {resumeForm.sections.map((section, index) => (
                        <div key={`${section.key}-${index}`} className="grid gap-3 border-b border-border/60 pb-4 last:border-b-0 md:grid-cols-[1fr_1fr_auto]">
                          <Input label="Chave técnica" value={section.key} onChange={(event) => setResumeForm({ ...resumeForm, sections: resumeForm.sections.map((item, itemIndex) => (itemIndex === index ? { ...item, key: event.target.value as ResumeSectionKey } : item)) })} />
                          <Input label="Título exibido" value={section.title} onChange={(event) => setResumeForm({ ...resumeForm, sections: resumeForm.sections.map((item, itemIndex) => (itemIndex === index ? { ...item, title: event.target.value } : item)) })} />
                          <label className="flex items-center gap-2 self-end rounded-xl border border-border px-3 py-2 text-sm">
                            <input
                              type="checkbox"
                              checked={section.enabled}
                              onChange={(event) => setResumeForm({ ...resumeForm, sections: resumeForm.sections.map((item, itemIndex) => (itemIndex === index ? { ...item, enabled: event.target.checked } : item)) })}
                            />
                            Visível
                          </label>
                        </div>
                      ))}
                    </div>
                  </AdminInlineSection>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Localização no PDF" value={resumeForm.location} onChange={(event) => setResumeForm({ ...resumeForm, location: event.target.value })} />
                  <Input label="Nome do arquivo PDF" value={resumeForm.pdfFilename} onChange={(event) => setResumeForm({ ...resumeForm, pdfFilename: event.target.value })} />
                  <Input label="Texto do botão de download" value={resumeForm.downloadLabel} onChange={(event) => setResumeForm({ ...resumeForm, downloadLabel: event.target.value })} />
                  <Input label="Texto durante geração" value={resumeForm.generatingLabel} onChange={(event) => setResumeForm({ ...resumeForm, generatingLabel: event.target.value })} />
                  <Input label="Rótulo de tecnologias dos projetos" value={resumeForm.projectTechnologiesLabel} onChange={(event) => setResumeForm({ ...resumeForm, projectTechnologiesLabel: event.target.value })} />
                </div>
                <h2 className="mt-8 text-2xl font-bold">Educação</h2>
                <div className="mt-4 space-y-4">
                  {resumeForm.education.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                      <Input label="Instituição" value={item.institution} onChange={(event) => updateEducation(index, { institution: event.target.value }, resumeForm, setResumeForm)} />
                      <Input label="Curso" value={item.course} onChange={(event) => updateEducation(index, { course: event.target.value }, resumeForm, setResumeForm)} />
                      <RemoveIconButton label="Remover educação" onClick={() => setResumeForm({ ...resumeForm, education: resumeForm.education.filter((_, itemIndex) => itemIndex !== index) })} />
                      <Input label="Local" value={item.location} onChange={(event) => updateEducation(index, { location: event.target.value }, resumeForm, setResumeForm)} />
                      <Input label="Período" value={item.period} onChange={(event) => updateEducation(index, { period: event.target.value }, resumeForm, setResumeForm)} />
                    </div>
                  ))}
                </div>
                <AdminActions className="mt-4">
                  <Button type="button" variant="outline" className="min-w-44" onClick={() => setResumeForm({ ...resumeForm, education: [...resumeForm.education, createEducationForm(resumeForm.education.length)] })}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Adicionar educação
                  </Button>
                </AdminActions>

                <h2 className="mt-8 text-2xl font-bold">Experiências</h2>
                <div className="mt-4 space-y-4">
                  {resumeForm.experiences.map((experience, index) => (
                    <div key={`${experience.id}-${index}`} className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                      <Input label="Empresa" value={experience.company} onChange={(event) => updateExperience(index, { company: event.target.value }, resumeForm, setResumeForm)} />
                      <Input label="Cargo principal" value={experience.position} onChange={(event) => updateExperience(index, { position: event.target.value }, resumeForm, setResumeForm)} />
                      <RemoveIconButton label="Remover experiência" onClick={() => setResumeForm({ ...resumeForm, experiences: resumeForm.experiences.filter((_, itemIndex) => itemIndex !== index) })} />
                      <Input label="Local" value={experience.location} onChange={(event) => updateExperience(index, { location: event.target.value }, resumeForm, setResumeForm)} />
                      <Input label="Período" value={experience.period} onChange={(event) => updateExperience(index, { period: event.target.value }, resumeForm, setResumeForm)} />
                      <section className="space-y-3 md:col-span-3">
                        <div>
                          <h3 className="text-base font-semibold text-foreground">Timeline de cargos</h3>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">Aparece dentro desta experiência, em ordem.</p>
                        </div>
                        <div className="space-y-4">
                          {experience.roles.map((role, roleIndex) => (
                            <div key={`${role.position}-${roleIndex}`} className="grid gap-3 border-b border-border/60 pb-4 last:border-b-0 md:grid-cols-[1fr_1fr_auto] md:items-end">
                              <Input
                                label="Cargo"
                                value={role.position}
                                onChange={(event) =>
                                  updateExperience(
                                    index,
                                    { roles: experience.roles.map((item, itemIndex) => (itemIndex === roleIndex ? { ...item, position: event.target.value } : item)) },
                                    resumeForm,
                                    setResumeForm,
                                  )
                                }
                              />
                              <Input
                                label="Período"
                                value={role.period}
                                onChange={(event) =>
                                  updateExperience(
                                    index,
                                    { roles: experience.roles.map((item, itemIndex) => (itemIndex === roleIndex ? { ...item, period: event.target.value } : item)) },
                                    resumeForm,
                                    setResumeForm,
                                  )
                                }
                              />
                              <RemoveIconButton label="Remover cargo" onClick={() => updateExperience(index, { roles: experience.roles.filter((_, itemIndex) => itemIndex !== roleIndex) }, resumeForm, setResumeForm)} />
                            </div>
                          ))}
                        </div>
                        <AdminActions className="mt-3">
                          <Button type="button" variant="outline" onClick={() => updateExperience(index, { roles: [...experience.roles, { position: '', period: '' }] }, resumeForm, setResumeForm)}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Adicionar cargo
                          </Button>
                        </AdminActions>
                      </section>
                      <div className="md:col-span-3">
                        <Textarea label="Responsabilidades, uma por linha" value={experience.responsibilities} onChange={(value) => updateExperience(index, { responsibilities: value }, resumeForm, setResumeForm)} rows={5} />
                      </div>
                    </div>
                  ))}
                </div>
                <AdminActions className="mt-5">
                  <Button type="button" variant="outline" className="min-w-48" onClick={() => setResumeForm({ ...resumeForm, experiences: [...resumeForm.experiences, createExperienceForm(resumeForm.experiences.length)] })}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Adicionar experiência
                  </Button>
                  <Button type="button" className="min-w-36" loading={isSaving} onClick={saveResume}>
                    Salvar currículo
                  </Button>
                </AdminActions>
              </AdminSection>
            )}
          </>
        )}
      </div>
    </main>
  )
}

function mapProjectGroupToForm(group: ProjectGroup): ProjectGroupForm {
  return {
    id: group.id,
    title: group.title,
    sortOrder: group.sortOrder,
    projects: group.projects.map((project) => ({
      id: project.id,
      groupId: project.groupId,
      title: project.title,
      description: project.description,
      logo: project.logo,
      tags: formatTextList(project.tags),
      projectUrl: project.projectUrl ?? '',
      siteUrl: project.siteUrl ?? '',
      architecture: cloneArchitecture(project.architecture),
      details: cloneProjectDetails(project.details),
      sortOrder: project.sortOrder,
    })),
  }
}

function mapArticleToForm(article: Article): ArticleForm {
  return {
    slug: article.slug,
    title: article.title,
    category: article.category,
    description: article.description,
    date: article.date,
    readTime: article.readTime,
    content: article.content,
    kind: article.kind,
    sortOrder: article.sortOrder,
  }
}

function createProjectGroupForm(index: number): ProjectGroupForm {
  return {
    id: '',
    title: `Nova empresa ${index + 1}`,
    sortOrder: index,
    projects: [],
  }
}

function createProjectForm(groupId: string, index: number): ProjectForm {
  return {
    id: '',
    groupId,
    title: '',
    description: '',
    logo: '',
    tags: '',
    projectUrl: '',
    siteUrl: '',
    architecture: null,
    details: createProjectDetails(),
    sortOrder: index,
  }
}

function createArticleForm(index: number): ArticleForm {
  return {
    slug: '',
    title: '',
    category: '',
    description: '',
    date: '',
    readTime: '5 min',
    content: '# Novo artigo',
    kind: 'work',
    sortOrder: index,
  }
}

function createEducationForm(index: number): EducationForm {
  return {
    id: '',
    institution: '',
    course: '',
    location: '',
    period: '',
    sortOrder: index,
  }
}

function createExperienceForm(index: number): ExperienceForm {
  return {
    id: '',
    company: '',
    position: '',
    location: '',
    period: '',
    responsibilities: '',
    roles: [],
    sortOrder: index,
  }
}

function updateProjectGroup(
  groupIndex: number,
  partial: Partial<ProjectGroupForm>,
  groups: ProjectGroupForm[],
  setGroups: (groups: ProjectGroupForm[]) => void,
) {
  setGroups(groups.map((group, index) => (index === groupIndex ? { ...group, ...partial } : group)))
}

function updateProject(
  groupIndex: number,
  projectIndex: number,
  partial: Partial<ProjectForm>,
  groups: ProjectGroupForm[],
  setGroups: (groups: ProjectGroupForm[]) => void,
) {
  setGroups(
    groups.map((group, index) =>
      index === groupIndex
        ? {
            ...group,
            projects: group.projects.map((project, itemIndex) => (itemIndex === projectIndex ? { ...project, ...partial } : project)),
          }
        : group,
    ),
  )
}

function addProject(groupIndex: number, groups: ProjectGroupForm[], setGroups: (groups: ProjectGroupForm[]) => void) {
  setGroups(
    groups.map((group, index) =>
      index === groupIndex ? { ...group, projects: [...group.projects, createProjectForm(group.id, group.projects.length)] } : group,
    ),
  )
}

function removeProject(groupIndex: number, projectIndex: number, groups: ProjectGroupForm[], setGroups: (groups: ProjectGroupForm[]) => void) {
  setGroups(
    groups.map((group, index) =>
      index === groupIndex ? { ...group, projects: group.projects.filter((_, itemIndex) => itemIndex !== projectIndex) } : group,
    ),
  )
}

function updateArticle(index: number, partial: Partial<ArticleForm>, articles: ArticleForm[], setArticles: (articles: ArticleForm[]) => void) {
  setArticles(articles.map((article, itemIndex) => (itemIndex === index ? { ...article, ...partial } : article)))
}

function updateEducation(index: number, partial: Partial<EducationForm>, resume: ResumeForm, setResume: (resume: ResumeForm) => void) {
  setResume({
    ...resume,
    education: resume.education.map((item, itemIndex) => (itemIndex === index ? { ...item, ...partial } : item)),
  })
}

function updateExperience(index: number, partial: Partial<ExperienceForm>, resume: ResumeForm, setResume: (resume: ResumeForm) => void) {
  setResume({
    ...resume,
    experiences: resume.experiences.map((item, itemIndex) => (itemIndex === index ? { ...item, ...partial } : item)),
  })
}
