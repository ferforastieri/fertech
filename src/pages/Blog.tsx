import { Link } from 'react-router-dom'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/layout'
import { Accordion } from '@/components/ui/layout'
import { Badge } from '@/components/ui/feedback'
import { workArticles, personalArticles } from '@/data/articles'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function Blog() {
  const renderArticles = (articles: typeof workArticles) => (
    <div className="space-y-6">
      {articles.map((article) => (
        <Link
          key={article.slug}
          to={`/blog/${article.slug}`}
          className="block group"
        >
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-black dark:border-white bg-white dark:bg-black">
            <CardHeader>
              <div className="flex items-start justify-between gap-4 mb-2">
                <CardTitle className="text-2xl group-hover:underline transition-colors text-black dark:text-white">
                  {article.title}
                </CardTitle>
                <ArrowRightIcon className="h-5 w-5 text-black dark:text-white group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className="border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black">
                  {article.category}
                </Badge>
                <span className="text-sm text-black dark:text-white">
                  {article.date}
                </span>
                <span className="text-sm text-black dark:text-white">
                  • {article.readTime} de leitura
                </span>
              </div>
              <CardDescription className="text-base leading-relaxed text-black dark:text-white">
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
      trigger: `Artigos Profissionais (${workArticles.length})`,
      content: renderArticles(workArticles),
      defaultOpen: false,
    },
    {
      value: 'personal',
      trigger: `Artigos Pessoais (${personalArticles.length})`,
      content: renderArticles(personalArticles),
      defaultOpen: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-black dark:text-white">Blog</h1>
          <p className="text-xl text-black dark:text-white max-w-2xl mx-auto">
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
