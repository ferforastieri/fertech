import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useArticleBySlug } from '@/api/articles/useArticleBySlug'
import { AuroraLoading } from '@/components/aurora/AuroraLoading'

export default function AuroraArticle() {
  const { slug } = useParams<{ slug: string }>()
  const { data: article, isLoading } = useArticleBySlug(slug)

  if (isLoading) {
    return <AuroraLoading label="Renderizando artigo" />
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-32 text-center text-white">
        <h1 className="text-4xl font-bold">Artigo não encontrado</h1>
        <Link to="/aurora/blog" className="mt-8 inline-flex rounded-full bg-rose-900 px-5 py-3 font-semibold text-white">
          Voltar para Blog
        </Link>
      </div>
    )
  }

  const contentWithoutTitle = article.content.replace(/^#\s+.*$/m, '').trim()

  return (
    <article className="mx-auto max-w-4xl px-4 pb-24 pt-32 text-white">
      <Link to="/aurora/blog" className="mb-10 inline-flex items-center rounded-full border border-white/12 bg-white/8 px-4 py-2 text-white/78 backdrop-blur transition hover:bg-white/14">
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Voltar para artigos
      </Link>
      <header className="mb-10">
        <div className="mb-5 flex flex-wrap gap-3 text-sm text-white/52">
          <span>{article.category}</span>
          <span>{article.date}</span>
          <span>{article.readTime} de leitura</span>
        </div>
        <h1 className="text-5xl font-bold leading-tight md:text-6xl">{article.title}</h1>
      </header>
      <div className="rounded-[1.75rem] border border-white/12 bg-white/[0.08] p-6 backdrop-blur md:p-10">
        <div className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-a:text-rose-500">
          <ReactMarkdown>{contentWithoutTitle}</ReactMarkdown>
        </div>
      </div>
    </article>
  )
}
