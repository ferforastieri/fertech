import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Article, useArticleList } from '@/api/articles/useArticleList'
import { AuroraLoading } from '@/components/aurora/AuroraLoading'

function ArticleList({
  title,
  articles,
}: {
  title: string
  articles: Article[]
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
          <span className="mt-1 block text-sm text-white/60">{articles.length} artigos</span>
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
                <span>{article.readTime} de leitura</span>
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
  const workArticles = workArticlesQuery.data ?? []
  const personalArticles = personalArticlesQuery.data ?? []
  const isLoading = workArticlesQuery.isLoading || personalArticlesQuery.isLoading
  const hasError = workArticlesQuery.error || personalArticlesQuery.error

  if (isLoading) {
    return <AuroraLoading label="Sincronizando artigos" />
  }

  if (hasError) {
    return <div className="mx-auto max-w-5xl px-4 pb-24 pt-32 text-white">Nao foi possivel carregar os artigos.</div>
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-32 text-white">
      <header className="mb-12 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.32em] text-rose-500">Artigos e ideias</p>
        <h1 className="mt-4 text-5xl font-bold md:text-7xl">Blog</h1>
        <p className="mt-6 text-lg leading-8 text-white/70">
          Artigos sobre desenvolvimento, tecnologia e reflexões pessoais.
        </p>
      </header>

      <div className="space-y-6">
        <ArticleList title="Artigos Profissionais" articles={workArticles} />
        <ArticleList title="Artigos Pessoais" articles={personalArticles} />
      </div>
    </div>
  )
}
