'use client'

import {useEffect,useRef} from 'react'
import {animate,stagger} from 'animejs'
import {useTranslations} from 'next-intl'
import Link from 'next/link'
import {SiteFrame} from '@/app/components/ui/site-frame'
import {projects} from './project-data'

export function ProjectsPage(){
  const t=useTranslations('Projects')
  const root=useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if(!root.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const reveal=()=>{
      animate(root.current!.querySelectorAll('.project-reveal'),{opacity:[0,1],y:[28,0],delay:stagger(70),duration:680,ease:'outExpo'})
    }
    window.addEventListener('book-opened',reveal,{once:true})
    const fallback=setTimeout(reveal,1200)
    return()=>{window.removeEventListener('book-opened',reveal);clearTimeout(fallback)}
  },[])
  return <SiteFrame><div ref={root} className="editorial-page">
    <header className="page-heading project-reveal"><p>{t('eyebrow')}</p><h1>{t('title')}</h1><span>{t('description')}</span></header>
    <div className="project-list">{projects.map((project,index)=><Link className="project-entry project-reveal" href={`/projetos/${project.id}`} key={project.id}>
      <span className="project-index">{String(index+1).padStart(2,'0')}</span>
      <div><p className="project-group">{t(`groups.${project.group}`)}</p><h2>{project.title}</h2><p className="project-description">{t(`items.${project.id}`)}</p><ul>{project.tags.map(tag=><li key={tag}>{tag}</li>)}</ul></div>
      <span className="project-open" aria-hidden="true">↗</span>
    </Link>)}</div>
  </div></SiteFrame>
}
