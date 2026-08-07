'use client'

import {useEffect,useRef} from 'react'
import {useTranslations} from 'next-intl'
import Link from 'next/link'
import type {NavPosition} from '@/app/components/ui/preferences-provider'

const experienceKeys=['smart','inet','getninjas'] as const

export function ExperienceTimeline({navPosition}:{navPosition:NavPosition}){
  const t=useTranslations('Experience')
  const root=useRef<HTMLElement>(null)

  useEffect(()=>{
    if(!root.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const items=root.current.querySelectorAll('.timeline-entry,.experience-resume')
    const sectionObserver=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting)return
      root.current!.querySelector<HTMLElement>('.experience-heading')?.animate([{opacity:0,transform:'translateY(28px)'},{opacity:1,transform:'translateY(0)'}],{duration:760,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'})
      root.current!.querySelector<HTMLElement>('.timeline-spine-progress')?.animate([{transform:'scaleY(0)'},{transform:'scaleY(1)'}],{duration:950,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'})
      sectionObserver.disconnect()
    },{threshold:.1})
    const itemObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return
      itemObserver.unobserve(entry.target)
      ;(entry.target as HTMLElement).animate([{opacity:0,transform:'translateY(38px) rotateX(5deg)'},{opacity:1,transform:'translateY(0) rotateX(0)'}],{duration:760,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'})
    }),{threshold:.18,rootMargin:'0px 0px -8% 0px'})
    sectionObserver.observe(root.current)
    items.forEach(item=>itemObserver.observe(item))
    return()=>{sectionObserver.disconnect();itemObserver.disconnect()}
  },[])

  return <section ref={root} id="experiencia" className={`experience-section relative min-h-0 px-[18px] pt-4 pb-6 md:min-h-svh md:px-[4.5vw] md:pt-[clamp(110px,14vh,170px)] md:pb-[120px] ${navPosition==='top'?'scroll-mt-[52px] md:scroll-mt-0':''}`} aria-labelledby="experience-title">
    <header className="experience-heading mx-auto mb-4 max-w-[540px] text-center opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:mb-20 md:max-w-[720px]">
      <p className="m-0 text-label font-bold tracking-[.2em] uppercase opacity-58">{t('eyebrow')}</p>
      <h2 className="mt-2 mb-0 font-display text-[clamp(48px,7vw,104px)] leading-[.88] font-normal tracking-[-.045em] md:mt-3.5" id="experience-title">{t('title')}</h2>
    </header>
    <div className="timeline-body relative mx-auto ml-0 max-w-[1060px] md:mx-auto"><div className="timeline-spine absolute top-1.5 bottom-1.5 left-1 w-px bg-[color-mix(in_srgb,var(--paper)_15%,transparent)] md:left-1/2" aria-hidden="true"><span className="timeline-spine-progress block h-full w-full origin-top bg-paper"/></div>
    <ol className="experience-timeline grid list-none gap-4 py-0 pr-0 pl-[30px] md:m-0 md:gap-[70px] md:p-0">{experienceKeys.map((key,index)=>{const right=index%2===1;return <li className={`timeline-entry timeline-entry--${right?'right':'left'} relative grid w-full grid-cols-1 items-start p-0 text-left opacity-0 after:absolute after:top-[5px] after:left-[-26px] after:h-[9px] after:w-[9px] after:rounded-full after:border-2 after:border-paper after:bg-ink after:content-[''] motion-reduce:opacity-100 motion-reduce:transform-none md:grid-cols-[minmax(0,1fr)_70px_minmax(0,1fr)] md:after:top-[7px] md:after:left-1/2 md:after:-translate-x-1/2 ${right?'md:text-left':'md:text-right'}`} key={key}>
      <span className={`timeline-period mb-[11px] font-display text-[17px] leading-none opacity-62 md:row-start-1 md:mb-0 ${right?'md:col-start-1 md:pr-[25px] md:text-right':'md:col-start-3 md:pl-[25px] md:text-left'}`}>{t(`${key}.period`)}</span>
      <article className={`col-start-1 row-auto p-0 text-left md:row-start-1 ${right?'md:col-start-3 md:pl-[25px]':'md:col-start-1 md:pr-[25px] md:text-right'}`}>
        <p className="m-0 mb-2 text-label font-[750] tracking-[.16em] uppercase opacity-56">{t(`${key}.company`)}</p>
        <h3 className="m-0 font-display text-[clamp(29px,3vw,43px)] leading-[.95] font-normal">{t(`${key}.position`)}</h3>
        <span className="mt-[9px] block text-label tracking-[.1em] uppercase opacity-50">{t(`${key}.location`)}</span>
        <p className="timeline-summary mt-2.5 mb-0 text-body leading-[1.7] opacity-70 md:mt-[18px]">{t(`${key}.summary`)}</p>
        {key==='smart'&&<div className={`role-progression mt-2.5 flex flex-wrap items-center justify-start gap-2 text-caption font-bold tracking-[.08em] uppercase md:mt-[18px] ${right?'md:justify-start':'md:justify-end'}`}><span className="rounded-full border border-[color-mix(in_srgb,var(--paper)_28%,transparent)] px-[9px] py-1.5 opacity-62">{t('smart.junior')}</span><i className="font-display text-base not-italic opacity-42" aria-hidden="true">→</i><span className="rounded-full border border-paper bg-paper px-[9px] py-1.5 text-ink opacity-100">{t('smart.pleno')}</span></div>}
      </article>
    </li>})}</ol></div>
    <Link className="experience-resume group relative mx-auto mt-9 flex max-w-[720px] flex-col items-center gap-y-1.5 border-t border-[color-mix(in_srgb,var(--paper)_34%,transparent)] px-14 py-5 text-center text-inherit no-underline opacity-0 focus-visible:outline focus-visible:outline-offset-5 focus-visible:outline-current md:mt-[90px] md:gap-y-[7px] md:border-b md:px-16 md:py-6" href="/curriculo"><span className="m-0 text-caption font-[720] tracking-[.16em] uppercase opacity-52">{t('resumeHint')}</span><strong className="font-display text-[28px] leading-[.95] font-normal md:text-[clamp(27px,3vw,40px)]">{t('resumeCta')}</strong><i className="absolute top-1/2 right-4 -translate-y-1/2 font-display text-[35px] not-italic transition-transform duration-250 group-hover:translate-x-1 group-hover:-translate-y-[calc(50%+4px)] md:right-7" aria-hidden="true">↗</i></Link>
  </section>
}
