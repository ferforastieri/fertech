'use client'

import {useTranslations} from 'next-intl'

export function CornerDetails(){
  const metrics=useTranslations('Metrics')
  const profile=useTranslations('Profile')
  const items=[['3+',metrics('years')],['30+',metrics('projects')],['100%',metrics('drive')]]

  return <>
    <aside className="corner-metrics scene-item" aria-label={metrics('aria')}>{items.map(([value,label])=><div className="metric-line" key={label}><strong>{value}</strong><span>{label}</span></div>)}</aside>
    <aside className="corner-profile scene-item">
      <p className="profile-signature">{profile('signature')}</p>
      <p className="profile-introduction">{profile('introduction')}</p>
      <a className="profile-contact" href="https://linkedin.com/in/fernando-forastieri" target="_blank" rel="noreferrer">{profile('cta')}<span aria-hidden="true">↗</span></a>
    </aside>
  </>
}
