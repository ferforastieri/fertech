'use client'

import {useTranslations} from 'next-intl'
import {TypedText} from './typed-text'

export function CornerDetails(){
  const metrics=useTranslations('Metrics')
  const profile=useTranslations('Profile')
  const items=[['3+',metrics('years')],['30+',metrics('projects')],['100%',metrics('drive')]]

  return <>
    <aside className="corner-metrics scene-item" aria-label={metrics('aria')}>{items.map(([value,label],index)=><div className="metric-line" key={label}><strong><TypedText text={value} delay={420+index*250}/></strong><TypedText className="metric-label" text={label} delay={520+index*250}/></div>)}</aside>
    <aside className="corner-profile scene-item">
      <p className="profile-signature"><TypedText text={profile('signature')} delay={350}/></p>
      <p className="profile-introduction"><TypedText text={profile('introduction')} delay={620}/></p>
      <a className="profile-contact" href="https://linkedin.com/in/fernando-forastieri" target="_blank" rel="noreferrer"><TypedText text={profile('cta')} delay={1050}/><span aria-hidden="true">↗</span></a>
    </aside>
  </>
}
