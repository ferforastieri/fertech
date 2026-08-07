'use client'

import {useEffect,useRef,useState,type ReactNode} from 'react'
import Link from 'next/link'
import {useTranslations} from 'next-intl'
import {usePathname} from 'next/navigation'
import {usePreferences,type Locale} from './preferences-provider'
import {siteContent} from '@/messages/site-content'

const iconClass='nav-icon h-[15px] w-[15px] md:h-[18px] md:w-[18px]'
const controlBase='nav-control grid h-[35px] w-[clamp(25px,7.8vw,35px)] place-items-center rounded-full border-0 bg-transparent p-0 text-inherit no-underline transition-colors duration-200 hover:bg-paper hover:text-ink focus-visible:bg-paper focus-visible:text-ink focus-visible:shadow-[inset_0_0_0_1px_var(--ink),0_0_0_2px_var(--paper)] focus-visible:outline-none md:h-10 md:w-10'

function Icon({children}:{children:ReactNode}){return <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>}

const languageOptions:ReadonlyArray<{locale:Locale;flag:string;key:'portuguese'|'english'|'spanish';code:string}>=siteContent.languages

export function FloatingNavigation(){
  const {locale,setLocale,theme,toggleTheme,navPosition,cycleNavPosition}=usePreferences()
  const pathname=usePathname()
  const currentPath=pathname.replace(/\/$/,'')||'/'
  const t=useTranslations('Navigation')
  const dropdown=useRef<HTMLDivElement>(null)
  const root=useRef<HTMLDivElement>(null)
  const [languagesOpen,setLanguagesOpen]=useState(false)
  const [drawerOpen,setDrawerOpen]=useState(false)
  const vertical=navPosition==='left'||navPosition==='right'
  const rootPosition={
    top:'sticky top-[max(10px,env(safe-area-inset-top))] mx-auto mt-[max(10px,env(safe-area-inset-top))] w-max md:fixed md:top-5 md:left-1/2 md:m-0 md:-translate-x-1/2',
    bottom:'fixed bottom-[max(12px,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 md:bottom-5',
    left:'fixed top-1/2 left-0 -translate-y-1/2 md:left-5',
    right:'fixed top-1/2 right-0 -translate-y-1/2 md:right-5',
  }[navPosition]
  const dropdownPosition={
    top:'top-[calc(100%+9px)] left-1/2 -translate-x-1/2',
    bottom:'bottom-[calc(100%+9px)] left-1/2 -translate-x-1/2',
    left:'top-1/2 left-[calc(100%+42px)] -translate-y-1/2 md:left-[calc(100%+9px)]',
    right:'top-1/2 right-[calc(100%+42px)] -translate-y-1/2 md:right-[calc(100%+9px)]',
  }[navPosition]
  const control=(active=false)=>`${controlBase}${active?' bg-[color-mix(in_srgb,var(--paper)_16%,transparent)]':''}`
  const selectedStyle=(active:boolean)=>active?{background:'var(--paper)',color:'var(--ink)'}:undefined

  useEffect(()=>{setDrawerOpen(false);setLanguagesOpen(false)},[navPosition])

  useEffect(()=>{
    if(!languagesOpen||!dropdown.current)return
    const motion=dropdown.current.animate([{opacity:0,filter:'blur(8px)'},{opacity:1,filter:'blur(0)'}],{duration:240,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'})
    const close=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setLanguagesOpen(false)}
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')setLanguagesOpen(false)}
    document.addEventListener('pointerdown',close)
    document.addEventListener('keydown',escape)
    return()=>{motion.cancel();document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',escape)}
  },[languagesOpen,navPosition])

  return <div ref={root} className={`floating-nav-root floating-nav-root--${navPosition}${drawerOpen?' is-drawer-open':''} z-30 ${rootPosition}`}>
    <button className={`${vertical?'grid':'hidden'} absolute top-1/2 z-2 h-13 w-8 -translate-y-1/2 place-items-center border border-[color-mix(in_srgb,var(--paper)_28%,transparent)] bg-[color-mix(in_srgb,var(--ink)_84%,transparent)] p-0 text-paper backdrop-blur-[18px] transition-[left,right] duration-340 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-paper md:hidden ${navPosition==='left'?`${drawerOpen?'left-13':'left-0'} rounded-r-[14px] border-l-0`:`${drawerOpen?'right-13':'right-0'} rounded-l-[14px] border-r-0`}`} type="button" onClick={()=>setDrawerOpen(open=>!open)} aria-controls="main-floating-navigation" aria-expanded={drawerOpen} aria-label={t(drawerOpen?'closeMenu':'openMenu')}>
      <Icon><path d={navPosition==='right'?(drawerOpen?'m15 6-6 6 6 6':'m9 6 6 6-6 6'):(drawerOpen?'m9 6 6 6-6 6':'m15 6-6 6 6 6')}/></Icon>
    </button>
    <nav id="main-floating-navigation" className={`floating-nav floating-nav--${navPosition} isolate flex w-max max-w-[calc(100vw-20px)] items-center justify-center gap-0 rounded-full border border-[color-mix(in_srgb,var(--paper)_28%,transparent)] bg-[color-mix(in_srgb,var(--ink)_72%,transparent)] p-1 text-paper shadow-[0_14px_45px_rgba(0,0,0,.22)] backdrop-blur-[18px] [[data-theme=light]_&]:border-[rgba(23,22,18,.24)] [[data-theme=light]_&]:bg-[rgba(246,242,234,.94)] [[data-theme=light]_&]:shadow-[0_14px_42px_rgba(48,42,32,.14)] md:gap-0.5 md:p-[5px] ${vertical?`max-h-[calc(100svh-36px)] w-[46px] flex-col overflow-y-auto transition-transform duration-340 ease-[cubic-bezier(.22,1,.36,1)] md:w-max md:translate-x-0 md:overflow-visible ${navPosition==='left'?'rounded-l-none rounded-r-[22px] md:rounded-full':'rounded-r-none rounded-l-[22px] md:rounded-full'} ${drawerOpen?'translate-x-0':navPosition==='left'?'-translate-x-[110%]':'translate-x-[110%]'}`:''}`} aria-label={t('main')}>
      <Link className={control(currentPath==='/')} style={selectedStyle(currentPath==='/')} href="/" aria-current={currentPath==='/'?'page':undefined} aria-label={t('home')} title={t('home')}><Icon><path d="M3.5 11.2 12 4l8.5 7.2"/><path d="M5.5 10v9.5h13V10M9.5 19.5v-6h5v6"/></Icon></Link>
      <Link className={control(currentPath.startsWith('/projetos'))} style={selectedStyle(currentPath.startsWith('/projetos'))} href="/projetos" aria-current={currentPath.startsWith('/projetos')?'page':undefined} aria-label={t('projects')} title={t('projects')}><Icon><path d="M4 7h16v12H4zM8 7V4h8v3"/></Icon></Link>
      <Link className={control(currentPath==='/sobre')} style={selectedStyle(currentPath==='/sobre')} href="/sobre" aria-current={currentPath==='/sobre'?'page':undefined} aria-label={t('about')} title={t('about')}><Icon><circle cx="12" cy="8" r="3"/><path d="M5 20c.6-4 3-6 7-6s6.4 2 7 6"/></Icon></Link>
      <Link className={control(currentPath==='/curriculo')} style={selectedStyle(currentPath==='/curriculo')} href="/curriculo" aria-current={currentPath==='/curriculo'?'page':undefined} aria-label={t('resume')} title={t('resume')}><Icon><path d="M6 3h9l3 3v15H6zM15 3v4h4M9 11h6M9 15h6M9 18h4"/></Icon></Link>
      <span className={`${vertical?'my-px h-px w-[18px] md:my-0.75 md:h-px md:w-5':'mx-px h-[18px] w-px md:mx-0.75 md:h-5'} bg-[color-mix(in_srgb,var(--paper)_22%,transparent)]`} aria-hidden="true"/>
      <a className={control()} href={siteContent.contacts.github} target="_blank" rel="noreferrer" aria-label={siteContent.networks.github} title={siteContent.networks.github}><svg className={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" clipRule="evenodd"/></svg></a>
      <a className={control()} href={siteContent.contacts.linkedin} target="_blank" rel="noreferrer" aria-label={siteContent.networks.linkedin} title={siteContent.networks.linkedin}><svg className={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"/></svg></a>
      <a className={`${control()} text-[15px] font-medium`} href={siteContent.contacts.x} target="_blank" rel="noreferrer" aria-label={siteContent.networks.x} title={siteContent.networks.x}>{siteContent.networks.x}</a>
      <button className={control()} type="button" onClick={()=>setLanguagesOpen(open=>!open)} aria-label={t('language')} title={t('language')} aria-expanded={languagesOpen}><Icon><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z"/></Icon></button>
      <button className={control()} type="button" onClick={toggleTheme} aria-label={t('theme')} title={t('theme')}>{theme==='dark'?<Icon><circle cx="12" cy="12" r="3.6"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></Icon>:<Icon><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z"/></Icon>}</button>
      <button className={control()} type="button" onClick={cycleNavPosition} aria-label={t('move')} title={t('move')}><Icon>{vertical?<><path d="M4 12h16M7 9l-3 3 3 3M17 9l3 3-3 3"/></>:<><path d="M12 4v16M9 7l3-3 3 3M9 17l3 3 3-3"/></>}</Icon></button>
    </nav>
    {languagesOpen&&<div ref={dropdown} className={`language-dropdown language-dropdown--${navPosition} absolute w-[190px] origin-center rounded-[17px] border border-[color-mix(in_srgb,var(--paper)_25%,transparent)] bg-[color-mix(in_srgb,var(--ink)_91%,transparent)] p-[5px] text-paper shadow-[0_18px_50px_rgba(0,0,0,.3)] backdrop-blur-[22px] [[data-theme=light]_&]:border-[rgba(23,22,18,.24)] [[data-theme=light]_&]:bg-[rgba(246,242,234,.94)] ${dropdownPosition}`} role="menu">{languageOptions.map(option=><button key={option.locale} className={`grid w-full grid-cols-[24px_1fr_auto] items-center gap-2 rounded-xl border-0 bg-transparent px-2.5 py-2.25 text-left text-body-sm font-semibold text-inherit hover:bg-[color-mix(in_srgb,var(--paper)_12%,transparent)] focus-visible:bg-[color-mix(in_srgb,var(--paper)_12%,transparent)] focus-visible:outline-none ${locale===option.locale?'bg-[color-mix(in_srgb,var(--paper)_12%,transparent)]':''}`} type="button" role="menuitemradio" aria-checked={locale===option.locale} onClick={()=>{setLocale(option.locale);setLanguagesOpen(false)}}><span aria-hidden="true">{option.flag}</span><span>{t(option.key)}</span><small className="text-caption tracking-[.14em] opacity-52">{option.code}</small></button>)}</div>}
  </div>
}
