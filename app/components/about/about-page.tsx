'use client'

import Image from 'next/image'
import {useRef} from 'react'
import {useTranslations} from 'next-intl'
import {SiteFrame} from '@/app/components/ui/site-frame'
import {useScrollReveal} from '@/app/hooks/use-scroll-reveal'
import './about.css'

const paragraphs=['collaboration','fullstack','human','games'] as const
const highlights=['development','architecture','design'] as const

export function AboutPage(){
  const t=useTranslations('About')
  const root=useRef<HTMLDivElement>(null)
  useScrollReveal(root,'.about-reveal')
  return <SiteFrame><div ref={root} className="editorial-page about-page">
    <header className="about-hero about-reveal"><div><p>{t('eyebrow')}</p><h1>{t('title')}</h1></div><Image src="/assets/fernando.png" alt="Fernando Forastieri" width={420} height={420} className="about-photo"/></header>
    <section className="about-copy">{paragraphs.map(key=><p className="about-reveal" key={key}>{t(`paragraphs.${key}`)}</p>)}</section>
    <section className="about-principles" aria-label={t('principles')}>{highlights.map((key,index)=><article className="about-reveal" key={key}><span>0{index+1}</span><h2>{t(`highlights.${key}.title`)}</h2><p>{t(`highlights.${key}.description`)}</p></article>)}</section>
  </div></SiteFrame>
}
