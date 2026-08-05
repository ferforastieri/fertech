'use client'

import {useRef} from 'react'
import {useTranslations} from 'next-intl'
import {useScrollReveal} from '@/app/hooks/use-scroll-reveal'
import './resume.css'

const experiences=['smart','inet','getninjas'] as const
const education=['ai','computer','systems'] as const
const skillGroups={frontend:['React','Next.js','React Native','TypeScript','Design Systems'],backend:['Node.js','NestJS','Express','REST APIs','WebSockets'],data:['PostgreSQL','MongoDB','MySQL','Firebase'],delivery:['Docker','Git','Testes','Infraestrutura','Redes']} as const

export function ResumePage(){
  const t=useTranslations('Resume')
  const root=useRef<HTMLElement>(null)
  useScrollReveal(root,'.resume-reveal')
  return <main ref={root} className="editorial-page resume-page">
    <header className="resume-header resume-reveal">
      <p>{t('eyebrow')}</p>
      <h1>{t('title')}</h1>
      <div><strong>{t('role')}</strong><span>{t('location')}</span></div>
      <nav aria-label={t('contact')}><a href="mailto:fernandoforastieri2@gmail.com">E-mail ↗</a><a href="https://linkedin.com/in/fernando-forastieri" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/ferforastieri" target="_blank" rel="noreferrer">GitHub ↗</a></nav>
    </header>

    <section className="resume-summary resume-reveal"><p>{t('summaryEyebrow')}</p><h2>{t('summary')}</h2></section>

    <section className="resume-section" aria-labelledby="resume-experience">
      <header className="resume-section-title resume-reveal"><p>01</p><h2 id="resume-experience">{t('experience')}</h2></header>
      <div className="resume-experience-list">{experiences.map(key=><article className="resume-experience resume-reveal" key={key}><div><span>{t(`experiences.${key}.period`)}</span><small>{t(`experiences.${key}.location`)}</small></div><div><p>{t(`experiences.${key}.company`)}</p><h3>{t(`experiences.${key}.role`)}</h3><span>{t(`experiences.${key}.description`)}</span></div></article>)}</div>
    </section>

    <section className="resume-section resume-section--split" aria-labelledby="resume-education">
      <header className="resume-section-title resume-reveal"><p>02</p><h2 id="resume-education">{t('education')}</h2></header>
      <div className="resume-education-list">{education.map(key=><article className="resume-reveal" key={key}><span>{t(`educationItems.${key}.period`)}</span><h3>{t(`educationItems.${key}.course`)}</h3><p>{t(`educationItems.${key}.school`)}</p></article>)}</div>
    </section>

    <section className="resume-section resume-section--split" aria-labelledby="resume-skills">
      <header className="resume-section-title resume-reveal"><p>03</p><h2 id="resume-skills">{t('skills')}</h2></header>
      <div className="resume-skills">{Object.entries(skillGroups).map(([group,items])=><article className="resume-reveal" key={group}><h3>{t(`skillGroups.${group}`)}</h3><ul>{items.map(item=><li key={item}>{item}</li>)}</ul></article>)}</div>
    </section>

    <footer className="resume-footer resume-reveal"><p>{t('languages')}</p><strong>{t('languageValue')}</strong><a href="mailto:fernandoforastieri2@gmail.com">{t('cta')} ↗</a></footer>
  </main>
}
