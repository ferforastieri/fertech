'use client'

import {useTranslations} from 'next-intl'
import {TypedText} from '@/app/components/ui/typed-text'
import {siteContent} from '@/messages/site-content'

export function CornerDetails(){
  const metrics=useTranslations('Metrics')
  const items=[[siteContent.metrics.years,metrics('years')],[siteContent.metrics.projects,metrics('projects')],[siteContent.metrics.drive,metrics('drive')]]

  return <aside className="corner-metrics scene-item" aria-label={metrics('aria')}>{items.map(([value,label])=><div className="metric-line" key={label}><strong><TypedText text={value}/></strong><TypedText className="metric-label" text={label}/></div>)}</aside>
}
