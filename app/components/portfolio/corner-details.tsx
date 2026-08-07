'use client'

import {useTranslations} from 'next-intl'
import {TypedText} from '@/app/components/ui/typed-text'
import {siteContent} from '@/messages/site-content'

export function CornerDetails(){
  const metrics=useTranslations('Metrics')
  const items=[[siteContent.metrics.years,metrics('years')],[siteContent.metrics.projects,metrics('projects')],[siteContent.metrics.drive,metrics('drive')]]

  return <aside className="corner-metrics scene-item static order-3 z-12 mx-0 block w-[min(100%,260px)] self-center text-center text-[color-mix(in_srgb,var(--paper)_82%,transparent)] sm:max-[1100px]:w-[145px] md:absolute md:bottom-[3.5vh] md:left-[4.5vw] md:w-[min(18vw,210px)] md:self-auto md:text-left" aria-label={metrics('aria')}>{items.map(([value,label],index)=><div className={`metric-line border-b border-[color-mix(in_srgb,var(--paper)_22%,transparent)] pb-2 ${index?'pt-2 md:pt-[13px]':''} md:pb-[13px]`} key={label}><strong className="block font-display text-[clamp(27px,2.6vw,43px)] leading-[.86] font-normal tracking-[-.035em] sm:max-[1100px]:text-[28px]"><TypedText text={value}/></strong><TypedText className="mt-[5px] block text-caption font-[650] tracking-[.13em] uppercase opacity-62" text={label}/></div>)}</aside>
}
