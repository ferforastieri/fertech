'use client'

import Link from 'next/link'
import {useTranslations} from 'next-intl'
import {TypedText} from './typed-text'
import {siteContent} from '@/messages/site-content'

export function GlobalProfile(){
  const profile=useTranslations('Profile')
  const year=new Date().getFullYear()
  const detailLabel='mb-2 block text-micro font-[760] tracking-[.2em] uppercase opacity-45'
  const corner='text-small leading-[1.5] text-[color-mix(in_srgb,var(--paper)_76%,transparent)]'

  return <footer id="contato" className="global-profile relative z-10 mx-auto mt-5 w-[calc(100%_-_36px)] border-t border-[color-mix(in_srgb,var(--paper)_28%,transparent)] px-1 pt-4 pb-[calc(72px+env(safe-area-inset-bottom))] text-paper md:mt-0 md:min-h-[250px] md:w-[calc(100%_-_9vw)] md:px-0 md:pt-6 md:pb-6">
    <div className="grid grid-cols-2 gap-x-5 gap-y-4 md:absolute md:inset-x-0 md:top-6 md:grid-cols-[1fr_auto_1fr] md:items-start">
      <div className={`${corner} text-left`}><span className={detailLabel}>{profile('base')}</span><span>{profile('location')}</span></div>
      <p className="col-span-2 row-start-1 m-0 self-start text-center text-micro font-[760] tracking-[.22em] uppercase opacity-48 md:col-span-1 md:col-start-2">{profile('eyebrow')}</p>
      <div className={`${corner} col-start-2 row-start-2 text-right md:col-start-3 md:row-start-1`}><span className={detailLabel}>{profile('write')}</span><a className="break-all text-inherit underline decoration-[color-mix(in_srgb,var(--paper)_30%,transparent)] underline-offset-4 transition-opacity hover:opacity-65 focus-visible:opacity-65 focus-visible:outline-none" href={`mailto:${siteContent.contacts.email}`}>{siteContent.contacts.email}</a></div>
    </div>

    <div className="mx-auto flex max-w-[900px] flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-7 text-center md:min-h-[198px] md:flex-nowrap md:gap-x-8 md:pt-8">
      <p className="global-profile__signature m-0 origin-center -rotate-2 font-display text-[clamp(38px,10vw,50px)] leading-[.82] italic md:text-[clamp(46px,4.5vw,66px)]"><TypedText text={profile('signature')}/></p>
      <i className="hidden h-9 w-px bg-[color-mix(in_srgb,var(--paper)_24%,transparent)] not-italic md:block" aria-hidden="true"/>
      <p className="global-profile__introduction order-3 m-0 w-full max-w-[34ch] text-small leading-[1.5] font-[540] opacity-62 md:order-none md:w-auto md:max-w-[28ch] md:text-body-sm md:text-left"><TypedText text={profile('introduction')}/></p>
      <a className="global-profile__contact group inline-flex min-h-10 shrink-0 items-center gap-3 rounded-full border border-[color-mix(in_srgb,var(--paper)_54%,transparent)] px-4 py-2 text-caption font-[760] tracking-[.13em] text-inherit uppercase no-underline transition-[background,color,transform] duration-250 hover:-translate-y-0.5 hover:bg-paper hover:text-ink focus-visible:-translate-y-0.5 focus-visible:bg-paper focus-visible:text-ink focus-visible:outline-none" href={`mailto:${siteContent.contacts.email}`}><span>{profile('cta')}</span><span className="font-display text-lg font-normal transition-transform duration-250 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">↗</span></a>
    </div>

    <div className="mt-5 grid gap-3 border-t border-[color-mix(in_srgb,var(--paper)_18%,transparent)] pt-4 md:absolute md:inset-x-0 md:bottom-6 md:mt-0 md:grid-cols-[1fr_auto_1fr] md:items-end md:border-0 md:pt-0">
      <p className={`${corner} m-0 text-center md:text-left`}>© {year} {siteContent.identity.name}<span className="hidden sm:inline"> · </span><span className="block sm:inline">{profile('copyright')}</span></p>
      <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-caption font-[720] tracking-[.12em] uppercase" aria-label={profile('networks')}>
        <a className="text-inherit no-underline opacity-68 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none" href={siteContent.contacts.github} target="_blank" rel="noreferrer">{siteContent.networks.github} ↗</a>
        <a className="text-inherit no-underline opacity-68 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none" href={siteContent.contacts.linkedin} target="_blank" rel="noreferrer">{siteContent.networks.linkedin} ↗</a>
        <a className="text-inherit no-underline opacity-68 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none" href={siteContent.contacts.x} target="_blank" rel="noreferrer">{siteContent.networks.x} ↗</a>
      </nav>
      <Link className="group justify-self-center text-caption font-[720] tracking-[.12em] text-inherit uppercase no-underline opacity-68 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none md:justify-self-end" href="/">{profile('home')} <span className="inline-block transition-transform duration-250 group-hover:-translate-y-1" aria-hidden="true">↑</span></Link>
    </div>
  </footer>
}
