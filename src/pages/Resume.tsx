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
import { useResumeContent } from '@/api/resume/useResumeContent'

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
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 15
      const maxWidth = pageWidth - margin * 2
      let yPosition = margin

      const ensureSpace = (height = 24) => {
        if (yPosition > pageHeight - height) {
          doc.addPage()
          yPosition = margin
        }
      }

      const sectionTitle = (title: string) => {
        ensureSpace(26)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text(title, margin, yPosition)
        yPosition += 6
        doc.setLineWidth(0.5)
        doc.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 5
      }

      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text(profile.name.toUpperCase(), pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 8

      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(profile.role, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 6

      doc.setFontSize(10)
      doc.text('LinkedIn: linkedin.com/in/fernando-forastieri | GitHub: github.com/ferforastieri', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 5
      doc.text('Twitter: @viciofer | Sorocaba, SP - Brasil', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 10

      sectionTitle('RESUMO PROFISSIONAL')
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      profile.aboutParagraphs.forEach((paragraph) => {
        ensureSpace(16)
        const lines = doc.splitTextToSize(paragraph, maxWidth)
        doc.text(lines, margin, yPosition)
        yPosition += lines.length * 4 + 4
      })

      sectionTitle('EXPERIÊNCIA PROFISSIONAL')
      resume.experiences.forEach((exp) => {
        ensureSpace(40)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        const positionLines = doc.splitTextToSize(exp.position, maxWidth - 50)
        doc.text(positionLines, margin, yPosition)

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(exp.period, pageWidth - margin, yPosition, { align: 'right' })
        yPosition += 6

        doc.setFontSize(11)
        doc.setFont('helvetica', 'italic')
        doc.text(`${exp.company} | ${exp.location}`, margin, yPosition)
        yPosition += 6

        exp.roles?.forEach((role) => {
          ensureSpace(12)
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.text(`• ${role.position}`, margin + 5, yPosition)
          doc.setFont('helvetica', 'normal')
          doc.text(role.period, pageWidth - margin, yPosition, { align: 'right' })
          yPosition += 5
        })

        if (exp.roles?.length) yPosition += 2

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        exp.responsibilities.forEach((resp) => {
          ensureSpace(14)
          const respLines = doc.splitTextToSize(`• ${resp}`, maxWidth - 5)
          doc.text(respLines, margin + 5, yPosition)
          yPosition += respLines.length * 4 + 2
        })
        yPosition += 5
      })

      sectionTitle('FORMAÇÃO ACADÊMICA')
      resume.education.forEach((edu) => {
        ensureSpace(20)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text(edu.course, margin, yPosition)
        yPosition += 5

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`${edu.institution} | ${edu.location} | ${edu.period}`, margin, yPosition)
        yPosition += 8
      })

      sectionTitle('HABILIDADES TÉCNICAS')
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const skillsLines = doc.splitTextToSize(resume.technologies.join(' • '), maxWidth)
      doc.text(skillsLines, margin, yPosition)
      yPosition += skillsLines.length * 4 + 8

      sectionTitle('IDIOMAS')
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Português:', margin, yPosition)
      doc.setFont('helvetica', 'normal')
      doc.text('Nativo', margin + 30, yPosition)
      yPosition += 6

      doc.setFont('helvetica', 'bold')
      doc.text('Inglês:', margin, yPosition)
      doc.setFont('helvetica', 'normal')
      const englishLines = doc.splitTextToSize('Técnico - Capacidade de escrita e leitura de documentações técnicas', maxWidth - 30)
      doc.text(englishLines, margin + 30, yPosition)
      yPosition += englishLines.length * 4 + 8

      sectionTitle('PROJETOS RELEVANTES')
      projects.slice(0, 6).forEach((project) => {
        ensureSpace(30)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        const projectNameLines = doc.splitTextToSize(project.title, maxWidth)
        doc.text(projectNameLines, margin, yPosition)
        yPosition += projectNameLines.length * 4 + 2

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const descLines = doc.splitTextToSize(project.description, maxWidth)
        doc.text(descLines, margin, yPosition)
        yPosition += descLines.length * 4 + 2

        doc.setFontSize(9)
        doc.setFont('helvetica', 'italic')
        const techLines = doc.splitTextToSize(`Tecnologias: ${project.tags.join(', ')}`, maxWidth)
        doc.text(techLines, margin, yPosition)
        yPosition += techLines.length * 3 + 6
      })

      doc.save('CV_Fernando_Forastieri.pdf')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
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
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-destructive">Não foi possível carregar o currículo.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div id="resume-content" className="mx-auto max-w-4xl space-y-12">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <img src="/logo.png" alt="Logo FF" className="h-24 w-24 object-contain" />
          </div>
          <h1 className="mb-4 text-5xl font-bold text-foreground">{profile.name}</h1>
          <p className="mb-6 text-xl text-foreground">{profile.role}</p>
          <Button size="lg" onClick={handleDownloadPDF} disabled={isGenerating} className="disabled:opacity-50">
            <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
            {isGenerating ? 'Gerando PDF...' : 'Baixar PDF'}
          </Button>
        </div>

        <Separator />

        <section>
          <h2 className="mb-6 text-3xl font-bold text-foreground">Sobre</h2>
          <div className="space-y-4 text-foreground">
            {profile.aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="mb-6 flex items-center gap-2 text-3xl font-bold text-foreground">
            <AcademicCapIcon className="h-8 w-8" />
            Educação
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

        <Separator />

        <section>
          <h2 className="mb-6 flex items-center gap-2 text-3xl font-bold text-foreground">
            <BriefcaseIcon className="h-8 w-8" />
            Experiência Profissional
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

        <Separator />

        <section>
          <h2 className="mb-6 text-3xl font-bold text-foreground">Habilidades Técnicas</h2>
          <div className="flex flex-wrap gap-2">
            {resume.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="mb-6 text-3xl font-bold text-foreground">Idiomas</h2>
          <div className="space-y-4">
            <div>
              <p className="text-lg font-semibold text-foreground">Português</p>
              <p className="text-sm text-muted-foreground">Nativo</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">Inglês</p>
              <p className="text-sm text-muted-foreground">
                Inglês técnico - Capacidade de escrita e leitura de documentações técnicas
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
