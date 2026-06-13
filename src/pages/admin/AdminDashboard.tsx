import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, ArrowPathIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Badge, ThemeToggle } from '@/components/ui/feedback'
import { Button, Input } from '@/components/ui/forms'
import { Article, ArticleKind, useArticles } from '@/api/articles/useArticles'
import { useProfileContent } from '@/api/profile/useProfileContent'
import { Project, ProjectGroup, useProjectGroups } from '@/api/projects/useProjectGroups'
import { useResumeContent } from '@/api/resume/useResumeContent'
import { supabase } from '@/config/supabase'
import { formatTextList, parseTextList } from '@/lib/text-list'
import { useStoredTheme } from '@/lib/useStoredTheme'

type AdminTab = 'profile' | 'projects' | 'articles' | 'resume'

type ProfileForm = {
  name: string
  role: string
  intro: string
  contactUrl: string
  technologies: string
  aboutParagraphs: string
  highlights: string
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
  url: string
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
  education: EducationForm[]
  experiences: ExperienceForm[]
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
  roles: string
  sortOrder: number
}

const tabs: Array<{ id: AdminTab; label: string }> = [
  { id: 'profile', label: 'Perfil' },
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
      <div className="border-b border-border pb-3">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  )
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
  const projectGroupsQuery = useProjectGroups()
  const workArticlesQuery = useArticles('work')
  const personalArticlesQuery = useArticles('personal')
  const resumeQuery = useResumeContent()

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: '',
    role: '',
    intro: '',
    contactUrl: '',
    technologies: '',
    aboutParagraphs: '',
    highlights: '',
  })
  const [projectGroupsForm, setProjectGroupsForm] = useState<ProjectGroupForm[]>([])
  const [articleForms, setArticleForms] = useState<ArticleForm[]>([])
  const [resumeForm, setResumeForm] = useState<ResumeForm>({
    technologies: '',
    education: [],
    experiences: [],
  })

  const isLoading =
    profileQuery.isLoading ||
    projectGroupsQuery.isLoading ||
    workArticlesQuery.isLoading ||
    personalArticlesQuery.isLoading ||
    resumeQuery.isLoading

  const articleQueries = useMemo(
    () => [...(workArticlesQuery.data ?? []), ...(personalArticlesQuery.data ?? [])],
    [workArticlesQuery.data, personalArticlesQuery.data],
  )

  useEffect(() => {
    if (!profileQuery.data) return
    setProfileForm({
      name: profileQuery.data.name,
      role: profileQuery.data.role,
      intro: profileQuery.data.intro,
      contactUrl: profileQuery.data.contactUrl,
      technologies: formatTextList(profileQuery.data.technologies),
      aboutParagraphs: formatTextList(profileQuery.data.aboutParagraphs),
      highlights: profileQuery.data.highlights
        .map((highlight) => `${highlight.icon}|${highlight.title}|${highlight.description}`)
        .join('\n'),
    })
  }, [profileQuery.data])

  useEffect(() => {
    if (!projectGroupsQuery.data) return
    setProjectGroupsForm(projectGroupsQuery.data.map(mapProjectGroupToForm))
  }, [projectGroupsQuery.data])

  useEffect(() => {
    setArticleForms(articleQueries.map(mapArticleToForm))
  }, [articleQueries])

  useEffect(() => {
    if (!resumeQuery.data) return
    setResumeForm({
      technologies: formatTextList(resumeQuery.data.technologies),
      education: resumeQuery.data.education.map((item) => ({ ...item })),
      experiences: resumeQuery.data.experiences.map((experience) => ({
        id: experience.id,
        company: experience.company,
        position: experience.position,
        location: experience.location,
        period: experience.period,
        responsibilities: formatTextList(experience.responsibilities),
        roles: (experience.roles ?? []).map((role) => `${role.position}|${role.period}`).join('\n'),
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
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erro ao salvar.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

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
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erro ao enviar logo.')
    } finally {
      setUploadingLogo('')
    }
  }

  const saveProfile = () =>
    runSave(async () => {
      const highlights = profileForm.highlights
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [icon = 'sparkles', title = '', description = ''] = line.split('|')
          return {
            icon: icon.trim(),
            title: title.trim(),
            description: description.trim(),
          }
        })

      const { error } = await supabase.from('profile').upsert({
        id: 'main',
        name: profileForm.name,
        role: profileForm.role,
        intro: profileForm.intro,
        contact_url: profileForm.contactUrl,
        technologies: parseTextList(profileForm.technologies),
        about_paragraphs: parseTextList(profileForm.aboutParagraphs),
        highlights,
      })

      if (error) throw error
    }, 'Perfil salvo.')

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
          url: project.url || null,
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
        parseTextList(experience.roles).map((roleLine, roleIndex) => {
          const [position = '', period = ''] = roleLine.split('|')
          return {
            id: `${experiences[experienceIndex].id}-${roleIndex + 1}-${slugify(position)}`,
            experience_id: experiences[experienceIndex].id,
            position: position.trim(),
            period: period.trim(),
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
            <Button type="button" variant="outline" className="min-w-32" onClick={() => window.location.reload()}>
              <ArrowPathIcon className="mr-2 h-4 w-4" />
              Recarregar
            </Button>
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
              <AdminSection title="Perfil e Home">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Nome" value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} />
                  <Input label="Cargo" value={profileForm.role} onChange={(event) => setProfileForm({ ...profileForm, role: event.target.value })} />
                  <Input label="Contato" value={profileForm.contactUrl} onChange={(event) => setProfileForm({ ...profileForm, contactUrl: event.target.value })} />
                  <Input label="Intro" value={profileForm.intro} onChange={(event) => setProfileForm({ ...profileForm, intro: event.target.value })} />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Textarea label="Tecnologias, uma por linha" value={profileForm.technologies} onChange={(value) => setProfileForm({ ...profileForm, technologies: value })} rows={8} />
                  <Textarea label="Sobre, um parágrafo por linha" value={profileForm.aboutParagraphs} onChange={(value) => setProfileForm({ ...profileForm, aboutParagraphs: value })} rows={8} />
                </div>
                <div className="mt-4">
                  <Textarea label="Destaques: icon|titulo|descrição" value={profileForm.highlights} onChange={(value) => setProfileForm({ ...profileForm, highlights: value })} rows={5} />
                </div>
                <div className="mt-5 flex justify-end border-t border-border pt-5">
                  <Button type="button" className="min-w-36" loading={isSaving} onClick={saveProfile}>
                    Salvar perfil
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
                            <Input label="URL" value={project.url} onChange={(event) => updateProject(groupIndex, projectIndex, { url: event.target.value }, projectGroupsForm, setProjectGroupsForm)} />
                            <Textarea label="Tags, uma por linha" value={project.tags} onChange={(value) => updateProject(groupIndex, projectIndex, { tags: value }, projectGroupsForm, setProjectGroupsForm)} rows={4} />
                            <div className="md:col-span-2">
                              <Textarea label="Descrição" value={project.description} onChange={(value) => updateProject(groupIndex, projectIndex, { description: value }, projectGroupsForm, setProjectGroupsForm)} rows={3} />
                            </div>
                            <div className="flex justify-end border-t border-border/70 pt-3 md:col-span-2">
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
                <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-border pt-5">
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
                      <div className="flex justify-end border-t border-border/70 pt-3 md:col-span-2">
                        <Button type="button" variant="destructive" className="min-w-40" onClick={() => setArticleForms(articleForms.filter((_, itemIndex) => itemIndex !== index))}>
                          Remover artigo
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-border pt-5">
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
                <Textarea label="Habilidades técnicas, uma por linha" value={resumeForm.technologies} onChange={(value) => setResumeForm({ ...resumeForm, technologies: value })} rows={6} />
                <h2 className="mt-8 text-2xl font-bold">Educação</h2>
                <div className="mt-4 space-y-4">
                  {resumeForm.education.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-2">
                      <Input label="Instituição" value={item.institution} onChange={(event) => updateEducation(index, { institution: event.target.value }, resumeForm, setResumeForm)} />
                      <Input label="Curso" value={item.course} onChange={(event) => updateEducation(index, { course: event.target.value }, resumeForm, setResumeForm)} />
                      <Input label="Local" value={item.location} onChange={(event) => updateEducation(index, { location: event.target.value }, resumeForm, setResumeForm)} />
                      <Input label="Período" value={item.period} onChange={(event) => updateEducation(index, { period: event.target.value }, resumeForm, setResumeForm)} />
                      <div className="flex justify-end border-t border-border/70 pt-3 md:col-span-2">
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
                      <Textarea label="Timeline: cargo|período" value={experience.roles} onChange={(value) => updateExperience(index, { roles: value }, resumeForm, setResumeForm)} rows={4} />
                      <Textarea label="Responsabilidades, uma por linha" value={experience.responsibilities} onChange={(value) => updateExperience(index, { responsibilities: value }, resumeForm, setResumeForm)} rows={5} />
                      <div className="flex justify-end border-t border-border/70 pt-3 md:col-span-2">
                        <Button type="button" variant="destructive" className="min-w-44" onClick={() => setResumeForm({ ...resumeForm, experiences: resumeForm.experiences.filter((_, itemIndex) => itemIndex !== index) })}>
                          Remover experiência
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-border pt-5">
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
      url: project.url ?? '',
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
    logo: '/logo.png',
    tags: '',
    url: '',
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
    roles: '',
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
