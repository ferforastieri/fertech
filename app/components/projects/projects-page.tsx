'use client'

import {useEffect,useRef,useState} from 'react'
import {useTranslations} from 'next-intl'
import Link from 'next/link'
import {projects} from './project-data'
import {useScrollReveal} from '@/app/hooks/use-scroll-reveal'
import {ProjectLogo} from './project-logo'

const groups=['personal','professional'] as const
type ProjectGroup=(typeof groups)[number]

export function ProjectsPage(){
  const t=useTranslations('Projects')
  const root=useRef<HTMLDivElement>(null)
  const stage=useRef<HTMLDivElement>(null)
  const [group,setGroup]=useState<ProjectGroup>('personal')
  const [activeIndex,setActiveIndex]=useState(0)
  const items=projects.filter(project=>project.group===group).sort((a,b)=>Number(b.id==='miraj')-Number(a.id==='miraj'))
  const active=items[activeIndex]??items[0]
  const action='inline-flex items-center gap-2.5 rounded-full border border-[color-mix(in_srgb,var(--paper)_38%,transparent)] px-3 py-2.5 text-caption font-bold tracking-[.09em] text-inherit uppercase no-underline transition-[background,color,transform] duration-250 hover:-translate-y-0.5 hover:bg-paper hover:text-ink'

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

  const selectGroup=(nextGroup:ProjectGroup)=>{setGroup(nextGroup);setActiveIndex(0)}

  return <div ref={root} className="editorial-page mx-auto w-[calc(100%_-_36px)] pt-4 md:w-[min(1180px,91vw)] md:pt-[clamp(78px,9vh,108px)]">
    <header className="page-heading project-reveal grid grid-cols-1 justify-items-center gap-5 border-b border-[color-mix(in_srgb,var(--paper)_28%,transparent)] pb-[34px] text-center opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:grid-cols-[minmax(0,1fr)_minmax(260px,.42fr)] md:items-end md:justify-items-stretch md:gap-[60px] md:pb-[58px] md:text-left"><p className="col-start-1 m-0 text-label font-[750] tracking-[.2em] uppercase opacity-55 md:col-span-2">{t('eyebrow')}</p><h1 className="m-0 max-w-full [overflow-wrap:anywhere] font-display text-[clamp(45px,15vw,60px)] leading-[.84] font-normal tracking-[-.055em] md:text-[clamp(62px,10vw,148px)] md:leading-[.76]">{t('title')}</h1><span className="max-w-[36ch] text-body leading-[1.65] opacity-68 md:max-w-none md:text-[13px] md:leading-[1.8]">{t('description')}</span></header>

    <section className="project-explorer project-reveal mt-8 opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:mt-12" aria-label={t('title')}>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
        <div className="flex rounded-full border border-[color-mix(in_srgb,var(--paper)_28%,transparent)] p-1" role="group" aria-label={t('eyebrow')}>{groups.map(item=><button className={`rounded-full border-0 px-3.5 py-2 text-caption font-bold tracking-[.12em] uppercase transition-colors duration-250 ${group===item?'bg-paper text-ink':'bg-transparent text-inherit opacity-62 hover:opacity-100'}`} type="button" aria-pressed={group===item} onClick={()=>selectGroup(item)} key={item}>{t(`groups.${item}`)} <span className="ml-1 opacity-60">{String(projects.filter(project=>project.group===item).length).padStart(2,'0')}</span></button>)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(220px,.32fr)_minmax(0,1fr)]">
        <nav className="project-index flex overflow-x-auto border-y border-[color-mix(in_srgb,var(--paper)_28%,transparent)] md:max-h-[650px] md:flex-col md:overflow-x-visible md:overflow-y-auto md:border-r md:border-b" aria-label={t('title')}>{items.map((project,index)=><button className={`group/index grid min-h-[62px] min-w-[210px] grid-cols-[34px_1fr_auto] items-center gap-3 border-0 border-r border-[color-mix(in_srgb,var(--paper)_18%,transparent)] px-3 py-3 text-left text-inherit transition-[background,color] duration-250 md:min-w-0 md:border-r-0 md:border-b ${active.id===project.id?'bg-[color-mix(in_srgb,var(--paper)_12%,transparent)]':'bg-transparent hover:bg-[color-mix(in_srgb,var(--paper)_8%,transparent)]'}`} type="button" aria-pressed={active.id===project.id} onClick={()=>setActiveIndex(index)} key={project.id}><ProjectLogo id={project.id} title={project.title} framed={false} className="h-7 w-8.5"/><span className="font-display text-[19px] leading-none">{project.title}</span><span className={`text-base transition-transform duration-250 ${active.id===project.id?'translate-x-0 opacity-90':'-translate-x-1 opacity-0 group-hover/index:translate-x-0 group-hover/index:opacity-55'}`} aria-hidden="true">→</span></button>)}</nav>

        <div ref={stage} className="project-stage relative grid min-h-[540px] overflow-hidden border-b border-[color-mix(in_srgb,var(--paper)_30%,transparent)] px-4 py-7 text-center md:min-h-[650px] md:grid-cols-[minmax(160px,.38fr)_minmax(220px,.62fr)] md:grid-rows-[auto_1fr_auto] md:items-end md:gap-x-10 md:border-t md:border-l-0 md:px-8 md:py-8 md:text-left">
          <div className="project-stage-motion flex items-center justify-center gap-2 text-caption font-bold tracking-[.16em] uppercase opacity-58 md:col-start-1 md:row-start-1 md:justify-start"><i className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true"/>{t(`groups.${active.group}`)}</div>
          <span className="project-stage-motion mt-2 text-center font-display text-lg opacity-60 md:col-start-2 md:row-start-1 md:mt-0 md:text-right">{String(activeIndex+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span>

          <div className="project-stage-motion my-10 flex min-w-0 flex-col items-center self-center md:col-span-2 md:col-start-1 md:row-start-2 md:my-6">
            <ProjectLogo id={active.id} title={active.title} framed={false} className="mb-6 h-20 w-[112px] md:mb-7 md:h-27 md:w-[150px]"/>
            <h2 className="m-0 max-w-[14ch] text-center font-display text-[clamp(45px,12vw,68px)] leading-[.84] font-normal tracking-[-.045em] md:text-[clamp(62px,6.5vw,96px)]">{active.title}</h2>
          </div>

          <aside className="project-stage-motion mx-auto w-full max-w-[310px] border-t border-[color-mix(in_srgb,var(--paper)_28%,transparent)] pt-5 md:col-start-1 md:row-start-3 md:mx-0 md:max-w-[230px]" aria-label={t(`groups.${active.group}`)}><p className="m-0 text-caption font-bold tracking-[.14em] uppercase opacity-50">Stack</p><p className="mt-3 mb-0 text-small leading-[1.65] opacity-74">{active.technologies.slice(0,5).join(' · ')}</p></aside>
          <div className="project-stage-motion mx-auto mt-8 max-w-[40ch] md:col-start-2 md:row-start-3 md:mx-0 md:mt-0"><p className="m-0 text-body-sm leading-[1.7] opacity-78">{t(`items.${active.id}`)}</p><div className="mt-5 flex flex-wrap justify-center gap-2.5 md:justify-start"><Link className={action} href={`/projetos/${active.id}`}>{t('details')} <span className="font-display text-base">→</span></Link>{active.url&&<a className={action} href={active.url} target="_blank" rel="noreferrer">{t('external')} <span className="font-display text-base">↗</span></a>}</div></div>
        </div>
      </div>
    </section>
  </div>
}
