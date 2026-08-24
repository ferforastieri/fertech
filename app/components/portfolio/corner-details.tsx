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

  return <>
    <aside className="corner-metrics scene-item static order-3 z-12 mx-auto block w-full max-w-[280px] self-center text-center text-[color-mix(in_srgb,var(--paper)_82%,transparent)] md:hidden" aria-label={metrics('aria')}>
      <p className="mobile-signature-line"><TypedText text={`${siteContent.metrics.years} ${metrics('years').toLocaleLowerCase()}`}/></p>
      <p className="mobile-signature-line"><TypedText text={`${projects.length} ${metrics('projects').toLocaleLowerCase()}`}/></p>
      <HomePillLink className="mobile-project-signature mx-auto" href="/projetos" label={home('mobileProjectsCta')}/>
    </aside>

    <aside className="corner-metrics home-scroll-fade scene-item absolute right-[4.5vw] bottom-[3.5vh] z-12 hidden w-[min(21vw,250px)] text-right text-[color-mix(in_srgb,var(--paper)_82%,transparent)] md:block md:max-[1100px]:w-[210px] md:will-change-[transform,opacity]" aria-label={metrics('aria')}>
      <p className="m-0 origin-right -rotate-2 font-display text-[clamp(29px,2.45vw,40px)] leading-[.92] italic"><TypedText text={`${siteContent.metrics.years} ${metrics('years').toLocaleLowerCase()}`}/></p>
      <TypedText className="home-supporting-copy mt-4 ml-auto block max-w-[34ch] text-small leading-[1.5]" text={`${projects.length} ${metrics('projects').toLocaleLowerCase()}`}/>
      <Link className="group mt-4 inline-flex min-h-9 items-center gap-3 rounded-full border border-[color-mix(in_srgb,var(--paper)_54%,transparent)] px-[15px] py-2 text-label font-[760] tracking-[.12em] whitespace-nowrap text-inherit uppercase no-underline transition-[background,color,transform] duration-250 hover:-translate-y-0.5 hover:bg-paper hover:text-ink focus-visible:-translate-y-0.5 focus-visible:bg-paper focus-visible:text-ink focus-visible:outline-none" href="/projetos"><span>{home('projectsCta')}</span><span className="font-display text-lg font-normal transition-transform duration-250 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">↗</span></Link>
    </aside>
  </>
}
