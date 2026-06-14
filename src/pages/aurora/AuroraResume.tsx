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
import { ResumeSectionKey, useResumeContent } from '@/api/resume/useResumeContent'
import { useProjects } from '@/api/projects/useProjects'
import { AuroraLoading } from '@/components/aurora/AuroraLoading'
import { useAuroraLoadingTransition } from '@/hooks/aurora/useAuroraLoadingTransition'
import { AuroraPageReveal } from '@/components/aurora/AuroraPageReveal'
import { generateResumePdf } from '@/api/resume/generateResumePdf'
import { useSiteContent } from '@/api/site/useSiteContent'
import { notifyError, notifySuccess } from '@/components/ui/feedback/notifications'

gsap.registerPlugin(ScrollTrigger)

export default function AuroraResume() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const profileQuery = useProfileContent()
  const resumeQuery = useResumeContent()
  const projectsQuery = useProjects()
  const siteContentQuery = useSiteContent()
  const copy = siteContentQuery.data

  const profile = profileQuery.data
  const resume = resumeQuery.data
  const projects = projectsQuery.data ?? []
  const isLoading = profileQuery.isLoading || resumeQuery.isLoading || projectsQuery.isLoading || siteContentQuery.isLoading
  const hasError = profileQuery.isError || resumeQuery.isError || projectsQuery.isError || siteContentQuery.isError
  const loadingTransition = useAuroraLoadingTransition(isLoading)

  useEffect(() => {
    if (loadingTransition.visible || !rootRef.current) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.resume-hero, .resume-reveal', { opacity: 1, y: 0 })
      })
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
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.cancelAnimationFrame(refreshFrame)
      ctx.revert()
    }
  }, [loadingTransition.visible, profile?.name, resume?.experiences.length, resume?.education.length])

  const handleDownloadPDF = async () => {
    if (!profile || !resume) return

    setIsGenerating(true)

    try {
      await generateResumePdf({ profile, resume, projects })
      if (copy) notifySuccess(copy.resume.pdfSuccess)
    } catch (error) {
      notifyError(copy?.resume.pdfError ?? '', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (loadingTransition.visible) {
    return <AuroraLoading label={copy?.resume.loading ?? ''} exiting={loadingTransition.exiting} />
  }

  if (hasError || !profile || !resume || !copy) {
    return (
      <div ref={rootRef} className="mx-auto max-w-5xl px-4 pb-24 pt-10 md:pt-32">
        <p className="text-center text-rose-500">{copy?.resume.error}</p>
      </div>
    )
  }

  const getSection = (key: ResumeSectionKey) => resume.sections.find((section) => section.key === key)
  const sectionStyle = (key: ResumeSectionKey) => ({ order: resume.sections.findIndex((section) => section.key === key) })

  return (
    <AuroraPageReveal>
    <div ref={rootRef} className="mx-auto max-w-5xl px-4 pb-24 pt-10 md:pt-32">
      <header className="resume-hero mb-14 text-center">
        <div className="mb-6 flex justify-center">
          <img src={profile.auroraLogoUrl} alt={copy.resume.logoAlt} className="h-24 w-24 object-contain" />
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
          {isGenerating ? resume.generatingLabel : resume.downloadLabel}
        </button>
      </header>

      <div className="flex flex-col gap-12">
      {getSection('about')?.enabled && <section style={sectionStyle('about')} className="resume-reveal translate-y-8 rounded-[1.75rem] border border-[rgb(var(--aurora-border))] bg-[rgb(var(--aurora-panel))] p-6 opacity-0 backdrop-blur">
        <h2 className="text-3xl font-bold text-[rgb(var(--aurora-text))]">{getSection('about')?.title}</h2>
        <div className="mt-6 space-y-4 text-[rgb(var(--aurora-muted))]">
          {resume.aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>}

      {getSection('education')?.enabled && <section style={sectionStyle('education')} className="resume-reveal translate-y-8 opacity-0">
        <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold text-[rgb(var(--aurora-text))]">
          <AcademicCapIcon className="h-8 w-8 text-rose-500" />
          {getSection('education')?.title}
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
      </section>}

      {getSection('experience')?.enabled && <section style={sectionStyle('experience')} className="resume-reveal translate-y-8 opacity-0">
        <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold text-[rgb(var(--aurora-text))]">
          <BriefcaseIcon className="h-8 w-8 text-rose-500" />
          {getSection('experience')?.title}
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
      </section>}

      {getSection('skills')?.enabled && <section style={sectionStyle('skills')} className="resume-reveal translate-y-8 rounded-[1.75rem] border border-[rgb(var(--aurora-border))] bg-[rgb(var(--aurora-panel))] p-6 opacity-0 backdrop-blur">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-[rgb(var(--aurora-text))]">
          <WrenchScrewdriverIcon className="h-8 w-8 text-rose-500" />
          {getSection('skills')?.title}
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {resume.technologies.map((tech) => (
            <span key={tech} className="rounded-full border border-[rgb(var(--aurora-border))] bg-[rgb(var(--aurora-surface))] px-3 py-1 text-sm text-[rgb(var(--aurora-muted))]">
              {tech}
            </span>
          ))}
        </div>
      </section>}

      {getSection('languages')?.enabled && <section style={sectionStyle('languages')} className="resume-reveal translate-y-8 rounded-[1.75rem] border border-[rgb(var(--aurora-border))] bg-[rgb(var(--aurora-panel))] p-6 opacity-0 backdrop-blur">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-[rgb(var(--aurora-text))]">
          <LanguageIcon className="h-8 w-8 text-rose-500" />
          {getSection('languages')?.title}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {resume.languages.map((language) => (
            <div key={language.name}>
              <p className="text-lg font-semibold text-[rgb(var(--aurora-text))]">{language.name}</p>
              <p className="text-sm text-[rgb(var(--aurora-muted))]">{language.description}</p>
            </div>
          ))}
        </div>
      </section>}

      {getSection('projects')?.enabled && <section style={sectionStyle('projects')} className="resume-reveal translate-y-8 opacity-0">
        <h2 className="text-3xl font-bold text-[rgb(var(--aurora-text))]">{getSection('projects')?.title}</h2>
        <div className="mt-6 space-y-4">
          {projects.slice(0, 6).map((project) => (
            <article key={project.id} className="border-b border-[rgb(var(--aurora-border))] pb-5 last:border-0 last:pb-0">
              <h3 className="text-xl font-bold text-[rgb(var(--aurora-text))]">{project.title}</h3>
              <p className="mt-2 text-[rgb(var(--aurora-muted))]">{project.description}</p>
              <p className="mt-3 text-sm text-rose-500">{resume.projectTechnologiesLabel}: {project.tags.join(', ')}</p>
            </article>
          ))}
        </div>
      </section>}
      </div>
    </div>
    </AuroraPageReveal>
  )
}
