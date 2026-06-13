import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Article, useArticleList } from '@/api/articles/useArticleList'
import { AuroraLoading } from '@/components/aurora/AuroraLoading'
import { useAuroraLoadingTransition } from '@/hooks/aurora/useAuroraLoadingTransition'
import { AuroraPageReveal } from '@/components/aurora/AuroraPageReveal'
import { useSiteContent } from '@/api/site/useSiteContent'

function ArticleList({
  title,
  articles,
  countLabel,
  readTimeSuffix,
}: {
  title: string
  articles: Article[]
  countLabel: string
  readTimeSuffix: string
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <section className="rounded-[1.5rem] border border-white/12 bg-white/[0.07] p-6 backdrop-blur">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <span>
          <span className="block text-2xl font-bold text-white">{title}</span>
          <span className="mt-1 block text-sm text-white/60">{articles.length} {countLabel}</span>
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 shrink-0 text-rose-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="mt-5 divide-y divide-white/10">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={`/aurora/blog/${article.slug}`}
              className="group block py-5 first:pt-0 last:pb-0"
            >
              <div className="mb-3 flex flex-wrap gap-3 text-sm text-white/50">
                <span>{article.category}</span>
                <span>{article.date}</span>
                <span>{article.readTime} {readTimeSuffix}</span>
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:text-rose-400">{article.title}</h3>
              <p className="mt-3 max-w-3xl leading-7 text-white/68">{article.description}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default function AuroraBlog() {
  const workArticlesQuery = useArticleList('work')
  const personalArticlesQuery = useArticleList('personal')
  const siteContentQuery = useSiteContent()
  const copy = siteContentQuery.data
  const workArticles = workArticlesQuery.data ?? []
  const personalArticles = personalArticlesQuery.data ?? []
  const isLoading = workArticlesQuery.isLoading || personalArticlesQuery.isLoading || siteContentQuery.isLoading
  const hasError = workArticlesQuery.error || personalArticlesQuery.error || siteContentQuery.error
  const loadingTransition = useAuroraLoadingTransition(isLoading)

  if (loadingTransition.visible) {
    return <AuroraLoading label={copy?.blog.loading ?? ''} exiting={loadingTransition.exiting} />
  }

  if (hasError || !copy) {
    return <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 text-white md:pt-32">{copy?.blog.error}</div>
  }

  return (
    <AuroraPageReveal>
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 text-white md:pt-32">
      <header className="mb-12 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.32em] text-rose-500">{copy.blog.auroraEyebrow}</p>
        <h1 className="mt-4 text-5xl font-bold md:text-7xl">{copy.blog.title}</h1>
        <p className="mt-6 text-lg leading-8 text-white/70">
          {copy.blog.description}
        </p>
      </header>

      <div className="space-y-6">
        <ArticleList title={copy.blog.workTitle} articles={workArticles} countLabel={copy.common.articlesCountLabel} readTimeSuffix={copy.common.readTimeSuffix} />
        <ArticleList title={copy.blog.personalTitle} articles={personalArticles} countLabel={copy.common.articlesCountLabel} readTimeSuffix={copy.common.readTimeSuffix} />
      </div>
    </div>
    </AuroraPageReveal>
  )
}
