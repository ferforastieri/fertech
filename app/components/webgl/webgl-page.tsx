'use client'

import {useRef,useState} from 'react'
import {animate} from 'animejs'
import {useTranslations} from 'next-intl'
import {useScrollReveal} from '@/app/hooks/use-scroll-reveal'
import {AuroraLab,type AuroraMotion,type AuroraScene,type AuroraSettings} from './aurora-lab'
import './webgl.css'

const scenes:AuroraScene[]=['field','prism','signal','grid','tunnel','terrain','aim']
const motions:AuroraMotion[]=['orbit','wave','chaos']
const colors=['#ff5b3d','#eee6d9','#8da9ff','#b89cff','#7fcda6']

export function WebGLPage(){
  const t=useTranslations('WebGL')
  const root=useRef<HTMLDivElement>(null)
  const [settings,setSettings]=useState<AuroraSettings>({scene:'field',motion:'orbit',color:colors[0],density:110,speed:1,brush:3,paused:false,drawing:true})
  const [clearToken,setClearToken]=useState(0)
  useScrollReveal(root,'.webgl-reveal')
  const update=(next:Partial<AuroraSettings>)=>setSettings(current=>({...current,...next}))
  const selectScene=(scene:AuroraScene,event:React.MouseEvent<HTMLButtonElement>)=>{update({scene});animate(event.currentTarget,{scale:[.92,1],duration:430,ease:'out(3)'})}
  const randomize=()=>update({scene:scenes[Math.floor(Math.random()*scenes.length)],motion:motions[Math.floor(Math.random()*motions.length)],color:colors[Math.floor(Math.random()*colors.length)],density:55+Math.round(Math.random()*115),speed:Number((.45+Math.random()*1.7).toFixed(1))})
  return <div ref={root} className="editorial-page webgl-page">
    <header className="webgl-heading webgl-reveal"><p>{t('eyebrow')}</p><h1>{t('title')}</h1><span>{t('description')}</span></header>
    <nav className="experiment-switcher webgl-reveal" aria-label={t('experimentsLabel')}>{scenes.map((scene,index)=><button key={scene} type="button" className={settings.scene===scene?'is-active':''} onClick={event=>selectScene(scene,event)}><span>{String(index+1).padStart(2,'0')}</span><strong>{t(`scenes.${scene}.title`)}</strong></button>)}</nav>
    <section className="webgl-console webgl-reveal">
      <div className="webgl-canvas"><AuroraLab settings={settings} clearToken={clearToken} label={t('canvasLabel')}/><div className="webgl-scene-copy"><code>{t(`scenes.${settings.scene}.eyebrow`)}</code><h2>{t(`scenes.${settings.scene}.title`)}</h2><p>{t(`scenes.${settings.scene}.description`)}</p></div><p className="webgl-hint">{t(settings.drawing?'hint':'hintExplore')}</p><span className="webgl-status">{t('status')}</span></div>
      <aside className="webgl-controls" aria-label={t('controls')}>
        <header><span>{t('controls')}</span><i className={settings.paused?'':'is-live'}/></header>
        <fieldset><legend>{t('motion')}</legend><div>{motions.map(motion=><button key={motion} className={settings.motion===motion?'is-active':''} type="button" onClick={()=>update({motion})}>{t(`motions.${motion}`)}</button>)}</div></fieldset>
        <fieldset className="webgl-palette"><legend>{t('color')}</legend><div>{colors.map(color=><button key={color} type="button" className={settings.color===color?'is-active':''} style={{'--swatch':color} as React.CSSProperties} onClick={()=>update({color})} aria-label={`${t('color')} ${color}`}/>)}</div></fieldset>
        <label><span>{t('elements')}</span><output>{settings.density}</output><input type="range" min="30" max="180" value={settings.density} onChange={event=>update({density:Number(event.target.value)})}/></label>
        <label><span>{t('speed')}</span><output>{settings.speed.toFixed(1)}</output><input type="range" min="0.2" max="2.5" step="0.1" value={settings.speed} onChange={event=>update({speed:Number(event.target.value)})}/></label>
        <label><span>{t('brush')}</span><output>{settings.brush}</output><input type="range" min="1" max="8" value={settings.brush} onChange={event=>update({brush:Number(event.target.value)})}/></label>
        <button type="button" className={settings.drawing?'webgl-drawing is-active':'webgl-drawing'} onClick={()=>update({drawing:!settings.drawing})}>{t(settings.drawing?'drawingEnabled':'enableDrawing')}</button>
        <div className="webgl-actions"><button type="button" onClick={()=>update({paused:!settings.paused})}>{t(settings.paused?'resume':'pause')}</button><button type="button" onClick={randomize}>{t('randomize')}</button><button type="button" onClick={()=>setClearToken(value=>value+1)}>{t('clear')}</button></div>
      </aside>
    </section>
  </div>
}
