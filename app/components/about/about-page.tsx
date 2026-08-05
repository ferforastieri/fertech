'use client'

import Image from 'next/image'
import {useEffect,useRef} from 'react'
import {animate,stagger} from 'animejs'
import {useTranslations} from 'next-intl'
import {SiteFrame} from '@/app/components/ui/site-frame'
import './about.css'

const paragraphs=['collaboration','fullstack','human','games'] as const
const highlights=['development','architecture','design'] as const

export function AboutPage(){
  const t=useTranslations('About')
  const root=useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if(!root.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const reveal=()=>animate(root.current!.querySelectorAll('.about-reveal'),{opacity:[0,1],y:[26,0],delay:stagger(90),duration:720,ease:'outExpo'})
    window.addEventListener('book-opened',reveal,{once:true})
    const fallback=setTimeout(reveal,1200)
    return()=>{window.removeEventListener('book-opened',reveal);clearTimeout(fallback)}
  },[])
  return <SiteFrame><div ref={root} className="editorial-page about-page">
    <header className="about-hero about-reveal"><div><p>{t('eyebrow')}</p><h1>{t('title')}</h1></div><Image src="/assets/fernando.png" alt="Fernando Forastieri" width={420} height={420} className="about-photo"/></header>
    <section className="about-copy">{paragraphs.map(key=><p className="about-reveal" key={key}>{t(`paragraphs.${key}`)}</p>)}</section>
    <section className="about-principles" aria-label={t('principles')}>{highlights.map((key,index)=><article className="about-reveal" key={key}><span>0{index+1}</span><h2>{t(`highlights.${key}.title`)}</h2><p>{t(`highlights.${key}.description`)}</p></article>)}</section>
  </div></SiteFrame>
}
