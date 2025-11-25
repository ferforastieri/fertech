import { useParams, Link } from 'react-router-dom'
import { Separator } from '@/components/layout'
import { Badge } from '@/components/feedback'
import { Button } from '@/components/forms'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { allArticles } from '@/data/articles'
import ReactMarkdown from 'react-markdown'

export default function Article() {
  const { slug } = useParams<{ slug: string }>()
  const article = allArticles.find((a) => a.slug === slug)

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">Artigo não encontrado</h1>
          <Link to="/blog">
            <Button className="bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white">
              Voltar para Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/blog">
          <Button variant="ghost" className="mb-8 group border-2 border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black">
            <ArrowLeftIcon className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Voltar para Artigos
          </Button>
        </Link>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black">
                {article.category}
              </Badge>
              <span className="text-sm text-black dark:text-white">
                {article.readTime} de leitura
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-black dark:text-white">
              <span>{article.date}</span>
            </div>
          </header>

          <Separator className="my-8 bg-black dark:bg-white" />

          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-black dark:prose-headings:text-white prose-p:text-black dark:prose-p:text-white prose-strong:text-black dark:prose-strong:text-white prose-code:text-black dark:prose-code:text-white">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  )
}
