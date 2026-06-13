import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  AcademicCapIcon,
  ArrowDownTrayIcon,
  BriefcaseIcon,
  CalendarIcon,
  LanguageIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { useProfileContent } from '@/api/profile/useProfileContent'
import { useResumeContent } from '@/api/resume/useResumeContent'
import { AuroraLoading } from '@/components/aurora/AuroraLoading'

gsap.registerPlugin(ScrollTrigger)

export default function AuroraResume() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const profileQuery = useProfileContent()
  const resumeQuery = useResumeContent()

  const profile = profileQuery.data
  const resume = resumeQuery.data
  const isLoading = profileQuery.isLoading || resumeQuery.isLoading
  const hasError = profileQuery.isError || resumeQuery.isError

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('.resume-hero', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        ScrollTrigger.batch('.resume-reveal', {
          start: 'top 84%',
          onEnter: (elements) => gsap.to(elements, { opacity: 1, y: 0, rotateX: 0, duration: 0.75, stagger: 0.08, ease: 'power3.out' }),
          once: true,
        })
      })
      return () => mm.revert()
    }, rootRef)

    return () => ctx.revert()
  }, [])

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
        ensureSpace(24)
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
      yPosition += 8

      sectionTitle('RESUMO PROFISSIONAL')
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      profile.aboutParagraphs.forEach((paragraph) => {
        ensureSpace(18)
        const lines = doc.splitTextToSize(paragraph, maxWidth)
        doc.text(lines, margin, yPosition)
        yPosition += lines.length * 4 + 4
      })

      sectionTitle('EXPERIÊNCIA PROFISSIONAL')
      resume.experiences.forEach((experience) => {
        ensureSpace(34)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(experience.position, margin, yPosition)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(experience.period, pageWidth - margin, yPosition, { align: 'right' })
        yPosition += 6
        doc.setFont('helvetica', 'italic')
        doc.text(`${experience.company} | ${experience.location}`, margin, yPosition)
        yPosition += 6
        experience.roles?.forEach((role) => {
          ensureSpace(12)
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.text(`• ${role.position}`, margin + 4, yPosition)
          doc.setFont('helvetica', 'normal')
          doc.text(role.period, pageWidth - margin, yPosition, { align: 'right' })
          yPosition += 5
        })
        if (experience.roles?.length) yPosition += 2
        doc.setFont('helvetica', 'normal')
        experience.responsibilities.forEach((responsibility) => {
          ensureSpace(14)
          const lines = doc.splitTextToSize(`• ${responsibility}`, maxWidth - 5)
          doc.text(lines, margin + 4, yPosition)
          yPosition += lines.length * 4 + 2
        })
        yPosition += 5
      })

      sectionTitle('FORMAÇÃO ACADÊMICA')
      resume.education.forEach((item) => {
        ensureSpace(18)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text(item.course, margin, yPosition)
        yPosition += 5
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`${item.institution} | ${item.location} | ${item.period}`, margin, yPosition)
        yPosition += 8
      })

      sectionTitle('HABILIDADES TÉCNICAS')
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const skillLines = doc.splitTextToSize(resume.technologies.join(' • '), maxWidth)
      doc.text(skillLines, margin, yPosition)
      yPosition += skillLines.length * 4 + 8

      sectionTitle('IDIOMAS')
      doc.setFontSize(10)
      doc.text('Português: Nativo', margin, yPosition)
      yPosition += 5
      doc.text('Inglês: Técnico - Capacidade de escrita e leitura de documentações técnicas', margin, yPosition)

      doc.save('CV_Fernando_Forastieri.pdf')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return <AuroraLoading label="Montando currículo" />
  }

  if (hasError || !profile || !resume) {
    return (
      <div ref={rootRef} className="mx-auto max-w-5xl px-4 pb-24 pt-32">
        <p className="text-center text-rose-500">Não foi possível carregar o currículo.</p>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="mx-auto max-w-5xl px-4 pb-24 pt-32">
      <header className="resume-hero mb-14 text-center">
        <div className="mb-6 flex justify-center">
          <img src="/logo.png" alt="Logo FF" className="h-24 w-24 object-contain" />
        </div>
        <h1 className="text-5xl font-bold text-[rgb(var(--aurora-text))] md:text-7xl">{profile.name}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-xl text-[rgb(var(--aurora-muted))]">{profile.role}</p>
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="mt-8 inline-flex items-center rounded-full bg-rose-900 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-50"
        >
          <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
          {isGenerating ? 'Gerando PDF...' : 'Baixar PDF'}
        </button>
      </header>

      <section className="resume-reveal mb-12 translate-y-8 rounded-[1.75rem] border border-[rgb(var(--aurora-border))] bg-[rgb(var(--aurora-panel))] p-6 opacity-0 backdrop-blur">
        <h2 className="text-3xl font-bold text-[rgb(var(--aurora-text))]">Sobre</h2>
        <div className="mt-6 space-y-4 text-[rgb(var(--aurora-muted))]">
          {profile.aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="resume-reveal mb-12 translate-y-8 opacity-0">
        <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold text-[rgb(var(--aurora-text))]">
          <AcademicCapIcon className="h-8 w-8 text-rose-500" />
          Educação
        </h2>
        <div className="space-y-4">
          {resume.education.map((item) => (
            <article key={item.id} className="rounded-[1.5rem] border border-[rgb(var(--aurora-border))] bg-[rgb(var(--aurora-panel))] p-6 backdrop-blur">
              <h3 className="text-xl font-bold text-[rgb(var(--aurora-text))]">{item.course}</h3>
              <p className="mt-2 text-rose-500">{item.institution}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-[rgb(var(--aurora-muted))]">
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  {item.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {item.period}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="resume-reveal mb-12 translate-y-8 opacity-0">
        <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold text-[rgb(var(--aurora-text))]">
          <BriefcaseIcon className="h-8 w-8 text-rose-500" />
          Experiência Profissional
        </h2>
        <div className="space-y-4">
          {resume.experiences.map((experience) => (
            <article key={experience.id} className="rounded-[1.5rem] border border-[rgb(var(--aurora-border))] bg-[rgb(var(--aurora-panel))] p-6 backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-[rgb(var(--aurora-text))]">{experience.position}</h3>
                  <p className="mt-1 text-rose-500">{experience.company}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-[rgb(var(--aurora-border))] px-3 py-1 text-sm text-[rgb(var(--aurora-muted))]">
                  <CalendarIcon className="h-4 w-4" />
                  {experience.period}
                </span>
              </div>
              <p className="mt-3 inline-flex items-center gap-1 text-sm text-[rgb(var(--aurora-muted))]">
                <MapPinIcon className="h-4 w-4" />
                {experience.location}
              </p>
              {experience.roles && (
                <div className="mt-5 space-y-3 border-l border-[rgb(var(--aurora-border))] pl-4">
                  {experience.roles.map((role) => (
                    <div key={`${experience.id}-${role.position}`} className="relative">
                      <span className="absolute -left-[1.35rem] top-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.55)]" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-semibold text-[rgb(var(--aurora-text))]">{role.position}</h4>
                        <span className="text-sm text-[rgb(var(--aurora-muted))]">{role.period}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <ul className="mt-5 space-y-3 text-[rgb(var(--aurora-muted))]">
                {experience.responsibilities.map((responsibility) => (
                  <li key={responsibility} className="flex items-start gap-2">
                    <span className="mt-1.5 text-rose-500">•</span>
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="resume-reveal mb-12 translate-y-8 rounded-[1.75rem] border border-[rgb(var(--aurora-border))] bg-[rgb(var(--aurora-panel))] p-6 opacity-0 backdrop-blur">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-[rgb(var(--aurora-text))]">
          <WrenchScrewdriverIcon className="h-8 w-8 text-rose-500" />
          Habilidades Técnicas
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {resume.technologies.map((tech) => (
            <span key={tech} className="rounded-full border border-[rgb(var(--aurora-border))] bg-[rgb(var(--aurora-surface))] px-3 py-1 text-sm text-[rgb(var(--aurora-muted))]">
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="resume-reveal translate-y-8 rounded-[1.75rem] border border-[rgb(var(--aurora-border))] bg-[rgb(var(--aurora-panel))] p-6 opacity-0 backdrop-blur">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-[rgb(var(--aurora-text))]">
          <LanguageIcon className="h-8 w-8 text-rose-500" />
          Idiomas
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-lg font-semibold text-[rgb(var(--aurora-text))]">Português</p>
            <p className="text-sm text-[rgb(var(--aurora-muted))]">Nativo</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-[rgb(var(--aurora-text))]">Inglês</p>
            <p className="text-sm text-[rgb(var(--aurora-muted))]">Inglês técnico - Capacidade de escrita e leitura de documentações técnicas</p>
          </div>
        </div>
      </section>
    </div>
  )
}
