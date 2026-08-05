'use client'

import {useEffect,useRef,useState,type ReactNode} from 'react'
import {animate,stagger} from 'animejs'
import {useTranslations} from 'next-intl'
import {usePathname} from 'next/navigation'
import {usePreferences,type Locale} from './preferences-provider'

function Icon({children}:{children:ReactNode}){return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>}

const languageOptions:Array<{locale:Locale;flag:string;key:'portuguese'|'english'|'spanish';code:string}>=[
  {locale:'pt-BR',flag:'🇧🇷',key:'portuguese',code:'PT'},
  {locale:'en',flag:'🇺🇸',key:'english',code:'EN'},
  {locale:'es',flag:'🇪🇸',key:'spanish',code:'ES'},
]

export function FloatingNavigation(){
  const {locale,setLocale,theme,toggleTheme,navPosition,cycleNavPosition}=usePreferences()
  const pathname=usePathname()
  const currentPath=pathname.replace(/\/$/,'')||'/'
  const t=useTranslations('Navigation')
  const nav=useRef<HTMLElement>(null)
  const dropdown=useRef<HTMLDivElement>(null)
  const root=useRef<HTMLDivElement>(null)
  const [languagesOpen,setLanguagesOpen]=useState(false)

  useEffect(()=>{
    if(!nav.current)return
    animate(nav.current,{opacity:[0,1],filter:['blur(10px)','blur(0px)'],duration:420,ease:'outExpo'})
    animate(nav.current.querySelectorAll('.nav-control'),{opacity:[0,1],scale:[.82,1],delay:stagger(38),duration:360,ease:'outBack'})
  },[navPosition])

  useEffect(()=>{
    if(!languagesOpen||!dropdown.current)return
    animate(dropdown.current,{opacity:[0,1],filter:['blur(8px)','blur(0px)'],duration:240,ease:'outExpo'})
    const close=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setLanguagesOpen(false)}
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')setLanguagesOpen(false)}
    document.addEventListener('pointerdown',close)
    document.addEventListener('keydown',escape)
    return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',escape)}
  },[languagesOpen,navPosition])

  return <div ref={root} className={`floating-nav-root floating-nav-root--${navPosition}`}>
    <nav ref={nav} className={`floating-nav floating-nav--${navPosition}`} aria-label={t('main')}>
      <a className={`nav-control${currentPath==='/'?' is-active':''}`} href="/" aria-label={t('home')} title={t('home')}><Icon><path d="m4 11 8-7 8 7v9h-6v-6h-4v6H4Z"/></Icon></a>
      <a className={`nav-control${currentPath.startsWith('/projetos')?' is-active':''}`} href="/projetos" aria-label={t('projects')} title={t('projects')}><Icon><path d="M4 7h16v12H4zM8 7V4h8v3"/></Icon></a>
      <a className={`nav-control${currentPath==='/sobre'?' is-active':''}`} href="/sobre" aria-label={t('about')} title={t('about')}><Icon><circle cx="12" cy="8" r="3"/><path d="M5 20c.6-4 3-6 7-6s6.4 2 7 6"/></Icon></a>
      <span className="nav-separator" aria-hidden="true"/>
      <a className="nav-control" href="https://github.com/ferforastieri" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" clipRule="evenodd"/></svg></a>
      <a className="nav-control" href="https://linkedin.com/in/fernando-forastieri" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"/></svg></a>
      <a className="nav-control nav-x" href="https://x.com/viciofer" target="_blank" rel="noreferrer" aria-label="X" title="X">X</a>
      <button className="nav-control" type="button" onClick={()=>setLanguagesOpen(open=>!open)} aria-label={t('language')} title={t('language')} aria-expanded={languagesOpen}><Icon><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z"/></Icon></button>
      <button className="nav-control" type="button" onClick={toggleTheme} aria-label={t('theme')} title={t('theme')}>{theme==='dark'?<Icon><circle cx="12" cy="12" r="3.6"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></Icon>:<Icon><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z"/></Icon>}</button>
      <button className="nav-control" type="button" onClick={cycleNavPosition} aria-label={t('move')} title={t('move')}><Icon>{navPosition==='left'||navPosition==='right'?<><path d="M4 12h16M7 9l-3 3 3 3M17 9l3 3-3 3"/></>:<><path d="M12 4v16M9 7l3-3 3 3M9 17l3 3 3-3"/></>}</Icon></button>
    </nav>
    {languagesOpen&&<div ref={dropdown} className={`language-dropdown language-dropdown--${navPosition}`} role="menu">{languageOptions.map(option=><button key={option.locale} className={`language-option${locale===option.locale?' is-active':''}`} type="button" role="menuitemradio" aria-checked={locale===option.locale} onClick={()=>{setLocale(option.locale);setLanguagesOpen(false)}}><span aria-hidden="true">{option.flag}</span><span>{t(option.key)}</span><small>{option.code}</small></button>)}</div>}
  </div>
}
