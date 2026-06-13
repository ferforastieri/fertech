import { Link } from 'react-router-dom'
import { Accordion } from '@/components/ui/layout'
import { Badge, Skeleton } from '@/components/ui/feedback'
import { Article, useArticleList } from '@/api/articles/useArticleList'
import { 
  ArrowRightIcon,
  BriefcaseIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'
import { useExperiencePath } from '@/contexts/experience/ExperienceContext'
import { useSiteContent } from '@/api/site/useSiteContent'

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

  const renderArticles = (articles: Article[]) => (
    <div className="divide-y divide-border">
      {articles.map((article) => (
        <Link
          key={article.slug}
          to={modePath(`/blog/${article.slug}`)}
          className="block group py-5 first:pt-1 last:pb-1"
        >
          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 className="text-2xl font-semibold group-hover:underline transition-colors text-foreground">
              {article.title}
            </h2>
            <ArrowRightIcon className="h-5 w-5 text-foreground group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Badge variant="outline">
              {article.category}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {article.date}
            </span>
            <span className="text-sm text-muted-foreground">
              • {article.readTime} {copy.common.readTimeSuffix}
            </span>
          </div>
          <p className="text-base leading-relaxed text-foreground">
            {article.description}
          </p>
        </Link>
      ))}
    </div>
  )

  const accordionItems = [
    {
      value: 'work',
      trigger: (
        <div className="flex items-center gap-3">
          <BriefcaseIcon className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            {copy.blog.workTitle} ({workArticles.length})
          </span>
        </div>
      ),
      content: renderArticles(workArticles),
      defaultOpen: true,
    },
    {
      value: 'personal',
      trigger: (
        <div className="flex items-center gap-3">
          <BookOpenIcon className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            {copy.blog.personalTitle} ({personalArticles.length})
          </span>
        </div>
      ),
      content: renderArticles(personalArticles),
      defaultOpen: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 pt-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-foreground">{copy.blog.title}</h1>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            {copy.blog.description}
          </p>
        </div>

        <Accordion 
          type="multiple" 
          items={accordionItems}
          className="space-y-4"
        />
      </div>
    </div>
  )
}
