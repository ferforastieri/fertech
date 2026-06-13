import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/config/supabase'
import { Article, ArticleKind } from './useArticles'

type ArticleRow = {
  slug: string
  title: string
  category: string
  description: string
  date: string
  read_time: string
  content: string
  kind: ArticleKind
  sort_order: number
}

function mapArticle(row: ArticleRow): Article {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    description: row.description,
    date: row.date,
    readTime: row.read_time,
    content: row.content,
    kind: row.kind,
    sortOrder: row.sort_order,
  }
}

async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('slug,title,category,description,date,read_time,content,kind,sort_order')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error

  return data ? mapArticle(data as ArticleRow) : null
}

export function useArticle(slug: string | undefined) {
  return useQuery({
    queryKey: ['articles', 'detail', slug ?? ''],
    queryFn: () => getArticleBySlug(slug ?? ''),
    enabled: Boolean(slug),
  })
}
