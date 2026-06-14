import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/config/supabase/client'
import { Article, ArticleKind } from './useArticleList'
import { localizeRow, TranslationMap } from '@/api/i18n/translations'
import { Locale, useLanguage } from '@/contexts/language/LanguageContext'

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

async function getArticleBySlug(slug: string, locale: Locale): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('slug,title,category,description,date,read_time,content,kind,sort_order,translations')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error

  return data ? mapArticle(data as ArticleRow, locale) : null
}

export function useArticleBySlug(slug: string | undefined) {
  const { locale } = useLanguage()

  return useQuery({
    queryKey: ['articles', 'detail', slug ?? '', locale],
    queryFn: () => getArticleBySlug(slug ?? '', locale),
    enabled: Boolean(slug),
  })
}
