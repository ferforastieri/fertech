import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Skeleton } from '@/components/ui/feedback'
import { Article, useArticleList } from '@/api/articles/useArticleList'
import { 
  ArrowRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { useExperiencePath } from '@/contexts/experience/ExperienceContext'
import { useSiteContent } from '@/api/site/useSiteContent'

function ArticleSection({
  title,
  articles,
  countLabel,
  readTimeSuffix,
  getArticlePath,
}: {
  title: string
  articles: Article[]
  countLabel: string
  readTimeSuffix: string
  getArticlePath: (slug: string) => string
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <section className="rounded-2xl border border-border bg-card/40 p-4 shadow-sm transition-colors md:p-5">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 rounded-xl px-1 py-1 text-left transition-colors hover:text-primary"
        aria-expanded={isOpen}
      >
        <span>
          <span className="block text-2xl font-bold text-foreground">{title}</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            {articles.length} {countLabel}
          </span>
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="mt-3 divide-y divide-border/60 px-1">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={getArticlePath(article.slug)}
              className="group block py-5 first:pt-1 last:pb-1"
            >
              <div className="mb-2 flex items-start justify-between gap-4">
                <h2 className="text-2xl font-semibold text-foreground transition-colors group-hover:underline">
                  {article.title}
                </h2>
                <ArrowRightIcon className="mt-1 h-5 w-5 flex-shrink-0 text-foreground transition-all group-hover:translate-x-1" />
              </div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Badge variant="outline">
                  {article.category}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {article.date}
                </span>
                <span className="text-sm text-muted-foreground">
                  • {article.readTime} {readTimeSuffix}
                </span>
              </div>
              <p className="text-base leading-relaxed text-foreground">
                {article.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default function Blog() {
  const modePath = useExperiencePath()
  const siteContentQuery = useSiteContent()
  const copy = siteContentQuery.data
  const workArticlesQuery = useArticleList('work')
  const personalArticlesQuery = useArticleList('personal')
  const workArticles = workArticlesQuery.data ?? []
  const personalArticles = personalArticlesQuery.data ?? []
  const isLoading = workArticlesQuery.isLoading || personalArticlesQuery.isLoading || siteContentQuery.isLoading
  const hasError = workArticlesQuery.error || personalArticlesQuery.error || siteContentQuery.error

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-4 pb-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 space-y-4 text-center">
            <Skeleton className="mx-auto h-14 w-40" />
            <Skeleton className="mx-auto h-6 w-full max-w-2xl" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, sectionIndex) => (
              <div key={sectionIndex} className="rounded-lg border border-border p-5">
                <div className="mb-5 flex items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-7 w-64" />
                </div>
                <div className="space-y-5">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-3 border-t border-border pt-5 first:border-t-0 first:pt-0">
                      <Skeleton className="h-7 w-3/4" />
                      <div className="flex gap-3">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-10/12" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (hasError || !copy) {
    return (
      <div className="container mx-auto px-4 pt-4 pb-12">
        <div className="max-w-6xl mx-auto text-foreground">{copy?.blog.error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-foreground">{copy.blog.title}</h1>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            {copy.blog.description}
          </p>
        </div>

        <div className="space-y-6">
          <ArticleSection
            title={copy.blog.workTitle}
            articles={workArticles}
            countLabel={copy.common.articlesCountLabel}
            readTimeSuffix={copy.common.readTimeSuffix}
            getArticlePath={(slug) => modePath(`/blog/${slug}`)}
          />
          <ArticleSection
            title={copy.blog.personalTitle}
            articles={personalArticles}
            countLabel={copy.common.articlesCountLabel}
            readTimeSuffix={copy.common.readTimeSuffix}
            getArticlePath={(slug) => modePath(`/blog/${slug}`)}
          />
        </div>
      </div>
    </div>
  )
}
