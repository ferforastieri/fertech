'use client'

import {useTranslations} from 'next-intl'
import {TypedText} from '@/app/components/ui/typed-text'
import {HomePillLink} from '@/app/components/ui/home-pill-link'
import {projects} from '@/messages/project-data'
import {siteContent} from '@/messages/site-content'

export function CornerDetails(){
  const metrics=useTranslations('Metrics')
  const home=useTranslations('Home')

  const mobileMetric='grid min-h-14 w-full place-items-center border-x-0 border-t-0 border-b border-[color-mix(in_srgb,var(--paper)_22%,transparent)] px-1.5 py-[11px] text-center font-display text-[clamp(27px,8vw,36px)] leading-[.94] font-normal tracking-[-.03em] whitespace-nowrap text-paper'

  return <>
    <aside className="corner-metrics scene-item static order-3 z-12 mx-auto block w-full max-w-[280px] self-center text-center text-[color-mix(in_srgb,var(--paper)_82%,transparent)] md:hidden" aria-label={metrics('aria')}>
      <p className={mobileMetric}><TypedText text={`${siteContent.metrics.years} ${metrics('years').toLocaleLowerCase()}`}/></p>
      <p className={mobileMetric}><TypedText text={`${projects.length} ${metrics('projects').toLocaleLowerCase()}`}/></p>
      <HomePillLink className="mx-auto mt-3.5 min-h-11! w-[min(100%,184px)]!" href="/projetos" label={home('mobileProjectsCta')}/>
    </aside>

    <aside className="corner-metrics home-scroll-fade scene-item absolute right-[4.5vw] bottom-[3.5vh] z-12 hidden w-[min(21vw,250px)] text-right text-[color-mix(in_srgb,var(--paper)_82%,transparent)] md:block md:max-[1100px]:w-[210px] md:will-change-[transform,opacity]" aria-label={metrics('aria')}>
      <p className="m-0 origin-right -rotate-2 font-display text-[clamp(29px,2.45vw,40px)] leading-[.92] italic"><TypedText text={`${siteContent.metrics.years} ${metrics('years').toLocaleLowerCase()}`}/></p>
      <TypedText className="mt-4 ml-auto block max-w-[34ch] text-small leading-[1.5] font-[560] text-[color-mix(in_srgb,var(--paper)_92%,transparent)]" text={`${projects.length} ${metrics('projects').toLocaleLowerCase()}`}/>
      <HomePillLink className="mt-4" href="/projetos" label={home('projectsCta')}/>
    </aside>
  </>
}
