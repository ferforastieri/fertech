import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Badge, ThemeToggle } from '@/components/ui/feedback'
import { Button, Input } from '@/components/ui/forms'
import { Article, ArticleKind, useArticleList } from '@/api/articles/useArticleList'
import { useProfileContent } from '@/api/profile/useProfileContent'
import { useHomeContent } from '@/api/home/useHomeContent'
import { ArchitectureNode, Project, ProjectArchitecture, ProjectGroup, useProjectGroups } from '@/api/projects/useProjectGroups'
import { ResumeSectionKey, useResumeContent } from '@/api/resume/useResumeContent'
import { supabase } from '@/config/supabase/client'
import { useStoredTheme } from '@/hooks/theme/useStoredTheme'
import { PlaygroundPattern, PlaygroundTreeNode, SiteContent, useSiteContent } from '@/api/site/useSiteContent'
import { notifyError, notifySuccess } from '@/components/ui/feedback/notifications'

type AdminTab = 'profile' | 'home' | 'content' | 'projects' | 'articles' | 'resume'

type ProfileForm = {
  name: string
  role: string
  intro: string
  contactUrl: string
  logoUrl: string
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

function AdminSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-5">
      <div className="pb-1">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      <div>{children}</div>
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
    <section className="rounded-2xl border border-border bg-card/40 p-4">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function cloneSiteContent(content: SiteContent): SiteContent {
  return structuredClone(content)
}

function cloneArchitecture(architecture: ProjectArchitecture | undefined): ProjectArchitecture | null {
  return architecture ? structuredClone(architecture) : null
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
      <AdminCard
        title="Arquitetura do projeto"
        description="Aparece na página de detalhe do projeto, abaixo da apresentação. Ative somente quando quiser mostrar camadas, tecnologias e pastas desse projeto."
        action={
          <Button type="button" variant="outline" onClick={() => onChange(createArchitecture())}>
            Adicionar arquitetura
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground">Este projeto ainda não tem seção de arquitetura.</p>
      </AdminCard>
    )
  }

  const updateLayer = (layer: keyof ProjectArchitecture['layers'], nodes: ArchitectureNode[]) => {
    onChange({ ...value, layers: { ...value.layers, [layer]: nodes } })
  }

  return (
    <AdminCard
      title="Arquitetura do projeto"
      description="Aparece no detalhe do projeto. Use camadas para explicar clientes, serviços e plataforma."
      action={
        <Button type="button" variant="destructive" onClick={() => onChange(null)}>
          Remover arquitetura
        </Button>
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
          <AdminCard key={layer} title={layer === 'clients' ? 'Camada cliente' : layer === 'services' ? 'Camada serviços' : 'Camada plataforma'}>
            <div className="space-y-4">
              {value.layers[layer].map((node, index) => (
                <div key={`${node.name}-${index}`} className="space-y-3 rounded-xl border border-border bg-background p-3">
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
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    onClick={() => updateLayer(layer, value.layers[layer].filter((_, itemIndex) => itemIndex !== index))}
                  >
                    Remover item
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" className="w-full" onClick={() => updateLayer(layer, [...value.layers[layer], createArchitectureNode()])}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Adicionar item
              </Button>
            </div>
          </AdminCard>
        ))}
      </div>
    </AdminCard>
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
    <div className="space-y-3 rounded-xl border border-border bg-background p-3" style={{ marginLeft: depth ? `${Math.min(depth * 1.25, 3)}rem` : undefined }}>
      <div className="grid gap-3 md:grid-cols-2">
        <Input label="Nome da pasta ou arquivo" value={node.name} onChange={(event) => onChange({ ...node, name: event.target.value })} />
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
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => onChange({ ...node, children: [...children, createTreeNode()] })}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Adicionar dentro
        </Button>
        <Button type="button" variant="destructive" onClick={onRemove}>
          Remover
        </Button>
      </div>
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

  return (
    <div className="space-y-6">
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
            <div key={mode.id} className="space-y-3 rounded-xl border border-border bg-background p-3">
              <Input label={`Modo ${mode.id}: nome`} value={mode.name} onChange={(event) => update('gateway', { ...value.gateway, modes: value.gateway.modes.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)) })} />
              <Input label="Público" value={mode.audience} onChange={(event) => update('gateway', { ...value.gateway, modes: value.gateway.modes.map((item, itemIndex) => (itemIndex === index ? { ...item, audience: event.target.value } : item)) })} />
              <Input label="Destino" value={mode.href} onChange={(event) => update('gateway', { ...value.gateway, modes: value.gateway.modes.map((item, itemIndex) => (itemIndex === index ? { ...item, href: event.target.value } : item)) })} />
              <Textarea label="Descrição" value={mode.description} onChange={(description) => update('gateway', { ...value.gateway, modes: value.gateway.modes.map((item, itemIndex) => (itemIndex === index ? { ...item, description } : item)) })} rows={3} />
            </div>
          ))}
        </div>
      </AdminCard>

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

      <AdminCard title="Blog, Projetos e Currículo" description="Muda títulos, descrições e mensagens das páginas de listagem e detalhe nos dois modos.">
        <div className="grid gap-5 lg:grid-cols-3">
          <AdminCard title="Blog">
            <ContentObjectFields value={value.blog} labels={blogContentLabels} onChange={(blog) => update('blog', blog)} />
          </AdminCard>
          <AdminCard title="Projetos">
            <ContentObjectFields value={value.projects} labels={projectsContentLabels} onChange={(projects) => update('projects', projects)} />
          </AdminCard>
          <AdminCard title="Currículo">
            <ContentObjectFields value={value.resume} labels={resumeContentLabels} onChange={(resume) => update('resume', resume)} />
          </AdminCard>
        </div>
      </AdminCard>

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
            <div key={`${experiment.title}-${index}`} className="space-y-3 rounded-xl border border-border bg-background p-3">
              <Input label={`Experimento ${index + 1}: chamada`} value={experiment.eyebrow} onChange={(event) => update('playground', { ...value.playground, experiments: value.playground.experiments.map((item, itemIndex) => (itemIndex === index ? { ...item, eyebrow: event.target.value } : item)) })} />
              <Input label="Título" value={experiment.title} onChange={(event) => update('playground', { ...value.playground, experiments: value.playground.experiments.map((item, itemIndex) => (itemIndex === index ? { ...item, title: event.target.value } : item)) })} />
              <Textarea label="Descrição" value={experiment.description} onChange={(description) => update('playground', { ...value.playground, experiments: value.playground.experiments.map((item, itemIndex) => (itemIndex === index ? { ...item, description } : item)) })} rows={3} />
            </div>
          ))}
        </div>
      </AdminCard>

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
        <div className="mt-4 flex justify-end">
          <Button type="button" variant="outline" onClick={() => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, tree: [...value.playground.architecture.tree, createTreeNode()] } })}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar pasta raiz
          </Button>
        </div>
        <h4 className="mt-6 text-base font-semibold">Design patterns</h4>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {value.playground.architecture.patterns.map((pattern, index) => (
            <div key={`${pattern.id}-${index}`} className="space-y-3 rounded-xl border border-border bg-background p-3">
              <Input label="Identificador" value={pattern.id} onChange={(event) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: value.playground.architecture.patterns.map((item, itemIndex) => (itemIndex === index ? { ...item, id: slugify(event.target.value) || event.target.value } : item)) } })} />
              <Input label="Nome do pattern" value={pattern.name} onChange={(event) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: value.playground.architecture.patterns.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)) } })} />
              <Input label="Categoria" value={pattern.category} onChange={(event) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: value.playground.architecture.patterns.map((item, itemIndex) => (itemIndex === index ? { ...item, category: event.target.value } : item)) } })} />
              <Textarea label="Descrição" value={pattern.description} onChange={(description) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: value.playground.architecture.patterns.map((item, itemIndex) => (itemIndex === index ? { ...item, description } : item)) } })} rows={3} />
              <Textarea label="Fluxo animado, um passo por linha" value={formatTextList(pattern.flow)} onChange={(flow) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: value.playground.architecture.patterns.map((item, itemIndex) => (itemIndex === index ? { ...item, flow: parseTextList(flow) } : item)) } })} rows={4} />
              <Textarea label="Tecnologias, uma por linha" value={formatTextList(pattern.technologies)} onChange={(technologies) => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: value.playground.architecture.patterns.map((item, itemIndex) => (itemIndex === index ? { ...item, technologies: parseTextList(technologies) } : item)) } })} rows={4} />
              <Button type="button" variant="destructive" className="w-full" onClick={() => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: value.playground.architecture.patterns.filter((_, itemIndex) => itemIndex !== index) } })}>
                Remover pattern
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="button" variant="outline" onClick={() => update('playground', { ...value.playground, architecture: { ...value.playground.architecture, patterns: [...value.playground.architecture.patterns, createPattern(value.playground.architecture.patterns.length)] } })}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar pattern
          </Button>
        </div>
      </AdminCard>

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
  const [activeTab, setActiveTab] = useState<AdminTab>('profile')
  const [status, setStatus] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState('')
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

  const uploadSiteLogo = async (file: File) => {
    setStatus('')
    setUploadingLogo('site')

    try {
      const extension = file.name.split('.').pop() || 'png'
      const path = `site/logo-${Date.now()}.${extension}`
      const { error } = await supabase.storage.from('logos').upload(path, file, {
        cacheControl: '31536000',
        upsert: true,
      })

      if (error) throw error

      const { data } = supabase.storage.from('logos').getPublicUrl(path)
      setProfileForm((current) => ({ ...current, logoUrl: data.publicUrl }))
      setStatus('Logo do site enviada. Salve o perfil para persistir o caminho.')
      notifySuccess('Logo do site enviada.', 'Salve o perfil para persistir o caminho.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erro ao enviar logo do site.')
      notifyError('Erro ao enviar logo do site', error)
    } finally {
      setUploadingLogo('')
    }
  }

  const saveProfile = () =>
    runSave(async () => {
      const { error } = await supabase.from('profile').upsert({
        id: 'main',
        name: profileForm.name,
        role: profileForm.role,
        intro: profileForm.intro,
        contact_url: profileForm.contactUrl,
        logo_url: profileForm.logoUrl,
        social_links: profileForm.socialLinks,
        technologies: parseTextList(profileForm.technologies),
        about_paragraphs: parseTextList(profileForm.aboutParagraphs),
        highlights: profileForm.highlights,
      })

      if (error) throw error
    }, 'Perfil salvo.')

  const saveHome = () =>
    runSave(async () => {
      const { error } = await supabase.from('home_content').upsert({
        id: 'main',
        hero_eyebrow: homeForm.heroEyebrow,
        hero_headline: homeForm.heroHeadline,
        hero_description: homeForm.heroDescription,
        projects_button_label: homeForm.projectsButtonLabel,
        resume_button_label: homeForm.resumeButtonLabel,
        contact_button_label: homeForm.contactButtonLabel,
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
          project_url: project.projectUrl || null,
          site_url: project.siteUrl || null,
          url: project.siteUrl || null,
          architecture: project.architecture,
          sort_order: projectIndex,
        })),
      )

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
    <main className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to="/classic" className="mb-3 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Voltar ao site
            </Link>
            <h1 className="text-4xl font-bold">Painel</h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            {status && <Badge variant={status.includes('Erro') || status.includes('policy') ? 'destructive' : 'secondary'}>{status}</Badge>}
            <ThemeToggle theme={theme} onToggle={toggleTheme} variant="outline" size="lg" />
            <Button type="button" variant="ghost" className="min-w-20" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </header>

        <nav className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`h-10 rounded-xl px-4 text-sm font-medium transition ${
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
              <AdminSection title="Perfil">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Nome" value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} />
                  <Input label="Cargo" value={profileForm.role} onChange={(event) => setProfileForm({ ...profileForm, role: event.target.value })} />
                  <Input label="Contato" value={profileForm.contactUrl} onChange={(event) => setProfileForm({ ...profileForm, contactUrl: event.target.value })} />
                  <Input label="Intro" value={profileForm.intro} onChange={(event) => setProfileForm({ ...profileForm, intro: event.target.value })} />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
                  <Input label="Logo do site" value={profileForm.logoUrl} onChange={(event) => setProfileForm({ ...profileForm, logoUrl: event.target.value })} />
                  <label className="self-end">
                    <span className="sr-only">Enviar logo do site</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="block h-10 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                      disabled={uploadingLogo === 'site'}
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file) {
                          void uploadSiteLogo(file)
                        }
                        event.target.value = ''
                      }}
                    />
                  </label>
                </div>
                <AdminCard title="Redes sociais" description="Aparecem no topo, rodapé ou navegação social do site.">
                  <div className="space-y-3">
                    {profileForm.socialLinks.map((social, index) => (
                      <div key={`${social.name}-${index}`} className="grid gap-3 rounded-xl border border-border bg-background p-3 md:grid-cols-3">
                        <Input label="Nome" value={social.name} onChange={(event) => setProfileForm({ ...profileForm, socialLinks: profileForm.socialLinks.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)) })} />
                        <Input label="URL" value={social.href} onChange={(event) => setProfileForm({ ...profileForm, socialLinks: profileForm.socialLinks.map((item, itemIndex) => (itemIndex === index ? { ...item, href: event.target.value } : item)) })} />
                        <Input label="Ícone" value={social.icon} onChange={(event) => setProfileForm({ ...profileForm, socialLinks: profileForm.socialLinks.map((item, itemIndex) => (itemIndex === index ? { ...item, icon: event.target.value } : item)) })} />
                        <div className="flex justify-end md:col-span-3">
                          <Button type="button" variant="destructive" onClick={() => setProfileForm({ ...profileForm, socialLinks: profileForm.socialLinks.filter((_, itemIndex) => itemIndex !== index) })}>
                            Remover rede
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button type="button" variant="outline" onClick={() => setProfileForm({ ...profileForm, socialLinks: [...profileForm.socialLinks, { name: '', href: '', icon: 'link' }] })}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Adicionar rede
                    </Button>
                  </div>
                </AdminCard>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Textarea label="Tecnologias, uma por linha" value={profileForm.technologies} onChange={(value) => setProfileForm({ ...profileForm, technologies: value })} rows={8} />
                  <Textarea label="Sobre, um parágrafo por linha" value={profileForm.aboutParagraphs} onChange={(value) => setProfileForm({ ...profileForm, aboutParagraphs: value })} rows={8} />
                </div>
                <div className="mt-4">
                  <AdminCard title="Destaques" description="Aparecem na Home tradicional como cards de diferenciais.">
                    <div className="space-y-3">
                      {profileForm.highlights.map((highlight, index) => (
                        <div key={`${highlight.title}-${index}`} className="grid gap-3 rounded-xl border border-border bg-background p-3 md:grid-cols-2">
                          <Input label="Ícone" value={highlight.icon} onChange={(event) => setProfileForm({ ...profileForm, highlights: profileForm.highlights.map((item, itemIndex) => (itemIndex === index ? { ...item, icon: event.target.value } : item)) })} />
                          <Input label="Título" value={highlight.title} onChange={(event) => setProfileForm({ ...profileForm, highlights: profileForm.highlights.map((item, itemIndex) => (itemIndex === index ? { ...item, title: event.target.value } : item)) })} />
                          <div className="md:col-span-2">
                            <Textarea label="Descrição" value={highlight.description} onChange={(description) => setProfileForm({ ...profileForm, highlights: profileForm.highlights.map((item, itemIndex) => (itemIndex === index ? { ...item, description } : item)) })} rows={3} />
                          </div>
                          <div className="flex justify-end md:col-span-2">
                            <Button type="button" variant="destructive" onClick={() => setProfileForm({ ...profileForm, highlights: profileForm.highlights.filter((_, itemIndex) => itemIndex !== index) })}>
                              Remover destaque
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button type="button" variant="outline" onClick={() => setProfileForm({ ...profileForm, highlights: [...profileForm.highlights, { icon: 'sparkles', title: '', description: '' }] })}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Adicionar destaque
                      </Button>
                    </div>
                  </AdminCard>
                </div>
                <div className="mt-5 flex justify-end">
                  <Button type="button" className="min-w-36" loading={isSaving} onClick={saveProfile}>
                    Salvar perfil
                  </Button>
                </div>
              </AdminSection>
            )}

            {activeTab === 'home' && (
              <AdminSection title="Home">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Chamada superior" value={homeForm.heroEyebrow} onChange={(event) => setHomeForm({ ...homeForm, heroEyebrow: event.target.value })} />
                  <Input label="Título de impacto" value={homeForm.heroHeadline} onChange={(event) => setHomeForm({ ...homeForm, heroHeadline: event.target.value })} />
                </div>
                <div className="mt-4">
                  <Textarea label="Apresentação principal" value={homeForm.heroDescription} onChange={(value) => setHomeForm({ ...homeForm, heroDescription: value })} rows={4} />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <Input label="Botão de projetos" value={homeForm.projectsButtonLabel} onChange={(event) => setHomeForm({ ...homeForm, projectsButtonLabel: event.target.value })} />
                  <Input label="Botão de currículo" value={homeForm.resumeButtonLabel} onChange={(event) => setHomeForm({ ...homeForm, resumeButtonLabel: event.target.value })} />
                  <Input label="Botão de contato" value={homeForm.contactButtonLabel} onChange={(event) => setHomeForm({ ...homeForm, contactButtonLabel: event.target.value })} />
                </div>
                <div className="mt-4">
                  <AdminCard title="Grupos da stack" description="Aparecem na Home como blocos de capacidades e tecnologias.">
                    <div className="space-y-3">
                      {homeForm.stackGroups.map((group, index) => (
                        <div key={`${group.title}-${index}`} className="grid gap-3 rounded-xl border border-border bg-background p-3 md:grid-cols-2">
                          <Input label="Título do grupo" value={group.title} onChange={(event) => setHomeForm({ ...homeForm, stackGroups: homeForm.stackGroups.map((item, itemIndex) => (itemIndex === index ? { ...item, title: event.target.value } : item)) })} />
                          <Textarea label="Itens, um por linha" value={group.items} onChange={(items) => setHomeForm({ ...homeForm, stackGroups: homeForm.stackGroups.map((item, itemIndex) => (itemIndex === index ? { ...item, items } : item)) })} rows={5} />
                          <div className="flex justify-end md:col-span-2">
                            <Button type="button" variant="destructive" onClick={() => setHomeForm({ ...homeForm, stackGroups: homeForm.stackGroups.filter((_, itemIndex) => itemIndex !== index) })}>
                              Remover grupo
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button type="button" variant="outline" onClick={() => setHomeForm({ ...homeForm, stackGroups: [...homeForm.stackGroups, { title: '', items: '' }] })}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Adicionar grupo
                      </Button>
                    </div>
                  </AdminCard>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
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
                <div className="mt-4">
                  <Textarea label="Descrição do contato" value={homeForm.contactDescription} onChange={(value) => setHomeForm({ ...homeForm, contactDescription: value })} rows={3} />
                </div>
                <div className="mt-5 flex justify-end">
                  <Button type="button" className="min-w-36" loading={isSaving} onClick={saveHome}>
                    Salvar home
                  </Button>
                </div>
              </AdminSection>
            )}

            {activeTab === 'projects' && (
              <AdminSection title="Projetos">
                <div className="space-y-8">
                  {projectGroupsForm.map((group, groupIndex) => (
                    <div key={`${group.id}-${groupIndex}`} className="rounded-xl border border-border p-4">
                      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                        <Input
                          label="Empresa/grupo"
                          value={group.title}
                          onChange={(event) => updateProjectGroup(groupIndex, { title: event.target.value }, projectGroupsForm, setProjectGroupsForm)}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          className="self-end"
                          aria-label="Remover empresa ou grupo"
                          onClick={() => setProjectGroupsForm(projectGroupsForm.filter((_, index) => index !== groupIndex))}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-4 space-y-4">
                        {group.projects.map((project, projectIndex) => (
                          <div key={`${project.id}-${projectIndex}`} className="grid gap-3 rounded-xl bg-muted/40 p-4 md:grid-cols-2">
                            <Input label="Projeto" value={project.title} onChange={(event) => updateProject(groupIndex, projectIndex, { title: event.target.value }, projectGroupsForm, setProjectGroupsForm)} />
                            <div className="space-y-3">
                              <Input label="Logo" value={project.logo} onChange={(event) => updateProject(groupIndex, projectIndex, { logo: event.target.value }, projectGroupsForm, setProjectGroupsForm)} />
                              <label className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2 text-sm">
                                <span className="truncate text-muted-foreground">
                                  {uploadingLogo === `${groupIndex}-${projectIndex}` ? 'Enviando logo...' : 'Enviar nova logo'}
                                </span>
                                <input
                                  type="file"
                                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                  className="max-w-44 text-xs"
                                  disabled={uploadingLogo === `${groupIndex}-${projectIndex}`}
                                  onChange={(event) => {
                                    const file = event.target.files?.[0]
                                    if (file) {
                                      void uploadProjectLogo(groupIndex, projectIndex, file)
                                    }
                                    event.target.value = ''
                                  }}
                                />
                              </label>
                            </div>
                            <Input label="Link de Ver projeto" value={project.projectUrl} onChange={(event) => updateProject(groupIndex, projectIndex, { projectUrl: event.target.value }, projectGroupsForm, setProjectGroupsForm)} />
                            <Input label="Link de Ver site" value={project.siteUrl} onChange={(event) => updateProject(groupIndex, projectIndex, { siteUrl: event.target.value }, projectGroupsForm, setProjectGroupsForm)} />
                            <Textarea label="Tags, uma por linha" value={project.tags} onChange={(value) => updateProject(groupIndex, projectIndex, { tags: value }, projectGroupsForm, setProjectGroupsForm)} rows={4} />
                            <div className="md:col-span-2">
                              <Textarea label="Descrição" value={project.description} onChange={(value) => updateProject(groupIndex, projectIndex, { description: value }, projectGroupsForm, setProjectGroupsForm)} rows={3} />
                            </div>
                            <div className="md:col-span-2">
                              <ProjectArchitectureEditor
                                value={project.architecture}
                                onChange={(architecture) => updateProject(groupIndex, projectIndex, { architecture }, projectGroupsForm, setProjectGroupsForm)}
                              />
                            </div>
                            <div className="flex justify-end md:col-span-2">
                              <Button type="button" variant="destructive" className="min-w-40" onClick={() => removeProject(groupIndex, projectIndex, projectGroupsForm, setProjectGroupsForm)}>
                                Remover projeto
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button type="button" variant="outline" className="min-w-44" onClick={() => addProject(groupIndex, projectGroupsForm, setProjectGroupsForm)}>
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Adicionar projeto
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap justify-end gap-3">
                  <Button type="button" variant="outline" className="min-w-52" onClick={() => setProjectGroupsForm([...projectGroupsForm, createProjectGroupForm(projectGroupsForm.length)])}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Adicionar empresa/grupo
                  </Button>
                  <Button type="button" className="min-w-36" loading={isSaving} onClick={saveProjects}>
                    Salvar projetos
                  </Button>
                </div>
              </AdminSection>
            )}

            {activeTab === 'content' && (
              <AdminSection title="Conteúdo público do site">
                {siteContentForm ? (
                  <SiteContentEditor value={siteContentForm} onChange={setSiteContentForm} />
                ) : (
                  <div className="rounded-xl border border-border p-6 text-sm text-muted-foreground">Conteúdo do site ainda não carregou.</div>
                )}
                <div className="mt-5 flex justify-end">
                  <Button type="button" className="min-w-40" loading={isSaving} onClick={saveSiteContent}>
                    Salvar conteúdo
                  </Button>
                </div>
              </AdminSection>
            )}

            {activeTab === 'articles' && (
              <AdminSection title="Artigos">
                <div className="space-y-5">
                  {articleForms.map((article, index) => (
                    <div key={`${article.slug}-${index}`} className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-2">
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
                      <Input label="Título" value={article.title} onChange={(event) => updateArticle(index, { title: event.target.value }, articleForms, setArticleForms)} />
                      <Input label="Categoria" value={article.category} onChange={(event) => updateArticle(index, { category: event.target.value }, articleForms, setArticleForms)} />
                      <Input label="Data" value={article.date} onChange={(event) => updateArticle(index, { date: event.target.value }, articleForms, setArticleForms)} />
                      <Input label="Tempo de leitura" value={article.readTime} onChange={(event) => updateArticle(index, { readTime: event.target.value }, articleForms, setArticleForms)} />
                      <div className="md:col-span-2">
                        <Textarea label="Descrição" value={article.description} onChange={(value) => updateArticle(index, { description: value }, articleForms, setArticleForms)} rows={3} />
                      </div>
                      <div className="md:col-span-2">
                        <Textarea label="Conteúdo Markdown" value={article.content} onChange={(value) => updateArticle(index, { content: value }, articleForms, setArticleForms)} rows={12} />
                      </div>
                      <div className="flex justify-end md:col-span-2">
                        <Button type="button" variant="destructive" className="min-w-40" onClick={() => setArticleForms(articleForms.filter((_, itemIndex) => itemIndex !== index))}>
                          Remover artigo
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap justify-end gap-3">
                  <Button type="button" variant="outline" className="min-w-44" onClick={() => setArticleForms([...articleForms, createArticleForm(articleForms.length)])}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Adicionar artigo
                  </Button>
                  <Button type="button" className="min-w-36" loading={isSaving} onClick={saveArticles}>
                    Salvar artigos
                  </Button>
                </div>
              </AdminSection>
            )}

            {activeTab === 'resume' && (
              <AdminSection title="Currículo">
                <div className="grid gap-4 md:grid-cols-2">
                  <Textarea label="Sobre do currículo, um parágrafo por linha" value={resumeForm.aboutParagraphs} onChange={(value) => setResumeForm({ ...resumeForm, aboutParagraphs: value })} rows={6} />
                  <Textarea label="Habilidades técnicas, uma por linha" value={resumeForm.technologies} onChange={(value) => setResumeForm({ ...resumeForm, technologies: value })} rows={8} />
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <AdminCard title="Idiomas" description="Aparecem na seção de idiomas do currículo e no PDF.">
                    <div className="space-y-3">
                      {resumeForm.languages.map((language, index) => (
                        <div key={`${language.name}-${index}`} className="grid gap-3 rounded-xl border border-border bg-background p-3 md:grid-cols-2">
                          <Input label="Idioma" value={language.name} onChange={(event) => setResumeForm({ ...resumeForm, languages: resumeForm.languages.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)) })} />
                          <Input label="Descrição" value={language.description} onChange={(event) => setResumeForm({ ...resumeForm, languages: resumeForm.languages.map((item, itemIndex) => (itemIndex === index ? { ...item, description: event.target.value } : item)) })} />
                          <div className="flex justify-end md:col-span-2">
                            <Button type="button" variant="destructive" onClick={() => setResumeForm({ ...resumeForm, languages: resumeForm.languages.filter((_, itemIndex) => itemIndex !== index) })}>
                              Remover idioma
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button type="button" variant="outline" onClick={() => setResumeForm({ ...resumeForm, languages: [...resumeForm.languages, { name: '', description: '' }] })}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Adicionar idioma
                      </Button>
                    </div>
                  </AdminCard>

                  <AdminCard title="Seções do currículo" description="Controla ordem, título e visibilidade das seções no currículo.">
                    <div className="space-y-3">
                      {resumeForm.sections.map((section, index) => (
                        <div key={`${section.key}-${index}`} className="grid gap-3 rounded-xl border border-border bg-background p-3 md:grid-cols-[1fr_1fr_auto]">
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
                  </AdminCard>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Input label="Localização no PDF" value={resumeForm.location} onChange={(event) => setResumeForm({ ...resumeForm, location: event.target.value })} />
                  <Input label="Nome do arquivo PDF" value={resumeForm.pdfFilename} onChange={(event) => setResumeForm({ ...resumeForm, pdfFilename: event.target.value })} />
                  <Input label="Texto do botão de download" value={resumeForm.downloadLabel} onChange={(event) => setResumeForm({ ...resumeForm, downloadLabel: event.target.value })} />
                  <Input label="Texto durante geração" value={resumeForm.generatingLabel} onChange={(event) => setResumeForm({ ...resumeForm, generatingLabel: event.target.value })} />
                  <Input label="Rótulo de tecnologias dos projetos" value={resumeForm.projectTechnologiesLabel} onChange={(event) => setResumeForm({ ...resumeForm, projectTechnologiesLabel: event.target.value })} />
                </div>
                <h2 className="mt-8 text-2xl font-bold">Educação</h2>
                <div className="mt-4 space-y-4">
                  {resumeForm.education.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-2">
                      <Input label="Instituição" value={item.institution} onChange={(event) => updateEducation(index, { institution: event.target.value }, resumeForm, setResumeForm)} />
                      <Input label="Curso" value={item.course} onChange={(event) => updateEducation(index, { course: event.target.value }, resumeForm, setResumeForm)} />
                      <Input label="Local" value={item.location} onChange={(event) => updateEducation(index, { location: event.target.value }, resumeForm, setResumeForm)} />
                      <Input label="Período" value={item.period} onChange={(event) => updateEducation(index, { period: event.target.value }, resumeForm, setResumeForm)} />
                      <div className="flex justify-end md:col-span-2">
                        <Button type="button" variant="destructive" className="min-w-40" onClick={() => setResumeForm({ ...resumeForm, education: resumeForm.education.filter((_, itemIndex) => itemIndex !== index) })}>
                          Remover educação
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button type="button" variant="outline" className="min-w-44" onClick={() => setResumeForm({ ...resumeForm, education: [...resumeForm.education, createEducationForm(resumeForm.education.length)] })}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Adicionar educação
                  </Button>
                </div>

                <h2 className="mt-8 text-2xl font-bold">Experiências</h2>
                <div className="mt-4 space-y-4">
                  {resumeForm.experiences.map((experience, index) => (
                    <div key={`${experience.id}-${index}`} className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-2">
                      <Input label="Empresa" value={experience.company} onChange={(event) => updateExperience(index, { company: event.target.value }, resumeForm, setResumeForm)} />
                      <Input label="Cargo principal" value={experience.position} onChange={(event) => updateExperience(index, { position: event.target.value }, resumeForm, setResumeForm)} />
                      <Input label="Local" value={experience.location} onChange={(event) => updateExperience(index, { location: event.target.value }, resumeForm, setResumeForm)} />
                      <Input label="Período" value={experience.period} onChange={(event) => updateExperience(index, { period: event.target.value }, resumeForm, setResumeForm)} />
                      <AdminCard title="Timeline de cargos" description="Aparece dentro desta experiência, em ordem.">
                        <div className="space-y-3">
                          {experience.roles.map((role, roleIndex) => (
                            <div key={`${role.position}-${roleIndex}`} className="grid gap-3 rounded-xl border border-border bg-background p-3 md:grid-cols-2">
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
                              <div className="flex justify-end md:col-span-2">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  onClick={() => updateExperience(index, { roles: experience.roles.filter((_, itemIndex) => itemIndex !== roleIndex) }, resumeForm, setResumeForm)}
                                >
                                  Remover cargo
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button type="button" variant="outline" onClick={() => updateExperience(index, { roles: [...experience.roles, { position: '', period: '' }] }, resumeForm, setResumeForm)}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Adicionar cargo
                          </Button>
                        </div>
                      </AdminCard>
                      <Textarea label="Responsabilidades, uma por linha" value={experience.responsibilities} onChange={(value) => updateExperience(index, { responsibilities: value }, resumeForm, setResumeForm)} rows={5} />
                      <div className="flex justify-end md:col-span-2">
                        <Button type="button" variant="destructive" className="min-w-44" onClick={() => setResumeForm({ ...resumeForm, experiences: resumeForm.experiences.filter((_, itemIndex) => itemIndex !== index) })}>
                          Remover experiência
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap justify-end gap-3">
                  <Button type="button" variant="outline" className="min-w-48" onClick={() => setResumeForm({ ...resumeForm, experiences: [...resumeForm.experiences, createExperienceForm(resumeForm.experiences.length)] })}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Adicionar experiência
                  </Button>
                  <Button type="button" className="min-w-36" loading={isSaving} onClick={saveResume}>
                    Salvar currículo
                  </Button>
                </div>
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
