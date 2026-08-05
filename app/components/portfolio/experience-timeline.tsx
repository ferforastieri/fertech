'use client'

import {useEffect,useRef} from 'react'
import {animate,stagger} from 'animejs'
import {useTranslations} from 'next-intl'

const experienceKeys=['smart','inet','getninjas'] as const

export function ExperienceTimeline(){
  const t=useTranslations('Experience')
  const root=useRef<HTMLElement>(null)

  useEffect(()=>{
    if(!root.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const items=root.current.querySelectorAll('.timeline-entry')
    const observer=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting)return
      animate('.timeline-spine-progress',{scaleY:[0,1],duration:950,ease:'outExpo'})
      animate(items,{opacity:[0,1],y:[34,0],delay:stagger(130),duration:720,ease:'outExpo'})
      observer.disconnect()
    },{threshold:.18})
    observer.observe(root.current)
    return()=>observer.disconnect()
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
