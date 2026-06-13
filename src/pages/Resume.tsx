import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from '@/components/ui/layout'
import { Badge, Skeleton } from '@/components/ui/feedback'
import { Button } from '@/components/ui/forms'
import {
  BriefcaseIcon,
  AcademicCapIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'
import { useProfileContent } from '@/api/profile/useProfileContent'
import { useProjects } from '@/api/projects/useProjects'
import { ResumeSectionKey, useResumeContent } from '@/api/resume/useResumeContent'
import { generateResumePdf } from '@/features/resume/generateResumePdf'

export default function Resume() {
  const [isGenerating, setIsGenerating] = useState(false)
  const profileQuery = useProfileContent()
  const projectsQuery = useProjects()
  const resumeQuery = useResumeContent()

  const profile = profileQuery.data
  const projects = projectsQuery.data ?? []
  const resume = resumeQuery.data
  const isLoading = profileQuery.isLoading || projectsQuery.isLoading || resumeQuery.isLoading
  const hasError = profileQuery.isError || projectsQuery.isError || resumeQuery.isError

  const handleDownloadPDF = async () => {
    if (!profile || !resume) return

    setIsGenerating(true)

    try {
      await generateResumePdf({ profile, resume, projects })
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-4 pb-12">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-5 text-center">
            <Skeleton className="mx-auto h-24 w-24 rounded-full" />
            <Skeleton className="mx-auto h-12 w-full max-w-xl" />
            <Skeleton className="mx-auto h-7 w-full max-w-lg" />
            <Skeleton className="mx-auto h-12 w-36 rounded-lg" />
          </div>
          {Array.from({ length: 4 }).map((_, sectionIndex) => (
            <section key={sectionIndex} className="space-y-5">
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-9 w-72" />
              <div className="space-y-4">
                {Array.from({ length: sectionIndex === 0 ? 3 : 2 }).map((_, index) => (
                  <Skeleton key={index} className="h-28 rounded-lg" />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    )
  }

  if (hasError || !profile || !resume) {
    return (
      <div className="container mx-auto px-4 pt-4 pb-12">
        <p className="text-center text-destructive">Não foi possível carregar o currículo.</p>
      </div>
    )
  }

  const getSection = (key: ResumeSectionKey) => resume.sections.find((section) => section.key === key)
  const sectionStyle = (key: ResumeSectionKey) => ({ order: resume.sections.findIndex((section) => section.key === key) })

  return (
    <div className="container mx-auto px-4 pt-4 pb-12">
      <div id="resume-content" className="mx-auto max-w-4xl space-y-12">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <img src={profile.logoUrl} alt="Logo FF" className="h-24 w-24 object-contain" />
          </div>
          <h1 className="mb-4 text-5xl font-bold text-foreground">{profile.name}</h1>
          <p className="mb-6 text-xl text-foreground">{profile.role}</p>
          <Button size="lg" onClick={handleDownloadPDF} disabled={isGenerating} className="disabled:opacity-50">
            <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
            {isGenerating ? resume.generatingLabel : resume.downloadLabel}
          </Button>
        </div>

        <div className="flex flex-col gap-12">
        {getSection('about')?.enabled && <div style={sectionStyle('about')}>
          <Separator className="mb-12" />
          <section>
          <h2 className="mb-6 text-3xl font-bold text-foreground">{getSection('about')?.title}</h2>
          <div className="space-y-4 text-foreground">
            {resume.aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          </section>
        </div>}

        {getSection('education')?.enabled && <div style={sectionStyle('education')}>
          <Separator className="mb-12" />
          <section>
          <h2 className="mb-6 flex items-center gap-2 text-3xl font-bold text-foreground">
            <AcademicCapIcon className="h-8 w-8" />
            {getSection('education')?.title}
          </h2>
          <div className="space-y-6">
            {resume.education.map((edu) => (
              <Card key={edu.id}>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">{edu.course}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">{edu.institution}</CardDescription>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      {edu.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {edu.period}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          </section>
        </div>}

        {getSection('experience')?.enabled && <div style={sectionStyle('experience')}>
          <Separator className="mb-12" />
          <section>
          <h2 className="mb-6 flex items-center gap-2 text-3xl font-bold text-foreground">
            <BriefcaseIcon className="h-8 w-8" />
            {getSection('experience')?.title}
          </h2>
          <div className="space-y-6">
            {resume.experiences.map((exp) => (
              <Card key={exp.id}>
                <CardHeader>
                  <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-xl text-foreground">{exp.position}</CardTitle>
                      <CardDescription className="text-base text-muted-foreground">{exp.company}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      {exp.period}
                    </div>
                  </div>
                  <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPinIcon className="h-4 w-4" />
                    {exp.location}
                  </div>
                </CardHeader>
                <CardContent>
                  {exp.roles && (
                    <div className="mb-5 space-y-3 border-l border-border pl-4">
                      {exp.roles.map((role) => (
                        <div key={`${exp.id}-${role.position}`} className="relative">
                          <span className="absolute -left-[1.35rem] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <h4 className="font-semibold text-foreground">{role.position}</h4>
                            <span className="text-xs text-muted-foreground">{role.period}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <ul className="space-y-2">
                    {exp.responsibilities.map((resp) => (
                      <li key={resp} className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
                        <span className="mt-1.5">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          </section>
        </div>}

        {getSection('skills')?.enabled && <div style={sectionStyle('skills')}>
          <Separator className="mb-12" />
          <section>
          <h2 className="mb-6 text-3xl font-bold text-foreground">{getSection('skills')?.title}</h2>
          <div className="flex flex-wrap gap-2">
            {resume.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm">
                {tech}
              </Badge>
            ))}
          </div>
          </section>
        </div>}

        {getSection('languages')?.enabled && <div style={sectionStyle('languages')}>
          <Separator className="mb-12" />
          <section>
          <h2 className="mb-6 text-3xl font-bold text-foreground">{getSection('languages')?.title}</h2>
          <div className="space-y-4">
            {resume.languages.map((language) => (
              <div key={language.name}>
                <p className="text-lg font-semibold text-foreground">{language.name}</p>
                <p className="text-sm text-muted-foreground">{language.description}</p>
              </div>
            ))}
          </div>
          </section>
        </div>}

        {getSection('projects')?.enabled && <div style={sectionStyle('projects')}>
          <Separator className="mb-12" />
          <section>
            <h2 className="mb-6 text-3xl font-bold text-foreground">{getSection('projects')?.title}</h2>
            <div className="space-y-6">
              {projects.slice(0, 6).map((project) => (
                <article key={project.id}>
                  <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
                  <p className="mt-2 text-foreground">{project.description}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {resume.projectTechnologiesLabel}: {project.tags.join(', ')}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>}
        </div>
      </div>
    </div>
  )
}
