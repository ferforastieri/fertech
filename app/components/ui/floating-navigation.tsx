'use client'

import {useEffect,useRef} from 'react'
import {animate,stagger} from 'animejs'
import {Logo} from './logo'
import {usePreferences,type Locale} from './preferences-provider'

const labels={
  'pt-BR':{home:'Início',contact:'Contato',theme:'Alternar tema',move:'Mover navegação',language:'Selecionar idioma'},
  en:{home:'Home',contact:'Contact',theme:'Switch theme',move:'Move navigation',language:'Select language'},
  es:{home:'Inicio',contact:'Contacto',theme:'Cambiar tema',move:'Mover navegación',language:'Seleccionar idioma'},
}

const localeLabels:Record<Locale,string>={'pt-BR':'PT',en:'EN',es:'ES'}

export function FloatingNavigation(){
  const {locale,setLocale,theme,toggleTheme,navPosition,cycleNavPosition}=usePreferences()
  const nav=useRef<HTMLElement>(null)
  const vertical=navPosition==='left'||navPosition==='right'
  const copy=labels[locale]

  useEffect(()=>{
    if(!nav.current)return
    animate(nav.current,{opacity:[0,1],filter:['blur(10px)','blur(0px)'],duration:420,ease:'outExpo'})
    animate(nav.current.querySelectorAll('.nav-control'),{opacity:[0,1],scale:[.82,1],delay:stagger(38),duration:360,ease:'outBack'})
  },[navPosition])

  return <nav ref={nav} className={`floating-nav floating-nav--${navPosition}`} aria-label="Navegação principal">
    <a className="nav-control nav-brand" href="#inicio" aria-label={copy.home}><Logo/></a>
    <span className="nav-divider"/>
    <a className="nav-control nav-text" href="https://linkedin.com/in/fernando-forastieri" target="_blank" rel="noreferrer">{copy.contact}</a>
    <span className="nav-divider"/>
    <div className="nav-locales" role="group" aria-label={copy.language}>{(Object.keys(localeLabels) as Locale[]).map(option=><button key={option} className={`nav-control nav-locale${locale===option?' is-active':''}`} type="button" onClick={()=>setLocale(option)} aria-pressed={locale===option}>{localeLabels[option]}</button>)}</div>
    <button className="nav-control nav-symbol" type="button" onClick={toggleTheme} aria-label={copy.theme} title={copy.theme}>{theme==='dark'?'☼':'☾'}</button>
    <button className="nav-control nav-symbol" type="button" onClick={cycleNavPosition} aria-label={copy.move} title={copy.move}>{vertical?'↔':'↕'}</button>
  </nav>
}
