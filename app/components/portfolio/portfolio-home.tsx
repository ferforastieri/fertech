'use client'

import Image from 'next/image'
import { Card } from '@/app/components/ui/card'
import { FloatingNavigation } from '@/app/components/ui/floating-navigation'
import { usePreferences } from '@/app/components/ui/preferences-provider'
import { SceneShell } from '@/app/components/ui/scene-shell'
import { AnimatedIdentity } from './animated-identity'

const copy={
  'pt-BR':{passion:'Apaixonado por interfaces, IA e Hardware',role:'Engenheiro de software, pós-graduado em IA.',about:'Construo sistemas completos, com foco em IA e interfaces bonitas, trabalhando remotamente de Sorocaba, Brasil.'},
  en:{passion:'Passionate about interfaces, AI and Hardware',role:'Software engineer, postgraduate in AI.',about:'I build complete systems focused on AI and beautiful interfaces, working remotely from Sorocaba, Brazil.'},
  es:{passion:'Apasionado por interfaces, IA y Hardware',role:'Ingeniero de software, posgraduado en IA.',about:'Construyo sistemas completos, con foco en IA e interfaces atractivas, trabajando de forma remota desde Sorocaba, Brasil.'},
}

export function PortfolioHome(){
  const {locale}=usePreferences()
  const text=copy[locale]
  return <SceneShell>
  <FloatingNavigation/>
  <div id="inicio" className="grid min-h-svh grid-rows-[1fr_auto] px-5 py-5 sm:px-10 sm:py-8 lg:px-[4.5vw] lg:py-[3.5vh]">

    <section className="relative min-h-[500px] py-20" aria-labelledby="portfolio-title">
      <AnimatedIdentity passion={text.passion}/>
      <Card className="scene-portrait portrait-placement absolute left-1/2 z-10 aspect-square w-[clamp(138px,16vw,220px)] -translate-x-1/2 overflow-hidden rounded-[24px] p-0 shadow-2xl">
        <Image src="/assets/fernando.png" alt="Fernando Forastieri" fill priority sizes="(max-width: 768px) 170px, 285px" className="object-cover grayscale contrast-110 mix-blend-luminosity"/>
        <div className="absolute inset-0 bg-[var(--paper)]/10 mix-blend-color"/>
      </Card>
    </section>

    <div className="scene-item grid items-end gap-7 text-sm leading-relaxed text-[var(--paper)]/80 sm:text-base lg:grid-cols-2 lg:gap-24">
      <p className="max-w-lg font-medium">{text.role}</p>
      <p className="max-w-lg lg:justify-self-end">{text.about}</p>
    </div>
  </div>
</SceneShell>}
