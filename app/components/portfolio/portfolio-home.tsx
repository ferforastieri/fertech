'use client'

import Image from 'next/image'
import Link from 'next/link'
import type {MouseEventHandler} from 'react'
import {useTranslations} from 'next-intl'
import { Card } from '@/app/components/ui/card'
import {Logo} from '@/app/components/ui/logo'
import {HomePillLink} from '@/app/components/ui/home-pill-link'
import {GlobalFooter} from '@/app/components/ui/global-profile'
import { AnimatedIdentity } from './animated-identity'
import {CornerDetails} from './corner-details'
import {TypedText} from '@/app/components/ui/typed-text'
import {ExperienceTimeline} from './experience-timeline'

export function PortfolioHome(){
  const t=useTranslations('Home')
  const showExperienceAndFooter:MouseEventHandler<HTMLAnchorElement>=event=>{
    if(!matchMedia('(min-width: 768px)').matches)return
    const section=document.getElementById('experiencia-home')
    if(!section)return
    event.preventDefault()
    section.scrollIntoView({behavior:'smooth',block:'end'})
    history.replaceState(null,'','#experiencia')
  }
  return <>
  <div id="inicio" className="home-hero relative flex h-dvh min-h-dvh w-full flex-col justify-around gap-0 px-[18px] pt-16 pb-[calc(64px+env(safe-area-inset-bottom))] md:grid md:h-auto md:min-h-svh md:w-auto md:grid-rows-[1fr_auto] md:px-10 md:py-8 lg:px-[4.5vw] lg:py-[3.5vh]">
    <Link className="absolute top-[18px] left-1/2 z-30 -translate-x-1/2 text-paper no-underline md:hidden" href="/" aria-label="Fertec"><Logo/></Link>
    <CornerDetails/>

    <section className="home-stage order-1 grid min-h-0 w-full place-items-center p-0 md:relative md:row-start-1 md:block md:min-h-[500px] md:py-20" aria-labelledby="portfolio-title">
      <div className="central-composition static flex w-full flex-col items-center gap-2.5 md:absolute md:top-1/2 md:left-1/2 md:w-[min(82vw,1120px)] md:-translate-x-1/2 md:-translate-y-1/2 md:gap-[clamp(18px,2.2vh,30px)]">
        <AnimatedIdentity passion={t('passion')} role={t('role')}/>
        <Card className="scene-portrait relative z-10 mx-auto mt-5 aspect-square w-[clamp(132px,42vw,170px)] shrink-0 overflow-hidden rounded-[20px] p-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,.5)] md:mt-0 md:w-[clamp(138px,16vw,220px)] md:rounded-3xl">
          <Image src="/assets/fernando.png" alt={t('portraitAlt')} fill priority sizes="(max-width: 768px) 170px, 285px" className="object-cover"/>
        </Card>
      </div>
    </section>

    <div className="home-summary scene-item order-2 grid w-full items-end justify-items-center gap-0 p-0 text-center text-body leading-normal text-[color-mix(in_srgb,var(--paper)_80%,transparent)] md:hidden">
      <p className="m-0 max-w-[32ch] md:ml-auto md:max-w-none md:whitespace-pre-line"><TypedText text={t('about')}/></p>
    </div>
    <aside className="home-summary-desktop home-scroll-fade scene-item absolute bottom-[3.5vh] left-[4.5vw] z-12 hidden w-[min(21vw,250px)] text-left text-[color-mix(in_srgb,var(--paper)_88%,transparent)] md:block md:max-[1100px]:w-[210px] md:will-change-[transform,opacity]">
      <p className="m-0 origin-left -rotate-2 font-display text-[clamp(29px,2.7vw,42px)] leading-none italic"><TypedText text={t('resumeEyebrow')}/></p>
      <p className="home-supporting-copy mt-3 mr-auto mb-0 max-w-[34ch] text-small leading-[1.5]"><TypedText text={t('resumeIntro')}/></p>
      <Link className="group mt-3 inline-flex min-h-9 items-center gap-3 rounded-full border border-[color-mix(in_srgb,var(--paper)_54%,transparent)] px-[15px] py-2 text-label font-[760] tracking-[.12em] whitespace-nowrap text-inherit uppercase no-underline transition-[background,color,transform] duration-250 hover:-translate-y-0.5 hover:bg-paper hover:text-ink focus-visible:-translate-y-0.5 focus-visible:bg-paper focus-visible:text-ink focus-visible:outline-none" href="/curriculo"><span>{t('resumeCta')}</span><span className="font-display text-lg font-normal transition-transform duration-250 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">↗</span></Link>
    </aside>
    <HomePillLink className="home-experience-cta scroll-cue scene-item static z-20 order-4 mx-auto w-max md:absolute md:right-0 md:left-0" href="#experiencia" label={t('scroll')} arrow="down" onClick={showExperienceAndFooter}/>
  </div>
  <div id="experiencia-home"><ExperienceTimeline/><GlobalFooter/></div>
</>}
