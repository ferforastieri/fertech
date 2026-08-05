'use client'

import {useEffect,useRef} from 'react'
import {animate} from 'animejs'
import {useTranslations} from 'next-intl'

const experienceKeys=['smart','inet','getninjas'] as const

export function ExperienceTimeline(){
  const t=useTranslations('Experience')
  const root=useRef<HTMLElement>(null)

  useEffect(()=>{
    if(!root.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const items=root.current.querySelectorAll('.timeline-entry')
    const sectionObserver=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting)return
      animate(root.current!.querySelector('.experience-heading')!,{opacity:[0,1],y:[28,0],duration:760,ease:'outExpo'})
      animate('.timeline-spine-progress',{scaleY:[0,1],duration:950,ease:'outExpo'})
      sectionObserver.disconnect()
    },{threshold:.1})
    const itemObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return
      itemObserver.unobserve(entry.target)
      animate(entry.target,{opacity:[0,1],y:[38,0],rotateX:[5,0],duration:760,ease:'outExpo'})
    }),{threshold:.18,rootMargin:'0px 0px -8% 0px'})
    sectionObserver.observe(root.current)
    items.forEach(item=>itemObserver.observe(item))
    return()=>{sectionObserver.disconnect();itemObserver.disconnect()}
  },[])

  return <section ref={root} id="experiencia" className="experience-section" aria-labelledby="experience-title">
    <header className="experience-heading">
      <p>{t('eyebrow')}</p>
      <h2 id="experience-title">{t('title')}</h2>
    </header>
    <div className="timeline-body"><div className="timeline-spine" aria-hidden="true"><span className="timeline-spine-progress"/></div>
    <ol className="experience-timeline">{experienceKeys.map((key,index)=><li className={`timeline-entry timeline-entry--${index%2?'right':'left'}`} key={key}>
      <span className="timeline-period">{t(`${key}.period`)}</span>
      <article>
        <p>{t(`${key}.company`)}</p>
        <h3>{t(`${key}.position`)}</h3>
        <span>{t(`${key}.location`)}</span>
        <p className="timeline-summary">{t(`${key}.summary`)}</p>
        {key==='smart'&&<div className="role-progression"><span>{t('smart.junior')}</span><i aria-hidden="true">→</i><span className="is-current">{t('smart.pleno')}</span></div>}
      </article>
    </li>)}</ol></div>
  </section>
}
