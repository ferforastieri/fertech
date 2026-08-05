'use client'

import {useRef,useState} from 'react'
import {useTranslations} from 'next-intl'
import {useScrollReveal} from '@/app/hooks/use-scroll-reveal'
import {LiquidLab,type LiquidMode,type LiquidSettings} from './liquid-lab'
import './webgl.css'

const modes:LiquidMode[]=['ripple','rain','pulse']

export function WebGLPage(){
  const t=useTranslations('WebGL')
  const root=useRef<HTMLDivElement>(null)
  const [settings,setSettings]=useState<LiquidSettings>({mode:'ripple',intensity:4,radius:3,paused:false})
  const [clearToken,setClearToken]=useState(0)
  useScrollReveal(root,'.webgl-reveal')
  return <div ref={root} className="editorial-page webgl-page">
    <header className="webgl-heading webgl-reveal"><p>{t('eyebrow')}</p><h1>{t('title')}</h1><span>{t('description')}</span></header>
    <section className="webgl-console webgl-reveal">
      <div className="webgl-canvas"><LiquidLab settings={settings} clearToken={clearToken} label={t('canvasLabel')}/><p>{t('hint')}</p><code>{t('status')}</code></div>
      <aside className="webgl-controls" aria-label={t('controls')}>
        <header><span>{t('controls')}</span><i className={settings.paused?'':'is-live'}/></header>
        <fieldset><legend>{t('mode')}</legend><div>{modes.map(mode=><button key={mode} className={settings.mode===mode?'is-active':''} type="button" onClick={()=>setSettings(current=>({...current,mode}))}>{t(`modes.${mode}`)}</button>)}</div></fieldset>
        <label><span>{t('intensity')}</span><output>{settings.intensity}</output><input type="range" min="1" max="8" value={settings.intensity} onChange={event=>setSettings(current=>({...current,intensity:Number(event.target.value)}))}/></label>
        <label><span>{t('radius')}</span><output>{settings.radius}</output><input type="range" min="1" max="8" value={settings.radius} onChange={event=>setSettings(current=>({...current,radius:Number(event.target.value)}))}/></label>
        <div className="webgl-actions"><button type="button" onClick={()=>setSettings(current=>({...current,paused:!current.paused}))}>{t(settings.paused?'resume':'pause')}</button><button type="button" onClick={()=>setClearToken(value=>value+1)}>{t('clear')}</button></div>
      </aside>
    </section>
  </div>
}
