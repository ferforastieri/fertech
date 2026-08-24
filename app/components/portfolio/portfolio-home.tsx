'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useTranslations} from 'next-intl'
import { Card } from '@/app/components/ui/card'
import {Logo} from '@/app/components/ui/logo'
import { AnimatedIdentity } from './animated-identity'
import {CornerDetails} from './corner-details'
import {TypedText} from '@/app/components/ui/typed-text'
import {ExperienceTimeline} from './experience-timeline'
import {usePreferences} from '@/app/components/ui/preferences-provider'

export function PortfolioHome(){
  const t=useTranslations('Home')
  const {navPosition}=usePreferences()
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

    <div className="home-summary scene-item order-2 grid w-full items-end justify-items-center gap-0 p-0 text-center text-body leading-normal text-[color-mix(in_srgb,var(--paper)_80%,transparent)] md:absolute md:right-[4.5vw] md:bottom-[3.5vh] md:z-12 md:block md:w-[min(36vw,470px)] md:text-right md:text-base md:leading-[1.625] md:max-[1100px]:w-[330px]">
      <p className="m-0 max-w-[32ch] md:ml-auto md:max-w-none md:whitespace-pre-line"><TypedText text={t('about')}/></p>
    </div>
    <a className={`scroll-cue scene-item static z-20 order-4 mx-auto flex w-max flex-col items-center gap-1 text-micro font-bold tracking-[.16em] text-inherit uppercase no-underline opacity-62 md:absolute md:right-0 md:left-0 md:gap-2 ${navPosition==='bottom'?'md:bottom-[88px]':'md:bottom-[clamp(24px,3.5vh,42px)]'}`} href="#experiencia"><span>{t('scroll')}</span><i className="scroll-cue-mark relative block h-6 w-4 origin-center before:absolute before:top-0 before:left-1/2 before:h-[21px] before:w-px before:-translate-x-1/2 before:bg-current before:content-[''] after:absolute after:right-0.5 after:bottom-0.5 after:h-[9px] after:w-[9px] after:rotate-45 after:border-r after:border-b after:border-current after:content-[''] md:h-8 md:before:h-[29px]" aria-hidden="true"/></a>
  </div>
  <ExperienceTimeline/>
</>}
