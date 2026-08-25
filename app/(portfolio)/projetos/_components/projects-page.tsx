'use client'

import {useEffect,useRef,useState} from 'react'
import {useTranslations} from 'next-intl'
import Link from 'next/link'
import {projects} from '@/messages/project-data'
import {useScrollReveal} from '@/app/hooks/use-scroll-reveal'
import {ProjectLogo} from './project-logo'

const groups=['personal','professional'] as const
type ProjectGroup=(typeof groups)[number]

export function ProjectsPage(){
  const t=useTranslations('Projects')
  const root=useRef<HTMLDivElement>(null)
  const stage=useRef<HTMLDivElement>(null)
  const projectIndex=useRef<HTMLElement>(null)
  const [group,setGroup]=useState<ProjectGroup>('personal')
  const [activeIndex,setActiveIndex]=useState(0)
  const items=projects.filter(project=>project.group===group).sort((a,b)=>Number(b.id==='miraj')-Number(a.id==='miraj'))
  const active=items[activeIndex]??items[0]
  const action='inline-flex items-center gap-3 rounded-full border border-[color-mix(in_srgb,var(--paper)_38%,transparent)] px-4 py-3 text-label font-bold tracking-[.09em] text-inherit uppercase no-underline transition-[background,color,transform] duration-250 hover:-translate-y-0.5 hover:bg-paper hover:text-ink'

  useScrollReveal(root,'.project-reveal')

  useEffect(()=>{
    const container=stage.current
    if(!container||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const motions=Array.from(container.querySelectorAll<HTMLElement>('.project-stage-motion')).map((element,index)=>element.animate([
      {opacity:0,transform:'translate3d(0,18px,0) scale(.985)',filter:'blur(7px)'},
      {opacity:1,transform:'translate3d(0,0,0) scale(1)',filter:'blur(0)'},
    ],{duration:620,delay:index*45,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}))
    return()=>motions.forEach(motion=>motion.cancel())
  },[active?.id])

  const selectGroup=(nextGroup:ProjectGroup)=>{setGroup(nextGroup);setActiveIndex(0);requestAnimationFrame(()=>projectIndex.current?.scrollTo({top:0,left:0,behavior:'smooth'}))}
  const selectProject=(index:number)=>{setActiveIndex(index);if(matchMedia('(max-width: 767px)').matches)requestAnimationFrame(()=>stage.current?.scrollIntoView({behavior:'smooth',block:'start'}))}

  return <div ref={root} className="editorial-page mx-auto w-[calc(100%_-_36px)] pt-4 md:w-[min(1180px,91vw)] md:pt-[clamp(78px,9vh,108px)]">
    <header className="page-heading project-reveal grid grid-cols-1 justify-items-center gap-5 border-b border-[color-mix(in_srgb,var(--paper)_28%,transparent)] pb-[34px] text-center opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:grid-cols-[minmax(0,1fr)_minmax(260px,.42fr)] md:items-end md:justify-items-stretch md:gap-[60px] md:pb-[58px] md:text-left"><p className="col-start-1 m-0 text-label font-[750] tracking-[.2em] uppercase opacity-55 md:col-span-2">{t('eyebrow')}</p><h1 className="m-0 max-w-[11ch] [overflow-wrap:anywhere] font-display text-[clamp(40px,12vw,54px)] leading-[.88] font-normal tracking-[-.045em] md:text-[clamp(58px,7.4vw,108px)] md:leading-[.8]">{t('title')}</h1><span className="max-w-[36ch] text-body leading-[1.65] opacity-68 md:max-w-none md:text-[13px] md:leading-[1.8]">{t('description')}</span></header>

    <section className="project-explorer project-reveal mt-5 opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:mt-6" aria-label={t('title')}>
      <div className="mb-4 flex items-center justify-center md:justify-start" role="group" aria-label={t('eyebrow')}><div className="flex overflow-hidden rounded-full border border-[color-mix(in_srgb,var(--paper)_48%,transparent)]">{groups.map((item,index)=><button className={`border-y-0 border-r-0 px-3.5 py-2 text-caption font-bold tracking-[.12em] uppercase transition-colors duration-250 ${index?(group===item?'border-l border-ink':'border-l border-[color-mix(in_srgb,var(--paper)_68%,transparent)]'):'border-l-0'} ${group===item?'bg-paper text-ink':'bg-transparent text-inherit opacity-72 hover:opacity-100'}`} type="button" aria-pressed={group===item} onClick={()=>selectGroup(item)} key={item}>{t(`groups.${item}`)} <span className="ml-1 opacity-65">{String(projects.filter(project=>project.group===item).length).padStart(2,'0')}</span></button>)}</div></div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(270px,.38fr)_minmax(0,1fr)]">
        <nav ref={projectIndex} className="project-index flex max-h-[304px] flex-col overflow-y-auto border-y border-[color-mix(in_srgb,var(--paper)_28%,transparent)] md:h-[576px] md:max-h-[576px] md:overflow-x-visible md:border-t-0 md:border-r" aria-label={t('title')}>{items.map((project,index)=><Link className={`group/index grid min-h-[72px] w-full shrink-0 grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3 border-x-0 border-t-0 border-b border-[color-mix(in_srgb,var(--paper)_20%,transparent)] px-3.5 py-3 text-left text-inherit no-underline transition-[background,color,box-shadow] duration-250 md:flex md:gap-4 ${active.id===project.id?'bg-[color-mix(in_srgb,var(--paper)_18%,transparent)] shadow-[inset_4px_0_0_var(--paper)] md:bg-[color-mix(in_srgb,var(--paper)_12%,transparent)] md:shadow-none':'bg-transparent hover:bg-[color-mix(in_srgb,var(--paper)_8%,transparent)]'}`} href={`/projetos/${project.id}`} aria-current={active.id===project.id?'true':undefined} onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();selectProject(index)}} key={project.id}><ProjectLogo id={project.id} title={project.title} framed={false} compact className="shrink-0"/><span className="inline-flex min-h-8 min-w-0 items-center self-center font-display text-[22px] leading-none md:flex-1 md:text-[23px]">{project.title}</span><span className={`font-display text-lg tabular-nums md:hidden ${active.id===project.id?'opacity-100':'opacity-48'}`} aria-hidden="true">{active.id===project.id?'↓':String(index+1).padStart(2,'0')}</span><span className={`ml-auto hidden shrink-0 self-center text-lg transition-transform duration-250 md:block ${active.id===project.id?'translate-x-0 opacity-90':'-translate-x-1 opacity-0 group-hover/index:translate-x-0 group-hover/index:opacity-55'}`} aria-hidden="true">→</span></Link>)}</nav>

        <div ref={stage} className="project-stage relative grid min-h-[540px] content-start overflow-hidden border-b border-[color-mix(in_srgb,var(--paper)_30%,transparent)] px-5 py-7 text-center md:h-[576px] md:min-h-0 md:px-10 md:py-0 md:text-left">
          <div className="-mx-5 -mt-7 mb-4 flex items-center justify-between border-y border-[color-mix(in_srgb,var(--paper)_28%,transparent)] bg-[color-mix(in_srgb,var(--paper)_10%,transparent)] px-5 py-3 text-caption font-bold tracking-[.14em] uppercase md:hidden"><span>{t('selected')}</span><span className="font-display text-xl leading-none" aria-hidden="true">↓</span></div>
          <div className="project-stage-motion flex min-h-[456px] w-full min-w-0 max-w-[820px] flex-col justify-self-center pt-4 pb-5 md:h-[576px] md:min-h-[576px] md:py-4">
            <div className="grid items-center justify-items-center gap-6 md:grid-cols-[120px_minmax(0,1fr)] md:justify-items-stretch md:gap-8"><ProjectLogo id={active.id} title={active.title} framed={false} preview/><h2 className="m-0 max-w-[14ch] [overflow-wrap:anywhere] font-display text-[clamp(47px,11vw,68px)] leading-[.86] font-normal tracking-[-.045em] md:text-[clamp(58px,5.5vw,80px)]">{active.title}</h2></div>
            <div className="mt-9 grid border-t border-[color-mix(in_srgb,var(--paper)_28%,transparent)] pt-7 md:grid-cols-[minmax(0,1fr)_240px] md:gap-9">
              <div><p className="m-0 text-body leading-[1.75] opacity-84">{t(`items.${active.id}`)}</p><div className="mt-7 mb-6 flex flex-wrap justify-center gap-3 md:justify-start"><Link className={action} href={`/projetos/${active.id}`}>{t('details')} <span className="font-display text-lg">→</span></Link>{active.url&&<a className={action} href={active.url} target="_blank" rel="noreferrer">{t('external')} <span className="font-display text-lg">↗</span></a>}</div></div>
              <aside className="mt-7 border-t border-[color-mix(in_srgb,var(--paper)_22%,transparent)] pt-6 pb-8 md:mt-0 md:border-t-0 md:border-l md:pt-0 md:pb-7 md:pl-7" aria-label={t(`groups.${active.group}`)}><p className="m-0 text-label font-bold tracking-[.14em] uppercase opacity-62">Stack</p><ul className="mt-4 mb-0 flex list-none flex-wrap justify-center gap-2 p-0 md:justify-start">{active.technologies.slice(0,5).map(technology=><li className="content-chip max-w-full rounded-full px-3 py-2 text-caption leading-none" key={technology}>{technology}</li>)}</ul></aside>
            </div>
            <section className="mt-auto border-t border-[color-mix(in_srgb,var(--paper)_28%,transparent)] pt-5 text-left" aria-label={t('scope')}><p className="m-0 text-label font-bold tracking-[.14em] uppercase opacity-62">{t('scope')}</p><ul className="mt-3 mb-0 grid list-none grid-cols-1 gap-x-7 p-0 sm:grid-cols-2">{active.services.slice(0,4).map((service,index)=><li className="grid grid-cols-[24px_minmax(0,1fr)] items-baseline gap-2 border-t border-[color-mix(in_srgb,var(--paper)_16%,transparent)] py-2 text-body-sm leading-[1.45]" key={service}><span className="font-display text-base tabular-nums opacity-42" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><span className="opacity-78">{service}</span></li>)}</ul></section>
          </div>
        </div>
      </div>
    </section>
  </div>
}
