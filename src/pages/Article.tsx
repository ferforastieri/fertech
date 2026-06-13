import { useParams, Link } from 'react-router-dom'
import { Separator } from '@/components/ui/layout'
import { Badge, Skeleton } from '@/components/ui/feedback'
import { Button } from '@/components/ui/forms'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import ReactMarkdown from 'react-markdown'
import { useExperiencePath } from '@/contexts/experience/ExperienceContext'
import { useArticleBySlug } from '@/api/articles/useArticleBySlug'

export default function Article() {
  const { slug } = useParams<{ slug: string }>()
  const modePath = useExperiencePath()
  const { data: article, isLoading } = useArticleBySlug(slug)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-4 pb-12">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="mb-8 h-10 w-44 rounded-lg" />
          <div className="mb-8 space-y-4">
            <div className="flex gap-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-4/5" />
            <Skeleton className="h-5 w-36" />
          </div>
          <Skeleton className="my-8 h-px w-full" />
          <div className="space-y-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <Skeleton key={index} className={`h-5 ${index % 3 === 0 ? 'w-11/12' : 'w-full'}`} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 pt-4 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 text-foreground">Artigo não encontrado</h1>
          <Link to={modePath('/blog')}>
            <Button>
              Voltar para Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const contentWithoutTitle = article.content.replace(/^#\s+.*$/m, '').trim()

  return (
    <div className="container mx-auto px-4 pt-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <Link to={modePath('/blog')}>
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
            <ReactMarkdown>{contentWithoutTitle}</ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  )
}
