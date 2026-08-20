'use client'

import Image from 'next/image'
import {useTranslations} from 'next-intl'
import { Card } from '@/app/components/ui/card'
import { AnimatedIdentity } from './animated-identity'
import {CornerDetails} from './corner-details'
import {TypedText} from '@/app/components/ui/typed-text'
import {ExperienceTimeline} from './experience-timeline'
import {usePreferences} from '@/app/components/ui/preferences-provider'

export function PortfolioHome(){
  const t=useTranslations('Home')
  const {navPosition}=usePreferences()
  return <>
  <div id="inicio" className={`home-hero relative mx-auto flex h-dvh min-h-dvh w-[calc(100%_-_36px)] flex-col justify-evenly gap-0 pt-4 pb-8 md:grid md:h-auto md:min-h-svh md:w-auto md:grid-rows-[1fr_auto] md:px-10 md:py-8 lg:px-[4.5vw] lg:py-[3.5vh] ${navPosition==='top'?'max-md:h-[calc(100dvh-58px)] max-md:min-h-[calc(100dvh-58px)] max-md:overflow-hidden':''}`}>
    <CornerDetails/>

    <section className="home-stage order-1 grid min-h-0 place-items-center p-0 md:relative md:row-start-1 md:block md:min-h-[500px] md:py-20" aria-labelledby="portfolio-title">
      <div className="central-composition static flex w-full flex-col items-center gap-2.5 md:absolute md:top-1/2 md:left-1/2 md:w-[min(76vw,980px)] md:-translate-x-1/2 md:-translate-y-1/2 md:gap-[clamp(18px,2.2vh,30px)]">
        <AnimatedIdentity passion={t('passion')} role={t('role')}/>
        <Card className="scene-portrait relative z-10 aspect-square w-[clamp(132px,42vw,170px)] shrink-0 overflow-hidden rounded-[20px] p-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,.5)] md:w-[clamp(138px,16vw,220px)] md:rounded-3xl">
          <Image src="/assets/fernando.png" alt={t('portraitAlt')} fill priority sizes="(max-width: 768px) 170px, 285px" className="object-cover"/>
        </Card>
      </div>
    </section>

    <div className="home-summary scene-item order-2 grid w-full items-end justify-items-center gap-0 p-0 text-center text-body leading-normal text-[color-mix(in_srgb,var(--paper)_80%,transparent)] md:absolute md:right-[4.5vw] md:bottom-[3.5vh] md:z-12 md:block md:w-[min(30vw,380px)] md:text-left md:text-base md:leading-[1.625] md:max-[1100px]:w-[280px]">
      <p className="m-0 max-w-[32ch] md:max-w-none"><TypedText text={t('about')}/></p>
    </div>
    <a className={`scroll-cue scene-item static z-20 order-4 mx-auto flex w-max flex-col items-center gap-1 text-micro font-bold tracking-[.16em] text-inherit uppercase no-underline opacity-62 md:absolute md:right-0 md:left-0 md:gap-2 ${navPosition==='bottom'?'md:bottom-[88px]':'md:bottom-[clamp(24px,3.5vh,42px)]'}`} href="#experiencia"><span>{t('scroll')}</span><i className="scroll-cue-mark relative block h-6 w-4 origin-center before:absolute before:top-0 before:left-1/2 before:h-[21px] before:w-px before:-translate-x-1/2 before:bg-current before:content-[''] after:absolute after:right-0.5 after:bottom-0.5 after:h-[9px] after:w-[9px] after:rotate-45 after:border-r after:border-b after:border-current after:content-[''] md:h-8 md:before:h-[29px]" aria-hidden="true"/></a>
  </div>
  <ExperienceTimeline navPosition={navPosition}/>
</>}
