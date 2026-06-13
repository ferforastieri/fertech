import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useArticleBySlug } from '@/api/articles/useArticleBySlug'
import { AuroraLoading } from '@/components/aurora/AuroraLoading'
import { useAuroraLoadingTransition } from '@/hooks/aurora/useAuroraLoadingTransition'
import { AuroraPageReveal } from '@/components/aurora/AuroraPageReveal'
import { useSiteContent } from '@/api/site/useSiteContent'

export default function AuroraArticle() {
  const { slug } = useParams<{ slug: string }>()
  const { data: article, isLoading } = useArticleBySlug(slug)
  const siteContentQuery = useSiteContent()
  const copy = siteContentQuery.data
  const loadingTransition = useAuroraLoadingTransition(isLoading || siteContentQuery.isLoading)

  if (loadingTransition.visible) {
    return <AuroraLoading label={copy?.blog.loading ?? ''} exiting={loadingTransition.exiting} />
  }

  if (!article || !copy) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 text-center text-white md:pt-32">
        <h1 className="text-4xl font-bold">{copy?.blog.notFoundTitle}</h1>
        <Link to="/aurora/blog" className="mt-8 inline-flex rounded-full bg-rose-900 px-5 py-3 font-semibold text-white">
          {copy?.blog.backToBlog}
        </Link>
      </div>
    )
  }

  const contentWithoutTitle = article.content.replace(/^#\s+.*$/m, '').trim()

  return (
    <AuroraPageReveal>
    <article className="mx-auto max-w-4xl px-4 pb-24 pt-10 text-white md:pt-32">
      <Link to="/aurora/blog" className="mb-10 inline-flex items-center rounded-full border border-white/12 bg-white/8 px-4 py-2 text-white/78 backdrop-blur transition hover:bg-white/14">
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        {copy.blog.backToArticles}
      </Link>
      <header className="mb-10">
        <div className="mb-5 flex flex-wrap gap-3 text-sm text-white/52">
          <span>{article.category}</span>
          <span>{article.date}</span>
          <span>{article.readTime} {copy.common.readTimeSuffix}</span>
        </div>
        <h1 className="text-5xl font-bold leading-tight md:text-6xl">{article.title}</h1>
      </header>
      <div className="rounded-[1.75rem] border border-white/12 bg-white/[0.08] p-6 backdrop-blur md:p-10">
        <div className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-a:text-rose-500">
          <ReactMarkdown>{contentWithoutTitle}</ReactMarkdown>
        </div>
      </div>
    </article>
    </AuroraPageReveal>
  )
}
