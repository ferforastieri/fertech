'use client'

import Link from 'next/link'
import {useRef} from 'react'
import {useTranslations} from 'next-intl'
import {useScrollReveal} from '@/app/hooks/use-scroll-reveal'
import './about.css'

const paragraphs=['games','making','people'] as const
const interests=['stories','worlds','hardware','learning'] as const

export function AboutPage(){
  const t=useTranslations('About')
  const root=useRef<HTMLDivElement>(null)
  useScrollReveal(root,'.about-reveal')
  return <div ref={root} className="editorial-page about-page">
    <header className="about-hero about-reveal"><p>{t('eyebrow')}</p><h1>{t('title')}</h1><aside><span>{t('interests.stories.title')}</span><p>{t('paragraphs.writing')}</p></aside></header>
    <aside className="about-resume about-reveal"><div><p>{t('resumeEyebrow')}</p><h2>{t('resumeTitle')}</h2></div><p>{t('resumeDescription')}</p><Link href="/curriculo">{t('resumeLink')} <span aria-hidden="true">↗</span></Link></aside>
    <section className="about-copy">{paragraphs.map(key=><p className="about-reveal" key={key}>{t(`paragraphs.${key}`)}</p>)}</section>
    <section className="about-interests" aria-labelledby="about-interests-title"><header className="about-reveal"><p>{t('interestsEyebrow')}</p><h2 id="about-interests-title">{t('interestsTitle')}</h2></header><div>{interests.map(key=><article className="about-reveal" key={key}><h3>{t(`interests.${key}.title`)}</h3><p>{t(`interests.${key}.description`)}</p></article>)}</div></section>
  </div>
}
