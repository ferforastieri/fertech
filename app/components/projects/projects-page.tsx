'use client'

import {useRef} from 'react'
import {useTranslations} from 'next-intl'
import Link from 'next/link'
import {SiteFrame} from '@/app/components/ui/site-frame'
import {projects} from './project-data'
import {useScrollReveal} from '@/app/hooks/use-scroll-reveal'
import './projects.css'

export function ProjectsPage(){
  const t=useTranslations('Projects')
  const root=useRef<HTMLDivElement>(null)
  useScrollReveal(root,'.project-reveal')
  const columns=(['personal','professional'] as const).map(group=>({group,items:projects.filter(project=>project.group===group)}))
  return <SiteFrame><div ref={root} className="editorial-page">
    <header className="page-heading project-reveal"><p>{t('eyebrow')}</p><h1>{t('title')}</h1><span>{t('description')}</span></header>
    <div className="project-columns">{columns.map(column=><section className="project-column" key={column.group}><header className="project-reveal"><h2>{t(`groups.${column.group}`)}</h2><span>{String(column.items.length).padStart(2,'0')}</span></header><div>{column.items.map((project,index)=><article className="project-entry project-reveal" key={project.id}>
      <span className="project-index">{String(index+1).padStart(2,'0')}</span>
      <div><h3>{project.title}</h3><p className="project-description">{t(`items.${project.id}`)}</p><ul>{project.tags.map(tag=><li key={tag}>{tag}</li>)}</ul><div className="project-actions"><Link href={`/projetos/${project.id}`}>{t('details')} <span>→</span></Link>{project.url&&<a href={project.url} target="_blank" rel="noreferrer">{t('external')} <span>↗</span></a>}</div></div>
    </article>)}</div></section>)}</div>
  </div></SiteFrame>
}
