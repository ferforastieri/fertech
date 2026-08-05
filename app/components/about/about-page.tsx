'use client'

import Link from 'next/link'
import {useRef} from 'react'
import {useTranslations} from 'next-intl'
import {siteContent} from '@/messages/site-content'
import {useScrollReveal} from '@/app/hooks/use-scroll-reveal'
import './about.css'

const paragraphs=['collaboration','fullstack','human','games'] as const
const highlights=['development','architecture','design'] as const
const facts=['education','work','specialties','interests'] as const

export function AboutPage(){
  const t=useTranslations('About')
  const root=useRef<HTMLDivElement>(null)
  useScrollReveal(root,'.about-reveal')
  return <div ref={root} className="editorial-page about-page">
    <div className="about-book-background" style={{backgroundImage:`url(${siteContent.assets.aboutBook})`}} aria-hidden="true"/>
    <header className="about-hero about-reveal"><div><p>{t('eyebrow')}</p><h1>{t('title')}</h1></div></header>
    <aside className="about-resume about-reveal"><div><p>{t('resumeEyebrow')}</p><h2>{t('resumeTitle')}</h2></div><p>{t('resumeDescription')}</p><Link href="/curriculo">{t('resumeLink')} <span aria-hidden="true">↗</span></Link></aside>
    <section className="about-details" aria-labelledby="about-details-title"><header className="about-reveal"><p>{t('detailsEyebrow')}</p><h2 id="about-details-title">{t('detailsTitle')}</h2></header><div>{facts.map(key=><article className="about-reveal" key={key}><h3>{t(`facts.${key}.title`)}</h3><p>{t(`facts.${key}.description`)}</p></article>)}</div></section>
    <section className="about-copy">{paragraphs.map(key=><p className="about-reveal" key={key}>{t(`paragraphs.${key}`)}</p>)}</section>
    <section className="about-stack about-reveal" aria-labelledby="about-stack-title"><div><p>{t('stackEyebrow')}</p><h2 id="about-stack-title">{t('stackTitle')}</h2><span>{t('stackDescription')}</span></div><ul>{siteContent.aboutStack.map(item=><li key={item}>{item}</li>)}<li>{t('stackAi')}</li></ul></section>
    <section className="about-principles" aria-label={t('principles')}>{highlights.map((key,index)=><article className="about-reveal" key={key}><span>0{index+1}</span><h2>{t(`highlights.${key}.title`)}</h2><p>{t(`highlights.${key}.description`)}</p></article>)}</section>
  </div>
}
