import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { getArticles } from '@/lib/content'

export const dynamicParams = false

export async function generateStaticParams() {
  const articles = await getArticles()
  if (!articles.length) throw new Error('Nenhum artigo encontrado no Supabase.')
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = (await getArticles()).find((item) => item.slug === slug)
  return article ? { title: article.title, description: article.description, alternates: { canonical: `/blog/${slug}/` }, openGraph: { type: 'article', title: article.title, description: article.description } } : {}
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = (await getArticles()).find((item) => item.slug === slug)
  if (!article) notFound()
  return <main className="article shell"><header><p className="eyebrow">{article.category}</p><h1>{article.title}</h1><p>{article.description}</p><small>{article.date} · {article.readTime}</small></header><article><ReactMarkdown>{article.content}</ReactMarkdown></article></main>
}
