'use client'

import {useTranslations} from 'next-intl'
import {TypedText} from '@/app/components/ui/typed-text'

export function CornerDetails(){
  const metrics=useTranslations('Metrics')
  const items=[['3+',metrics('years')],['20',metrics('projects')],['100%',metrics('drive')]]

  return <aside className="corner-metrics scene-item" aria-label={metrics('aria')}>{items.map(([value,label])=><div className="metric-line" key={label}><strong><TypedText text={value}/></strong><TypedText className="metric-label" text={label}/></div>)}</aside>
}
