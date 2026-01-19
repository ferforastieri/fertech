import { Link } from 'react-router-dom'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/layout'
import { Accordion } from '@/components/ui/layout'
import { Badge } from '@/components/ui/feedback'
import { workArticles, personalArticles } from '@/data/articles'
import { 
  ArrowRightIcon,
  BriefcaseIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'

export default function Blog() {
  const renderArticles = (articles: typeof workArticles) => (
    <div className="space-y-6">
      {articles.map((article) => (
        <Link
          key={article.slug}
          to={`/blog/${article.slug}`}
          className="block group"
        >
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-start justify-between gap-4 mb-2">
                <CardTitle className="text-2xl group-hover:underline transition-colors text-foreground">
                  {article.title}
                </CardTitle>
                <ArrowRightIcon className="h-5 w-5 text-foreground group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline">
                  {article.category}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {article.date}
                </span>
                <span className="text-sm text-muted-foreground">
                  • {article.readTime} de leitura
                </span>
              </div>
              <CardDescription className="text-base leading-relaxed text-foreground">
                {article.description}
              </CardDescription>
            </CardHeader>
          </Card>
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
            Artigos Profissionais ({workArticles.length})
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
            Artigos Pessoais ({personalArticles.length})
          </span>
        </div>
      ),
      content: renderArticles(personalArticles),
      defaultOpen: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-foreground">Blog</h1>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            Artigos sobre desenvolvimento, tecnologia e reflexões pessoais
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
