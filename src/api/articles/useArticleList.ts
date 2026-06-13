import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/config/supabase'

export type ArticleKind = 'work' | 'personal'

export type Article = {
  slug: string
  title: string
  category: string
  description: string
  date: string
  readTime: string
  content: string
  kind: ArticleKind
  sortOrder: number
}

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

async function getArticles(kind?: ArticleKind): Promise<Article[]> {
  let query = supabase
    .from('articles')
    .select('slug,title,category,description,date,read_time,content,kind,sort_order')
    .order('sort_order', { ascending: true })

  if (kind) {
    query = query.eq('kind', kind)
  }

  const { data, error } = await query

  if (error) throw error

  return ((data ?? []) as ArticleRow[]).map(mapArticle)
}

export function useArticleList(kind?: ArticleKind) {
  return useQuery({
    queryKey: ['articles', 'list', kind ?? 'all'],
    queryFn: () => getArticles(kind),
  })
}
