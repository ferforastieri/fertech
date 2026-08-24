'use client'

import Link from 'next/link'
import {useEffect,useRef} from 'react'
import {useTranslations} from 'next-intl'
import {usePathname} from 'next/navigation'
import {TypedText} from './typed-text'
import {HomePillLink} from './home-pill-link'
import {SocialIcon,type SocialNetwork} from './social-icon'
import {usePreferences} from './preferences-provider'
import {siteContent} from '@/messages/site-content'

export function GlobalProfileCorner(){
  const profile=useTranslations('Profile')
  return <aside className="global-profile global-profile--corner scene-item relative z-30 mx-auto mt-6 mb-[calc(32px+env(safe-area-inset-bottom))] hidden w-[min(calc(100%_-_48px),300px)] border-t border-[color-mix(in_srgb,var(--paper)_32%,transparent)] pt-6 text-center text-[color-mix(in_srgb,var(--paper)_92%,transparent)] md:fixed md:top-[26px] md:right-[4.5vw] md:m-0 md:block md:w-[min(42vw,340px)] md:border-0 md:pt-0 md:text-right md:will-change-[transform,opacity]">
      <p className="global-profile__signature m-0 origin-center -rotate-3 font-display text-[clamp(28px,8vw,35px)] leading-none italic md:origin-right md:text-[clamp(30px,3vw,46px)]"><TypedText text={profile('signature')}/></p>
      <p className="global-profile__introduction home-supporting-copy mx-auto my-2 max-w-[34ch] text-small leading-[1.45] md:mt-[15px] md:mr-0 md:mb-3.5 md:ml-auto md:w-full md:max-w-none md:whitespace-pre md:leading-[1.55]"><TypedText text={profile('introduction')}/></p>
      <HomePillLink href={siteContent.contacts.linkedin} label={profile('cta')} external/>
    </aside>
}

export function GlobalFooter({hideOnHome=false}:{hideOnHome?:boolean}={}){
  const profile=useTranslations('Profile')
  const {navPosition}=usePreferences()
  const pathname=usePathname()
  const year=new Date().getFullYear()
  const detailLabel='mb-2 block text-micro font-[760] tracking-[.2em] uppercase opacity-45'
  const corner='text-small leading-[1.5] text-[color-mix(in_srgb,var(--paper)_76%,transparent)]'
  const networks:SocialNetwork[]=['github','linkedin','x']
  const isHome=(pathname.replace(/\/$/,'')||'/')==='/'
  const hidden=hideOnHome&&isHome
  const previousNavPosition=useRef(navPosition)

  useEffect(()=>{
    const previousPosition=previousNavPosition.current
    previousNavPosition.current=navPosition

    if(hidden||previousPosition===navPosition||navPosition!=='bottom')return

    const root=document.documentElement
    const distanceFromBottom=root.scrollHeight-(window.scrollY+window.innerHeight)
    if(distanceFromBottom>180)return

    const scrollToDocumentEnd=()=>{
      window.scrollTo({
        top:document.documentElement.scrollHeight-window.innerHeight,
        behavior:'smooth'
      })
    }
    const frame=window.requestAnimationFrame(scrollToDocumentEnd)
    const transitionEnd=window.setTimeout(scrollToDocumentEnd,360)

    return()=>{
      window.cancelAnimationFrame(frame)
      window.clearTimeout(transitionEnd)
    }
  },[hidden,navPosition])

  if(hidden)return null

  return <footer id="contato" className={`global-profile relative z-10 mx-auto mt-10 w-[calc(100%_-_36px)] px-1 pt-0 text-paper transition-[padding-bottom] duration-340 ease-[cubic-bezier(.22,1,.36,1)] md:mt-12 md:w-[calc(100%_-_9vw)] md:border-t md:border-[color-mix(in_srgb,var(--paper)_22%,transparent)] md:px-0 md:pt-5 ${navPosition==='bottom'?'pb-[calc(88px+env(safe-area-inset-bottom))] md:pb-[88px]':'pb-[calc(24px+env(safe-area-inset-bottom))] md:pb-5'}`}>
      <div className="mx-auto flex w-full max-w-[420px] flex-col items-center border-y border-[color-mix(in_srgb,var(--paper)_28%,transparent)] px-1 py-6 text-center md:hidden">
        <p className="m-0 text-micro font-[760] tracking-[.22em] uppercase opacity-48">{profile('eyebrow')}</p>
        <p className="global-profile__signature mt-4 mb-0 origin-center -rotate-2 font-display text-[clamp(38px,10vw,50px)] leading-[.82] italic"><TypedText text={profile('signature')}/></p>
        <p className="global-profile__introduction mt-5 mb-0 max-w-[32ch] text-small leading-[1.55] font-[540] opacity-68"><TypedText text={profile('introduction')}/></p>
        <a className="global-profile__contact group mt-5 inline-flex min-h-10 items-center gap-3 rounded-full border border-[color-mix(in_srgb,var(--paper)_54%,transparent)] px-4 py-2 text-caption font-[760] tracking-[.13em] text-inherit uppercase no-underline transition-[background,color,transform] duration-250 hover:-translate-y-0.5 hover:bg-paper hover:text-ink focus-visible:-translate-y-0.5 focus-visible:bg-paper focus-visible:text-ink focus-visible:outline-none" href={`mailto:${siteContent.contacts.email}`}><span>{profile('cta')}</span><span className="font-display text-lg font-normal transition-transform duration-250 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">↗</span></a>
      </div>

      <div className="mx-auto mt-7 grid w-full max-w-[420px] gap-5 px-1 text-center md:hidden sm:grid-cols-2">
        <div className={`${corner} text-center sm:text-left`}><span className={detailLabel}>{profile('base')}</span><span>{profile('location')}</span></div>
        <div className={`${corner} min-w-0 text-center sm:text-right`}><span className={detailLabel}>{profile('write')}</span><a className="break-all text-inherit underline decoration-[color-mix(in_srgb,var(--paper)_30%,transparent)] underline-offset-4" href={`mailto:${siteContent.contacts.email}`}>{siteContent.contacts.email}</a></div>
      </div>

      <div className="hidden grid-cols-[1fr_auto_1fr] items-start gap-8 md:grid">
        <div className={`${corner} text-left`}><span className={detailLabel}>{profile('base')}</span><span>{profile('location')}</span></div>
        <div className="flex flex-col items-center gap-3">
          <p className="m-0 text-center text-micro font-[760] tracking-[.22em] uppercase opacity-48">{profile('eyebrow')}</p>
          <a className="group inline-flex min-h-9 items-center gap-3 rounded-full border border-[color-mix(in_srgb,var(--paper)_54%,transparent)] px-4 py-2 text-caption font-[760] tracking-[.13em] text-inherit uppercase no-underline transition-[background,color,transform] duration-250 hover:-translate-y-0.5 hover:bg-paper hover:text-ink focus-visible:-translate-y-0.5 focus-visible:bg-paper focus-visible:text-ink focus-visible:outline-none" href={`mailto:${siteContent.contacts.email}`}><span>{profile('cta')}</span><span className="font-display text-lg font-normal transition-transform duration-250 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">↗</span></a>
        </div>
        <div className={`${corner} text-right`}><span className={detailLabel}>{profile('write')}</span><a className="text-inherit underline decoration-[color-mix(in_srgb,var(--paper)_30%,transparent)] underline-offset-4 transition-opacity hover:opacity-65 focus-visible:opacity-65 focus-visible:outline-none" href={`mailto:${siteContent.contacts.email}`}>{siteContent.contacts.email}</a></div>
      </div>

      <div className="mt-6 grid justify-items-center gap-4 md:mt-5 md:grid-cols-[1fr_auto_1fr] md:items-end md:justify-items-stretch md:gap-8">
        <nav className="flex flex-wrap justify-center gap-1 md:col-start-2 md:row-start-1" aria-label={profile('networks')}>
          {networks.map(network=><a className="grid h-9 w-9 place-items-center rounded-full text-inherit no-underline opacity-68 transition-[background,color,opacity] hover:bg-paper hover:text-ink hover:opacity-100 focus-visible:bg-paper focus-visible:text-ink focus-visible:opacity-100 focus-visible:outline-none" href={siteContent.contacts[network]} target="_blank" rel="noreferrer" aria-label={siteContent.networks[network]} title={siteContent.networks[network]} key={network}><SocialIcon network={network} className="h-4 w-4 text-sm"/></a>)}
        </nav>
        <p className={`${corner} m-0 text-center md:col-start-1 md:row-start-1 md:text-left`}>© {year} {siteContent.identity.name}<span className="hidden sm:inline"> · </span><span className="block sm:inline">{profile('copyright')}</span></p>
        <Link className="group text-caption font-[720] tracking-[.12em] text-inherit uppercase no-underline opacity-68 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none md:col-start-3 md:row-start-1 md:justify-self-end" href="/">{profile('home')} <span className="inline-block transition-transform duration-250 group-hover:-translate-y-1" aria-hidden="true">↑</span></Link>
      </div>
    </footer>
}
