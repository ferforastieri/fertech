'use client'

import {useEffect,useRef} from 'react'
import {animate,stagger} from 'animejs'
import {useTranslations} from 'next-intl'
import {SiteFrame} from '@/app/components/ui/site-frame'
import type {Project} from './project-data'
import {RepositoryTree} from './repository-tree'
import './projects.css'

export function ProjectDetailPage({project}:{project:Project}){
  const t=useTranslations('Projects')
  const detail=useTranslations('ProjectDetail')
  const root=useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if(!root.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const reveal=()=>animate(root.current!.querySelectorAll('.detail-reveal'),{opacity:[0,1],y:[25,0],delay:stagger(90),duration:650,ease:'outExpo'})
    window.addEventListener('book-opened',reveal,{once:true})
    const fallback=setTimeout(reveal,1250)
    return()=>{window.removeEventListener('book-opened',reveal);clearTimeout(fallback)}
  },[])
  return <SiteFrame><article ref={root} className="editorial-page project-detail">
    <a className="detail-back detail-reveal" href="/projetos">← {detail('back')}</a>
    <header className="detail-header detail-reveal"><p>{t(`groups.${project.group}`)}</p><h1>{project.title}</h1><span>{t(`items.${project.id}`)}</span></header>
    <div className="detail-tags detail-reveal">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
    <section className="detail-specs detail-reveal"><div><p>{detail('services')}</p><ul>{project.services.map(service=><li key={service}>{service}</li>)}</ul></div><div><p>{detail('technologies')}</p><ul className="technology-list">{project.technologies.map(technology=><li key={technology}>{technology}</li>)}</ul></div></section>
    <section className="repository-section detail-reveal">
      <div className="repository-copy"><p>{detail('eyebrow')}</p><h2>{detail('title')}</h2><span>{detail(project.treeSource==='reconstructed'?'descriptionReconstructed':'description')}</span><code>{project.repository}</code>{project.url&&<a href={project.url} target="_blank" rel="noreferrer">{detail('visit')} ↗</a>}</div>
      <div><div className="repository-window-bar"><i/><i/><i/><span>{project.title.toLowerCase().replaceAll(' ','-')}</span></div><RepositoryTree nodes={project.tree}/></div>
    </section>
  </article></SiteFrame>
}
