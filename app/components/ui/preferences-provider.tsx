'use client'

import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from 'react'
import {NextIntlClientProvider} from 'next-intl'
import ptBR from '@/messages/pt-BR.json'
import en from '@/messages/en.json'
import es from '@/messages/es.json'

export type Locale='pt-BR'|'en'|'es'
export type Theme='dark'|'light'
export type NavPosition='top'|'right'|'bottom'|'left'

const locales:Locale[]=['pt-BR','en','es']
const positions:NavPosition[]=['top','right','bottom','left']
const messages={'pt-BR':ptBR,en,es}

type Preferences={
  locale:Locale
  theme:Theme
  navPosition:NavPosition
  setLocale:(locale:Locale)=>void
  toggleTheme:()=>void
  cycleNavPosition:()=>void
}

const PreferencesContext=createContext<Preferences|null>(null)

export function PreferencesProvider({children}:{children:ReactNode}){
  const [locale,setLocaleState]=useState<Locale>('pt-BR')
  const [theme,setTheme]=useState<Theme>('dark')
  const [navPosition,setNavPosition]=useState<NavPosition>('top')

  useEffect(()=>{
    const storedLocale=localStorage.getItem('fertec-locale')
    const browserLocale=navigator.languages?.find(language=>/^(pt|en|es)/i.test(language))
    const initialLocale=locales.includes(storedLocale as Locale)
      ? storedLocale as Locale
      : browserLocale?.toLowerCase().startsWith('en')?'en':browserLocale?.toLowerCase().startsWith('es')?'es':'pt-BR'
    const storedTheme=localStorage.getItem('theme')
    const initialTheme:Theme=storedTheme==='light'||storedTheme==='dark'
      ? storedTheme
      : matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'
    const storedPosition=localStorage.getItem('aurora-nav-position')
    const initialPosition=positions.includes(storedPosition as NavPosition)
      ? storedPosition as NavPosition
      : matchMedia('(max-width: 767px)').matches?'bottom':'top'
    setLocaleState(initialLocale)
    setTheme(initialTheme)
    setNavPosition(initialPosition)
  },[])

  useEffect(()=>{
    document.documentElement.dataset.theme=theme
    document.documentElement.style.colorScheme=theme
    localStorage.setItem('theme',theme)
  },[theme])

  useEffect(()=>{
    document.documentElement.lang=locale
    localStorage.setItem('fertec-locale',locale)
  },[locale])

  const value=useMemo<Preferences>(()=>({
    locale,
    theme,
    navPosition,
    setLocale:next=>setLocaleState(next),
    toggleTheme:()=>setTheme(current=>current==='dark'?'light':'dark'),
    cycleNavPosition:()=>setNavPosition(current=>{
      const next=positions[(positions.indexOf(current)+1)%positions.length]
      localStorage.setItem('aurora-nav-position',next)
      return next
    }),
  }),[locale,theme,navPosition])

  return <PreferencesContext.Provider value={value}><NextIntlClientProvider locale={locale} timeZone="America/Sao_Paulo" messages={messages[locale]}>{children}</NextIntlClientProvider></PreferencesContext.Provider>
}

export function usePreferences(){
  const context=useContext(PreferencesContext)
  if(!context)throw new Error('usePreferences must be used inside PreferencesProvider')
  return context
}
