'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { animate, createScope, createTimeline, stagger } from 'animejs'
import type { Article, HomeContent, Profile, Project, SiteContent } from '@/lib/content'

type Space='origin'|'projects'|'articles'|'trajectory'|'contact'
type ResumeData=Awaited<ReturnType<typeof import('@/lib/content').getResume>>
const spaces:Space[]=['origin','projects','articles','trajectory','contact']

export function SpatialPortfolio({profile,home,site,projects,articles,resume}:{profile:Profile;home:HomeContent;site:SiteContent;projects:Project[];articles:Article[];resume:ResumeData}){
  const [space,setSpace]=useState<Space>('origin')
  const root=useRef<HTMLElement>(null)
  const page=useRef<HTMLDivElement>(null)
  const notebook=useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if(!root.current)return
    const scope=createScope({root:root.current,mediaQueries:{reduceMotion:'(prefers-reduced-motion: reduce)'}}).add(self=>{
      if(self?.matches.reduceMotion)return
      const opening=createTimeline({defaults:{ease:'outExpo'}})
      opening
        .add('.field-kicker',{opacity:[0,1],y:[18,0],duration:700})
        .add(notebook.current!,{opacity:[0,1],y:[80,0],rotateX:[18,0],scale:[.82,1],duration:1100},'-=450')
        .add('.notebook-cover--front',{rotateY:[0,-176],duration:1450,ease:'inOutQuart'},'-=800')
        .add('.notebook-page > *',{opacity:[0,1],y:[14,0],delay:stagger(45),duration:520},'-=500')
        .add('.field-nav button',{opacity:[0,1],x:[20,0],delay:stagger(55),duration:500},'-=550')
      animate('.field-orbit',{rotate:'1turn',duration:32000,loop:true,ease:'linear'})
    })
    return()=>scope.revert()
  },[])

  useEffect(()=>{
    if(!page.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    animate(page.current,{rotateY:[-72,0],opacity:[.2,1],duration:760,ease:'outExpo'})
    animate('.page-entry',{opacity:[0,1],x:[18,0],delay:stagger(45),duration:520,ease:'outExpo'})
  },[space])

  const navigate=(next:Space)=>{if(next!==space)setSpace(next)}
  const active=spaces.indexOf(space)+1
  return <main ref={root} className="field-shell">
    <div className="field-grid" aria-hidden="true"/><div className="field-orbit" aria-hidden="true"><i/><i/><i/></div>
    <header className="field-chrome"><button onClick={()=>navigate('origin')}><b>FERTECH®</b><span>{profile.role}</span></button><p>FIELD NOTES · PORTFOLIO 2026</p><a href={profile.contactUrl}>DISPONÍVEL PARA CONVERSAR ↗</a></header>
    <div className="field-kicker"><span>CADERNO {String(active).padStart(2,'0')} / {String(spaces.length).padStart(2,'0')}</span><p>{home.heroEyebrow}</p></div>
    <section className="notebook-stage" aria-live="polite">
      <div ref={notebook} className="notebook">
        <div className="notebook-cover notebook-cover--back"/>
        <article className="notebook-page notebook-page--left">
          <span className="page-number">FERTECH / 001</span>
          <div className="identity-mark">F<span>+</span></div>
          <p className="hand-note">ideias viram<br/>produtos digitais.</p>
          <div className="left-manifesto"><small>{profile.name}</small><h1>{home.heroHeadline}</h1><p>{home.heroDescription}</p></div>
          <button className="pencil-action" onClick={()=>navigate('projects')}>{home.projectsButtonLabel} <i>→</i></button>
        </article>
        <div ref={page} key={space} className="notebook-page notebook-page--right">{renderPage(space,{profile,home,site,projects,articles,resume,navigate})}</div>
        <div className="notebook-spine" aria-hidden="true">{Array.from({length:12},(_,index)=><i key={index}/>)}</div>
        <div className="notebook-cover notebook-cover--front"><span>F</span><p>PRODUCT<br/>ENGINEERING<br/>FIELD NOTES</p><small>VOL. 01 — 2026</small></div>
      </div>
    </section>
    <nav className="field-nav" aria-label="Índice do caderno">
      <button className={space==='projects'?'active':''} onClick={()=>navigate('projects')}><span>01</span>{site.navigation.projects}</button>
      <button className={space==='articles'?'active':''} onClick={()=>navigate('articles')}><span>02</span>{site.navigation.blog}</button>
      <button className={space==='trajectory'?'active':''} onClick={()=>navigate('trajectory')}><span>03</span>{site.navigation.resume}</button>
      <button className={space==='contact'?'active':''} onClick={()=>navigate('contact')}><span>04</span>{home.contactButtonLabel}</button>
    </nav>
    <footer className="field-footer"><span>ARRASTE A IDEIA. ABRA O SISTEMA.</span><span>SP — BRASIL · {new Date().getFullYear()}</span></footer>
  </main>
}

type PageContext={profile:Profile;home:HomeContent;site:SiteContent;projects:Project[];articles:Article[];resume:ResumeData;navigate:(space:Space)=>void}
function renderPage(space:Space,{profile,home,projects,articles,resume,navigate}:PageContext){
  if(space==='projects')return <><PageHead index="01" eyebrow={home.projectsEyebrow} title={home.projectsTitle}/><div className="notebook-list project-notes">{projects.slice(0,4).map((project,index)=><Link className="page-entry" href={`/projects/${project.id}/`} key={project.id}><span>{String(index+1).padStart(2,'0')}</span><div><h2>{project.title}</h2><p>{project.groupTitle} · {project.tags.join(' / ')}</p></div><b>↗</b></Link>)}</div><p className="margin-note">seleção de sistemas<br/>desenhados + entregues</p></>
  if(space==='articles')return <><PageHead index="02" eyebrow={home.blogEyebrow} title={home.blogTitle}/><div className="notebook-list article-notes">{articles.slice(0,4).map(article=><Link className="page-entry" href={`/blog/${article.slug}/`} key={article.slug}><small>{article.category} · {article.readTime}</small><h2>{article.title}</h2><span>LER NOTA →</span></Link>)}</div></>
  if(space==='trajectory')return <><PageHead index="03" eyebrow={resume.location} title={profile.role}/><div className="notebook-list career-notes">{resume.experiences.slice(0,4).map((item:any)=><article className="page-entry" key={item.id}><span>{item.period}</span><h2>{item.company}</h2><p>{item.position}</p></article>)}</div><Link className="paper-link" href="/resume/">ABRIR TRAJETÓRIA COMPLETA ↗</Link></>
  if(space==='contact')return <div className="contact-note page-entry"><span>04 / CONTATO</span><p>{home.contactDescription}</p><h2>{home.contactTitle}</h2><a href={profile.contactUrl}>{home.contactButtonLabel} ↗</a><div>{profile.socialLinks.map(link=><a href={link.href} key={link.href}>{link.name}</a>)}</div></div>
  return <div className="origin-note"><span className="page-entry">NOTA DO AUTOR / 2026</span><blockquote className="page-entry">“Código é só o começo. O trabalho é transformar complexidade em algo que as pessoas queiram usar.”</blockquote><p className="page-entry">{profile.intro}</p><div className="tech-scribble page-entry">{profile.technologies.slice(0,7).map(item=><span key={item}>{item}</span>)}</div><button className="paper-link page-entry" onClick={()=>navigate('projects')}>VIRAR A PÁGINA →</button></div>
}

function PageHead({index,eyebrow,title}:{index:string;eyebrow:string;title:string}){return <header className="notebook-page-head page-entry"><span>{index} / INDEX</span><p>{eyebrow}</p><h2>{title}</h2></header>}
