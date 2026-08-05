'use client'

import Image from 'next/image'
import {useRef} from 'react'
import {useTranslations} from 'next-intl'
import {SiteFrame} from '@/app/components/ui/site-frame'
import {useScrollReveal} from '@/app/hooks/use-scroll-reveal'
import './about.css'

const paragraphs=['collaboration','fullstack','human','games'] as const
const highlights=['development','architecture','design'] as const
const facts=['education','work','specialties','interests'] as const
const stack=['React','Next.js','TypeScript','Node.js','NestJS','React Native','PostgreSQL','Docker','Design Systems']

export function AboutPage(){
  const t=useTranslations('About')
  const root=useRef<HTMLDivElement>(null)
  useScrollReveal(root,'.about-reveal')
  return <SiteFrame><div ref={root} className="editorial-page about-page">
    <header className="about-hero about-reveal"><div><p>{t('eyebrow')}</p><h1>{t('title')}</h1></div><Image src="/assets/fernando.png" alt="Fernando Forastieri" width={420} height={420} className="about-photo"/></header>
    <section className="about-copy">{paragraphs.map(key=><p className="about-reveal" key={key}>{t(`paragraphs.${key}`)}</p>)}</section>
    <section className="about-details" aria-labelledby="about-details-title"><header className="about-reveal"><p>{t('detailsEyebrow')}</p><h2 id="about-details-title">{t('detailsTitle')}</h2></header><div>{facts.map(key=><article className="about-reveal" key={key}><h3>{t(`facts.${key}.title`)}</h3><p>{t(`facts.${key}.description`)}</p></article>)}</div></section>
    <section className="about-stack about-reveal" aria-labelledby="about-stack-title"><div><p>{t('stackEyebrow')}</p><h2 id="about-stack-title">{t('stackTitle')}</h2><span>{t('stackDescription')}</span></div><ul>{stack.map(item=><li key={item}>{item}</li>)}<li>{t('stackAi')}</li></ul></section>
    <section className="about-principles" aria-label={t('principles')}>{highlights.map((key,index)=><article className="about-reveal" key={key}><span>0{index+1}</span><h2>{t(`highlights.${key}.title`)}</h2><p>{t(`highlights.${key}.description`)}</p></article>)}</section>
  </div></SiteFrame>
}
