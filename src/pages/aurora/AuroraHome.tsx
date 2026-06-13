import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRightIcon, CodeBracketIcon, RocketLaunchIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { ProfileHighlight, useProfileContent } from '@/api/profile/useProfileContent'
import { useProjectGroups } from '@/api/projects/useProjectGroups'
import { useProjects } from '@/api/projects/useProjects'
import { useArticleList } from '@/api/articles/useArticleList'
import { useHomeContent } from '@/api/home/useHomeContent'
import { AuroraLoading } from '@/components/aurora/AuroraLoading'
import { useAuroraLoadingTransition } from '@/hooks/aurora/useAuroraLoadingTransition'
import { AuroraPageReveal } from '@/components/aurora/AuroraPageReveal'
import { useSiteContent } from '@/api/site/useSiteContent'

gsap.registerPlugin(ScrollTrigger)

const highlightIcons = {
  code: CodeBracketIcon,
  rocket: RocketLaunchIcon,
  sparkles: SparklesIcon,
}

function getHighlightIcon(highlight: ProfileHighlight) {
  return highlightIcons[highlight.icon] ?? SparklesIcon
}

export default function AuroraHome() {
  const rootRef = useRef<HTMLDivElement>(null)
  const profileQuery = useProfileContent()
  const projectGroupsQuery = useProjectGroups()
  const projectsQuery = useProjects()
  const workArticlesQuery = useArticleList('work')
  const homeQuery = useHomeContent()
  const siteContentQuery = useSiteContent()
  const profileContent = profileQuery.data
  const homeContent = homeQuery.data
  const isLoading = profileQuery.isLoading || projectGroupsQuery.isLoading || projectsQuery.isLoading || workArticlesQuery.isLoading || homeQuery.isLoading || siteContentQuery.isLoading
  const projectGroups = projectGroupsQuery.data
  const allProjects = projectsQuery.data
  const workArticles = workArticlesQuery.data
  const loadingTransition = useAuroraLoadingTransition(isLoading)

  useEffect(() => {
    if (loadingTransition.visible || !rootRef.current) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.aurora-highlight-card, .aurora-reveal, .aurora-stack-group', { opacity: 1, y: 0 })
      })
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('.aurora-hero-line', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.08, ease: 'power4.out' })
        gsap.fromTo('.aurora-chip', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.035, delay: 0.45 })
        gsap.fromTo('.aurora-stack-group', { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.7, stagger: 0.12, delay: 0.25, ease: 'power3.out' })
        gsap.to('.aurora-stack-pulse', { scale: 1.45, opacity: 0.25, duration: 0.9, repeat: -1, yoyo: true, stagger: 0.16, ease: 'sine.inOut' })
        gsap.to('.aurora-stack-scan', { xPercent: 120, duration: 2.4, repeat: -1, ease: 'none' })
        gsap.to('.aurora-stack-group', { y: -5, duration: 1.9, repeat: -1, yoyo: true, stagger: 0.18, ease: 'sine.inOut' })
        gsap.to('.aurora-highlight-card', { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, delay: 0.55, ease: 'power3.out' })
        gsap.to('.aurora-orbit', {
          yPercent: -18,
          scrollTrigger: { trigger: '.aurora-hero', start: 'top top', end: 'bottom top', scrub: true },
        })
        ScrollTrigger.batch('.aurora-reveal', {
          start: 'top 82%',
          onEnter: (elements) => gsap.to(elements, { opacity: 1, y: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out' }),
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
  }, [loadingTransition.visible, profileContent?.name, homeContent?.heroHeadline, projectGroups?.length, allProjects?.length, workArticles?.length])

  if (loadingTransition.visible) {
    return <AuroraLoading label={siteContentQuery.data?.common.homeLoading ?? ''} exiting={loadingTransition.exiting} />
  }

  if (profileQuery.error || projectGroupsQuery.error || projectsQuery.error || workArticlesQuery.error || homeQuery.error || siteContentQuery.error || !profileContent || !homeContent || !projectGroups || !allProjects || !workArticles || !siteContentQuery.data) {
    return <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 text-white md:pt-24">{siteContentQuery.data?.common.contentLoadError}</div>
  }

  return (
    <AuroraPageReveal>
    <div ref={rootRef} className="mx-auto max-w-6xl px-4 pb-24 pt-10 text-white md:pt-24">
      <section className="aurora-hero grid items-start gap-10 pb-8 pt-0 md:pt-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="aurora-role-kicker mb-5 inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-rose-200 backdrop-blur">
            {homeContent.heroEyebrow}
          </p>
          <h1 className="overflow-hidden text-5xl font-bold leading-[0.95] md:text-7xl">
            <span className="aurora-hero-line block">{profileContent.name}</span>
            <span className="aurora-hero-line block text-rose-500">{homeContent.heroHeadline}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72">
            {homeContent.heroDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/aurora/projects" className="inline-flex items-center rounded-full bg-rose-900 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5">
              {homeContent.projectsButtonLabel}
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/aurora/resume" className="aurora-outline-action inline-flex items-center rounded-full border border-white/15 bg-white/8 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/14">
              {homeContent.resumeButtonLabel}
            </Link>
            <a
              href={profileContent.contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="aurora-outline-action inline-flex items-center rounded-full border border-white/15 bg-white/8 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/14"
            >
              {homeContent.contactButtonLabel}
            </a>
          </div>
        </div>
        <div className="aurora-orbit relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.14] p-5 shadow-2xl shadow-rose-950/45 backdrop-blur-xl">
          <span className="aurora-stack-scan pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-rose-500/15 to-transparent" />
          <div className="divide-y divide-white/10">
            {homeContent.stackGroups.map((group) => (
              <div key={group.title} className="aurora-stack-group py-4 first:pt-0 last:pb-0">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="relative h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_14px_rgba(159,18,57,0.8)]">
                    <span className="aurora-stack-pulse absolute inset-0 rounded-full bg-rose-500" />
                  </span>
                  {group.title}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((tech) => (
                    <span key={tech} className="aurora-chip inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm text-white/82">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500/80" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 py-6 md:grid-cols-3">
        {profileContent.highlights.map((highlight) => {
          const Icon = getHighlightIcon(highlight)
          return (
            <article key={highlight.title} className="aurora-highlight-card rounded-[1.75rem] border border-white/12 bg-white/[0.07] p-6 opacity-0 translate-y-8 backdrop-blur">
              <Icon className="mb-7 h-8 w-8 text-rose-500" />
              <h2 className="text-2xl font-bold">{highlight.title}</h2>
              <p className="mt-4 leading-7 text-white/68">{highlight.description}</p>
            </article>
          )
        })}
      </section>

      <section className="grid gap-10 py-12 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-rose-500">{homeContent.auroraAboutEyebrow}</p>
          <h2 className="mt-4 text-4xl font-bold">{homeContent.auroraAboutTitle}</h2>
        </div>
        <div className="space-y-5 text-lg leading-8 text-white/72">
          {profileContent.aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="aurora-reveal mb-8 flex flex-col justify-between gap-4 opacity-0 translate-y-8 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-rose-500">{homeContent.projectsEyebrow}</p>
            <h2 className="mt-4 text-4xl font-bold">{homeContent.projectsTitle}</h2>
          </div>
          <Link to="/aurora/projects" className="inline-flex items-center text-rose-400">
            {homeContent.projectsLinkLabel}
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {projectGroups.slice(0, 4).map((group) => (
            <div key={group.id} className="aurora-reveal rounded-[1.5rem] border border-white/12 bg-white/[0.07] p-5 opacity-0 translate-y-8 backdrop-blur">
              <span className="text-4xl font-bold text-rose-500">{group.projects.length}</span>
              <h3 className="mt-4 font-semibold">{group.title}</h3>
            </div>
          ))}
          <div className="aurora-reveal rounded-[1.5rem] border border-white/12 bg-white/[0.07] p-5 opacity-0 translate-y-8 backdrop-blur md:col-span-4">
            <span className="text-4xl font-bold text-rose-500">{allProjects.length}</span>
            <h3 className="mt-4 font-semibold">{homeContent.projectsTotalLabel}</h3>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="aurora-reveal mb-8 opacity-0 translate-y-8">
          <p className="text-sm uppercase tracking-[0.32em] text-rose-500">{homeContent.blogEyebrow}</p>
          <h2 className="mt-4 text-4xl font-bold">{homeContent.blogTitle}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {workArticles.slice(0, 2).map((article) => (
            <Link key={article.slug} to={`/aurora/blog/${article.slug}`} className="aurora-reveal rounded-[1.5rem] border border-white/12 bg-white/[0.07] p-6 opacity-0 translate-y-8 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.11]">
              <span className="text-sm text-white/52">{article.date} | {article.readTime}</span>
              <h3 className="mt-3 text-2xl font-bold">{article.title}</h3>
              <p className="mt-4 leading-7 text-white/68">{article.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="aurora-reveal py-12 opacity-0 translate-y-8">
        <div className="rounded-[1.75rem] border border-white/12 bg-white/[0.08] p-8 text-center backdrop-blur md:p-12">
          <h2 className="text-3xl font-bold text-white">{homeContent.contactTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/72">
            {homeContent.contactDescription}
          </p>
          <a
            href={profileContent.contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center rounded-full bg-rose-900 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5"
          >
            <span className="mr-2">X</span>
            {homeContent.contactButtonLabel}
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
    </AuroraPageReveal>
  )
}
