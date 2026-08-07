'use client'

import {useTranslations} from 'next-intl'
import {usePathname} from 'next/navigation'
import {TypedText} from './typed-text'
import {siteContent} from '@/messages/site-content'

export function GlobalProfile(){
  const profile=useTranslations('Profile')
  const path=usePathname().replace(/\/$/,'')||'/'
  const isHome=path==='/'
  const isAbout=path==='/sobre'
  return <aside className={`global-profile scene-item relative z-30 mx-auto block w-[min(calc(100%_-_48px),300px)] border-t border-[color-mix(in_srgb,var(--paper)_32%,transparent)] pt-6 text-center text-[color-mix(in_srgb,var(--paper)_92%,transparent)] transition-[margin-top] duration-340 ease-[cubic-bezier(.22,1,.36,1)] md:fixed md:top-[26px] md:right-[4.5vw] md:m-0 md:w-[min(21vw,250px)] md:border-0 md:pt-0 md:text-right md:max-[1100px]:w-[210px] ${isHome?'mt-6 border-t-0 pt-0':isAbout?'mt-2':'mt-6'}`}>
    <p className="global-profile__signature m-0 origin-center -rotate-3 font-display text-[clamp(28px,8vw,35px)] leading-none italic md:origin-right md:text-[clamp(30px,3vw,46px)]"><TypedText text={profile('signature')}/></p>
    <p className="global-profile__introduction mx-auto my-2 max-w-[34ch] text-small leading-[1.45] font-[540] opacity-78 md:mt-[15px] md:mr-0 md:mb-3.5 md:ml-auto md:max-w-[31ch] md:text-body-sm md:leading-[1.55] md:max-[1100px]:text-small"><TypedText text={profile('introduction')}/></p>
    <a className="global-profile__contact group inline-flex min-h-8.5 items-center gap-2.5 rounded-full border border-[color-mix(in_srgb,var(--paper)_54%,transparent)] px-[11px] py-1.5 text-caption font-[760] tracking-[.12em] text-inherit uppercase no-underline md:min-h-9 md:gap-4 md:px-[15px] md:py-2 md:text-label" href={siteContent.contacts.linkedin} target="_blank" rel="noreferrer"><TypedText text={profile('cta')}/><span className="text-sm transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">↗</span></a>
  </aside>
}
