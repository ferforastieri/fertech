'use client'

import {useTranslations} from 'next-intl'
import {TypedText} from '@/app/components/ui/typed-text'
import {siteContent} from '@/messages/site-content'

export function CornerDetails(){
  const metrics=useTranslations('Metrics')
  const items=[[siteContent.metrics.years,metrics('years')],[siteContent.metrics.projects,metrics('projects')],[siteContent.metrics.drive,metrics('drive')]]

  return <aside className="corner-metrics scene-item static order-3 z-12 mx-auto block w-full max-w-[260px] self-center text-center text-[color-mix(in_srgb,var(--paper)_82%,transparent)] md:absolute md:bottom-[3.5vh] md:left-[4.5vw] md:mx-0 md:w-[min(18vw,210px)] md:self-auto md:text-left" aria-label={metrics('aria')}>{items.map(([value,label],index)=><div className={`metric-line border-b border-[color-mix(in_srgb,var(--paper)_22%,transparent)] py-2 ${index===0?'pt-0':''} md:pb-[13px] ${index?'md:pt-[13px]':''}`} key={label}><strong className="block font-display text-[clamp(24px,7vw,30px)] leading-[.86] font-normal tracking-[-.035em] md:text-[clamp(27px,2.6vw,43px)] md:max-[1100px]:text-[28px]"><TypedText text={value}/></strong><TypedText className="mt-[5px] block text-micro font-[650] tracking-[.1em] uppercase opacity-62 md:text-caption md:tracking-[.13em]" text={label}/></div>)}</aside>
}
