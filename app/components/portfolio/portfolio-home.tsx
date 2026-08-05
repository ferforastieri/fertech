'use client'

import Image from 'next/image'
import {useTranslations} from 'next-intl'
import { Card } from '@/app/components/ui/card'
import {SiteFrame} from '@/app/components/ui/site-frame'
import { AnimatedIdentity } from './animated-identity'
import {CornerDetails} from './corner-details'
import {TypedText} from '@/app/components/ui/typed-text'
import {ExperienceTimeline} from './experience-timeline'
import './portfolio.css'

export function PortfolioHome(){
  const t=useTranslations('Home')
  return <SiteFrame>
  <div id="inicio" className="home-hero">
    <CornerDetails/>

    <section className="home-stage" aria-labelledby="portfolio-title">
      <div className="central-composition">
        <AnimatedIdentity passion={t('passion')} role={t('role')}/>
        <Card className="scene-portrait">
          <Image src="/assets/fernando.png" alt={t('portraitAlt')} fill priority sizes="(max-width: 768px) 170px, 285px" className="portrait-image"/>
          <div className="portrait-wash"/>
        </Card>
      </div>
    </section>

    <div className="home-summary scene-item">
      <span aria-hidden="true"/>
      <p><TypedText text={t('about')}/></p>
    </div>
    <a className="scroll-cue scene-item" href="#experiencia"><span>{t('scroll')}</span><i className="scroll-cue-mark" aria-hidden="true"/></a>
  </div>
  <ExperienceTimeline/>
</SiteFrame>}
