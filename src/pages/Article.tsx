import { useParams, Link } from 'react-router-dom'
import { Separator } from '@/components/ui/layout'
import { Badge } from '@/components/ui/feedback'
import { Button } from '@/components/ui/forms'
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
          <h1 className="text-3xl font-bold mb-4 text-foreground">Artigo não encontrado</h1>
          <Link to="/blog">
            <Button>
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
          <Button variant="ghost" className="mb-8 group">
            <ArrowLeftIcon className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Voltar para Artigos
          </Button>
        </Link>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline">
                {article.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {article.readTime} de leitura
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{article.date}</span>
            </div>
          </header>

          <Separator className="my-8" />

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  )
}
