import Image from 'next/image'
import { ButtonLink } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { Logo } from '@/app/components/ui/logo'
import { SceneShell } from '@/app/components/ui/scene-shell'

export function PortfolioHome(){return <SceneShell>
  <div className="grid min-h-svh grid-rows-[auto_1fr_auto] px-5 py-5 sm:px-10 sm:py-8 lg:px-[4.5vw] lg:py-[3.5vh]">
    <header className="scene-item flex items-start justify-between text-[10px] font-semibold uppercase tracking-[.08em] sm:text-xs">
      <ButtonLink href="https://linkedin.com/in/fernando-forastieri" target="_blank" rel="noreferrer">Marcar conversa</ButtonLink>
      <nav className="flex items-center gap-6 sm:gap-14"><Logo/><a className="animated-link" href="https://linkedin.com/in/fernando-forastieri" target="_blank" rel="noreferrer">LinkedIn</a></nav>
    </header>

    <section className="relative flex min-h-[500px] items-center justify-center py-20" aria-labelledby="portfolio-title">
      <h1 id="portfolio-title" className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[clamp(66px,12vw,184px)] font-extrabold leading-[.84] tracking-[-.075em] uppercase">
        <span className="block overflow-hidden"><span className="scene-line block">Fernando</span></span>
        <span className="mt-[.08em] block overflow-hidden"><span className="scene-line block">Forastieri</span></span>
      </h1>
      <Card className="scene-portrait relative z-10 mt-28 aspect-square w-[clamp(150px,20vw,285px)] translate-y-[8%] overflow-hidden rounded-[28px] p-0 shadow-2xl">
        <Image src="/assets/fernando.png" alt="Fernando Forastieri" fill priority sizes="(max-width: 768px) 170px, 285px" className="object-cover grayscale contrast-110 mix-blend-luminosity"/>
        <div className="absolute inset-0 bg-[var(--paper)]/10 mix-blend-color"/>
      </Card>
    </section>

    <div className="scene-item grid items-end gap-7 text-sm leading-relaxed text-[var(--paper)]/80 sm:text-base lg:grid-cols-2 lg:gap-24">
      <p className="max-w-md">Desenvolvedor fullstack focado em <u>design systems</u>, infraestrutura e experiências digitais com intenção.</p>
      <p className="max-w-lg lg:justify-self-end">Construo interfaces e produtos digitais, trabalhando remotamente de Sorocaba, Brasil.</p>
    </div>
  </div>
</SceneShell>}
