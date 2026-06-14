import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/config/supabase/client'
import { localizeRow, TranslationMap } from '@/api/i18n/translations'
import { Locale, useLanguage } from '@/contexts/language/LanguageContext'

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
  translations: TranslationMap<Article> | null
}

function mapArticle(row: ArticleRow, locale: Locale): Article {
  const base = {
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

  return localizeRow(base, row.translations, locale, `articles/${row.slug}`)
}

async function getArticles(locale: Locale, kind?: ArticleKind): Promise<Article[]> {
  let query = supabase
    .from('articles')
    .select('slug,title,category,description,date,read_time,content,kind,sort_order,translations')
    .order('sort_order', { ascending: true })

  if (kind) {
    query = query.eq('kind', kind)
  }

  const { data, error } = await query

  if (error) throw error

  return ((data ?? []) as ArticleRow[]).map((article) => mapArticle(article, locale))
}

export function useArticleList(kind?: ArticleKind) {
  const { locale } = useLanguage()

  return useQuery({
    queryKey: ['articles', 'list', kind ?? 'all', locale],
    queryFn: () => getArticles(locale, kind),
  })
}
