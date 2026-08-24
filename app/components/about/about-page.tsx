'use client'

import Link from 'next/link'
import {useRef} from 'react'
import {useTranslations} from 'next-intl'
import {useScrollReveal} from '@/app/hooks/use-scroll-reveal'

const paragraphs=['games','making','people'] as const
const interests=['stories','worlds','hardware','learning'] as const

export function AboutPage(){
  const t=useTranslations('About')
  const root=useRef<HTMLDivElement>(null)
  useScrollReveal(root,'.about-reveal')
  return <div ref={root} className="editorial-page about-page mx-auto w-[calc(100%_-_36px)] max-w-[1120px] pt-4 text-center md:w-[min(1120px,91vw)] md:pt-[clamp(78px,9vh,108px)] md:text-left">
    <header className="about-hero about-reveal grid grid-cols-1 [grid-template-areas:'eyebrow'_'title'_'note'] justify-items-center gap-4 border-b border-[color-mix(in_srgb,var(--paper)_24%,transparent)] pb-[30px] opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:grid-cols-[minmax(0,1fr)_240px] md:[grid-template-areas:'eyebrow_note'_'title_note'] md:items-end md:justify-items-stretch md:gap-x-14 md:gap-y-5 md:pb-11"><p className="m-0 mb-[13px] [grid-area:eyebrow] text-caption font-[750] tracking-[.2em] uppercase opacity-58">{t('eyebrow')}</p><h1 className="mx-auto my-0 max-w-[10ch] [grid-area:title] font-display text-[clamp(42px,12.5vw,56px)] leading-[.86] font-normal tracking-[-.045em] md:mx-0 md:max-w-[820px] md:text-[clamp(54px,7.2vw,98px)] md:leading-[.84]">{t('title')}</h1><aside className="max-w-[34ch] [grid-area:note] border-t border-[color-mix(in_srgb,var(--paper)_26%,transparent)] pt-[18px] md:max-w-none md:self-end md:border-t-0 md:border-l md:pt-[18px] md:pr-0 md:pb-0.5 md:pl-5"><span className="text-caption font-[750] tracking-[.16em] uppercase opacity-54">{t('interests.stories.title')}</span><p className="mt-3 mb-0 font-display text-lg leading-[1.2] italic opacity-80">{t('paragraphs.writing')}</p></aside></header>
    <aside className="about-resume about-reveal grid grid-cols-1 justify-items-center gap-4 border-b border-[color-mix(in_srgb,var(--paper)_22%,transparent)] py-6 opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:grid-cols-[minmax(200px,.55fr)_minmax(0,1fr)_auto] md:items-center md:justify-items-stretch md:gap-[clamp(24px,4vw,50px)]"><div><p className="m-0 mb-[13px] text-caption font-[750] tracking-[.2em] uppercase opacity-58">{t('resumeEyebrow')}</p><h2 className="m-0 font-display text-[clamp(25px,3vw,38px)] leading-[.95] font-normal">{t('resumeTitle')}</h2></div><p className="m-0 max-w-[36ch] text-small leading-[1.65] opacity-72 md:max-w-[44ch]">{t('resumeDescription')}</p><Link className="group inline-flex items-center gap-[18px] whitespace-nowrap rounded-full border border-[color-mix(in_srgb,var(--paper)_42%,transparent)] px-[13px] py-2.5 text-caption font-[750] tracking-[.1em] text-inherit uppercase no-underline" href="/curriculo">{t('resumeLink')} <span className="text-sm transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">↗</span></Link></aside>
    <section className="about-copy my-9 grid grid-cols-1 items-start gap-[15px] md:my-16 md:grid-cols-[240px_minmax(0,1fr)] md:gap-x-16 md:gap-y-6">
      <aside className="about-reveal col-start-1 mb-3 grid justify-items-center gap-3 border-b border-[color-mix(in_srgb,var(--paper)_22%,transparent)] pb-6 text-center opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:sticky md:top-28 md:row-span-3 md:mb-0 md:justify-items-start md:border-b-0 md:pb-0 md:text-left">
        <p className="m-0 text-caption font-[750] tracking-[.18em] uppercase opacity-52">{t('personalEyebrow')}</p>
        <h3 className="m-0 font-display text-[clamp(38px,5vw,62px)] leading-[.88] font-normal tracking-[-.04em]">{t('personalTitle')}</h3>
        <i className="h-10 w-px bg-[color-mix(in_srgb,var(--paper)_34%,transparent)] md:h-16" aria-hidden="true"/>
        <p className="m-0 max-w-[18ch] font-display text-lg leading-[1.08] italic opacity-72">{t('personalNote')}</p>
        <span className="mt-1 text-caption tracking-[.12em] uppercase opacity-42">{t('personalTopics')}</span>
      </aside>
      {paragraphs.map((key,index)=><p className={`about-reveal col-start-1 m-0 font-display text-[clamp(21px,6.6vw,28px)] leading-[1.2] tracking-[-.018em] opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:col-start-2 md:text-[clamp(23px,2.5vw,33px)] md:leading-[1.18] ${index===0?'italic':''}`} key={key}>{t(`paragraphs.${key}`)}</p>)}
    </section>
    <section className="about-interests grid grid-cols-1 items-start justify-items-center gap-8 border-t border-[color-mix(in_srgb,var(--paper)_22%,transparent)] pt-9 md:grid-cols-[minmax(250px,.48fr)_minmax(0,1fr)] md:justify-items-stretch md:gap-16 md:pt-12" aria-labelledby="about-interests-title"><header className="about-reveal w-full opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:sticky md:top-28 md:self-start"><p className="m-0 mb-4 text-caption font-[750] tracking-[.2em] uppercase opacity-58">{t('interestsEyebrow')}</p><h2 className="mx-auto m-0 max-w-[12ch] [overflow-wrap:normal] font-display text-[clamp(36px,10vw,48px)] leading-[.92] font-normal tracking-[-.03em] md:mx-0 md:text-[clamp(44px,4.3vw,58px)]" id="about-interests-title">{t('interestsTitle')}</h2></header><div className="grid w-full grid-cols-1 items-stretch gap-px bg-[color-mix(in_srgb,var(--paper)_24%,transparent)] md:grid-cols-2">{interests.map(key=><article className="about-reveal flex min-h-[170px] flex-col bg-[color-mix(in_srgb,var(--ink)_92%,transparent)] px-5 py-6 text-center opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:min-h-[210px] md:p-7 md:text-left" key={key}><h3 className="m-0 font-display text-[clamp(28px,7vw,32px)] leading-[.95] font-normal">{t(`interests.${key}.title`)}</h3><p className="mt-5 mb-0 text-small leading-[1.7] opacity-74 md:mt-auto md:pt-8">{t(`interests.${key}.description`)}</p></article>)}</div></section>
  </div>
}
