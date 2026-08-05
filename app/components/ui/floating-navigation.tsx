'use client'

import {useEffect,useRef,useState,type ReactNode} from 'react'
import {animate,stagger} from 'animejs'
import {useTranslations} from 'next-intl'
import {Logo} from './logo'
import {usePreferences,type Locale} from './preferences-provider'

function Icon({children}:{children:ReactNode}){return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>}

const languageOptions:Array<{locale:Locale;flag:string;key:'portuguese'|'english'|'spanish';code:string}>=[
  {locale:'pt-BR',flag:'🇧🇷',key:'portuguese',code:'PT'},
  {locale:'en',flag:'🇺🇸',key:'english',code:'EN'},
  {locale:'es',flag:'🇪🇸',key:'spanish',code:'ES'},
]

export function FloatingNavigation(){
  const {locale,setLocale,theme,toggleTheme,navPosition,cycleNavPosition}=usePreferences()
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
      <a className="nav-control nav-brand" href="#inicio" aria-label={t('home')} title={t('home')}><Logo/></a>
      <a className="nav-control" href="https://linkedin.com/in/fernando-forastieri" target="_blank" rel="noreferrer" aria-label={t('contact')} title={t('contact')}><Icon><path d="M7 17 17 7M8 7h9v9"/></Icon></a>
      <button className="nav-control" type="button" onClick={()=>setLanguagesOpen(open=>!open)} aria-label={t('language')} title={t('language')} aria-expanded={languagesOpen}><Icon><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z"/></Icon></button>
      <button className="nav-control" type="button" onClick={toggleTheme} aria-label={t('theme')} title={t('theme')}>{theme==='dark'?<Icon><circle cx="12" cy="12" r="3.6"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></Icon>:<Icon><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z"/></Icon>}</button>
      <button className="nav-control" type="button" onClick={cycleNavPosition} aria-label={t('move')} title={t('move')}><Icon>{navPosition==='left'||navPosition==='right'?<><path d="M4 12h16M7 9l-3 3 3 3M17 9l3 3-3 3"/></>:<><path d="M12 4v16M9 7l3-3 3 3M9 17l3 3 3-3"/></>}</Icon></button>
    </nav>
    {languagesOpen&&<div ref={dropdown} className={`language-dropdown language-dropdown--${navPosition}`} role="menu">{languageOptions.map(option=><button key={option.locale} className={`language-option${locale===option.locale?' is-active':''}`} type="button" role="menuitemradio" aria-checked={locale===option.locale} onClick={()=>{setLocale(option.locale);setLanguagesOpen(false)}}><span aria-hidden="true">{option.flag}</span><span>{t(option.key)}</span><small>{option.code}</small></button>)}</div>}
  </div>
}
