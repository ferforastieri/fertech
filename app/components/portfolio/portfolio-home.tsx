'use client'

import Image from 'next/image'
import {useTranslations} from 'next-intl'
import { Card } from '@/app/components/ui/card'
import {SiteFrame} from '@/app/components/ui/site-frame'
import { AnimatedIdentity } from './animated-identity'
import {CornerDetails} from './corner-details'
import {TypedText} from './typed-text'
import {ExperienceTimeline} from './experience-timeline'

export function PortfolioHome(){
  const t=useTranslations('Home')
  return <SiteFrame>
  <div id="inicio" className="grid min-h-svh grid-rows-[1fr_auto] px-5 py-5 sm:px-10 sm:py-8 lg:px-[4.5vw] lg:py-[3.5vh]">

    <section className="relative min-h-[500px] py-20" aria-labelledby="portfolio-title">
      <CornerDetails/>
      <div className="central-composition">
        <AnimatedIdentity passion={t('passion')} role={t('role')}/>
        <Card className="scene-portrait relative z-10 aspect-square w-[clamp(138px,16vw,220px)] shrink-0 overflow-hidden rounded-[24px] p-0 shadow-2xl">
          <Image src="/assets/fernando.png" alt={t('portraitAlt')} fill priority sizes="(max-width: 768px) 170px, 285px" className="object-cover grayscale contrast-110 mix-blend-luminosity"/>
          <div className="absolute inset-0 bg-[var(--paper)]/10 mix-blend-color"/>
        </Card>
      </div>
    </section>

    <div className="scene-item grid items-end gap-7 text-sm leading-relaxed text-[var(--paper)]/80 sm:text-base lg:grid-cols-2 lg:gap-24">
      <span aria-hidden="true"/>
      <p className="max-w-lg lg:justify-self-end"><TypedText text={t('about')} delay={920}/></p>
    </div>
  </div>
  <ExperienceTimeline/>
</SiteFrame>}
