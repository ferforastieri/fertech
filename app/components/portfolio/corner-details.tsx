'use client'

import Link from 'next/link'
import {useTranslations} from 'next-intl'
import {TypedText} from '@/app/components/ui/typed-text'
import {HomePillLink} from '@/app/components/ui/home-pill-link'
import {projects} from '@/messages/project-data'
import {siteContent} from '@/messages/site-content'

export function CornerDetails(){
  const metrics=useTranslations('Metrics')
  const home=useTranslations('Home')
  const items=[[siteContent.metrics.years,metrics('years')],[String(projects.length),metrics('projects')]]

  return <>
    <aside className="corner-metrics scene-item static order-3 z-12 mx-auto block w-full max-w-[260px] self-center text-center text-[color-mix(in_srgb,var(--paper)_82%,transparent)] md:hidden" aria-label={metrics('aria')}>
      {items.map(([value,label],index)=><div className={`metric-line border-b border-[color-mix(in_srgb,var(--paper)_22%,transparent)] py-2 ${index===0?'pt-0':''}`} key={label}><strong className="block font-display text-[clamp(24px,7vw,30px)] leading-[.86] font-normal tracking-[-.035em]"><TypedText text={value}/></strong><TypedText className="mt-[5px] block text-micro font-[650] tracking-[.1em] uppercase opacity-62" text={label}/></div>)}
      <HomePillLink className="mx-auto mt-4" href="/projetos" label={home('mobileProjectsCta')}/>
    </aside>

    <aside className="corner-metrics home-scroll-fade scene-item absolute right-[4.5vw] bottom-[3.5vh] z-12 hidden w-[min(21vw,250px)] text-right text-[color-mix(in_srgb,var(--paper)_82%,transparent)] md:block md:max-[1100px]:w-[210px] md:will-change-[transform,opacity]" aria-label={metrics('aria')}>
      <p className="m-0 origin-right -rotate-2 font-display text-[clamp(29px,2.45vw,40px)] leading-[.92] italic"><TypedText text={`${siteContent.metrics.years} ${metrics('years').toLocaleLowerCase()}`}/></p>
      <TypedText className="home-supporting-copy mt-4 ml-auto block max-w-[34ch] text-small leading-[1.5]" text={`${projects.length} ${metrics('projects').toLocaleLowerCase()}`}/>
      <Link className="group mt-4 inline-flex min-h-9 items-center gap-3 rounded-full border border-[color-mix(in_srgb,var(--paper)_54%,transparent)] px-[15px] py-2 text-label font-[760] tracking-[.12em] whitespace-nowrap text-inherit uppercase no-underline transition-[background,color,transform] duration-250 hover:-translate-y-0.5 hover:bg-paper hover:text-ink focus-visible:-translate-y-0.5 focus-visible:bg-paper focus-visible:text-ink focus-visible:outline-none" href="/projetos"><span>{home('projectsCta')}</span><span className="font-display text-lg font-normal transition-transform duration-250 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">↗</span></Link>
    </aside>
  </>
}
