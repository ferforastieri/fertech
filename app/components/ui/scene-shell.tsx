'use client'

import {useEffect,useRef,type ReactNode} from 'react'
import {animate,createScope,createTimeline,stagger,utils} from 'animejs'
import {useTranslations} from 'next-intl'
import {usePathname} from 'next/navigation'
import {WaterSurface} from './water-surface'
import './ui.css'

export function SceneShell({children,className=''}:{children:ReactNode;className?:string}){
  const system=useTranslations('System')
  const pathname=usePathname()
  const root=useRef<HTMLElement>(null)
  const routeReady=useRef(false)
  const cursor=useRef<HTMLDivElement>(null)
  const bootCode=system.raw('bootCode') as string[]
  const serverUnits=system.raw('units') as string[]

  useEffect(()=>{
    if(!root.current)return
    const scope=createScope({root:root.current,mediaQueries:{reduce:'(prefers-reduced-motion: reduce)',pointer:'(pointer: fine)'}}).add(self=>{
      const overlay=root.current?.querySelector<HTMLElement>('.server-system')
      const bootStream=root.current?.querySelector<HTMLElement>('.server-console__stream--boot')

      const revealContent=()=>{
        window.dispatchEvent(new Event('site-ready'))
        animate('.scene-item',{opacity:[0,1],y:[16,0],delay:stagger(40),duration:480,ease:'outExpo'})
        animate('.scene-panel',{opacity:[0,1],y:[22,0],duration:480,ease:'outExpo'})
      }

      if(self?.matches.reduce){
        if(overlay)overlay.hidden=true
        revealContent()
      }else{
        const shouldBoot=document.documentElement.dataset.fertecServerBooted!=='true'
        if(!shouldBoot){
          if(overlay)overlay.hidden=true
          revealContent()
        }else if(overlay){
          document.documentElement.dataset.fertecServerBooted='true'
          overlay.hidden=false
          if(bootStream)bootStream.hidden=false
          utils.set(overlay,{opacity:1})
          utils.set('.server-system__background',{opacity:0,scale:1.06})
          utils.set('.server-rack',{opacity:0,y:24,scale:.92})
          utils.set('.server-unit',{opacity:0,y:12})
          utils.set('.server-led',{opacity:.08,scale:.55})
          utils.set('.server-status',{opacity:0})
          utils.set('.server-console',{opacity:0,y:18})
          utils.set('.boot-terminal-line',{opacity:0,y:12})
          createTimeline({defaults:{ease:'outExpo'},onComplete:()=>{
            overlay.hidden=true
            revealContent()
          }})
            .add('.server-system__background',{opacity:[0,.82],scale:[1.06,1],duration:720},0)
            .add('.server-rack',{opacity:[0,1],y:[24,0],scale:[.92,1],duration:620},150)
            .add('.server-console',{opacity:[0,1],y:[18,0],duration:520},220)
            .add('.boot-terminal-line',{opacity:[0,1],y:[12,0],delay:stagger(30),duration:300},300)
            .add('.server-unit',{opacity:[0,1],y:[12,0],delay:stagger(55),duration:400},330)
            .add('.server-led',{opacity:[.08,1],scale:[.55,1],boxShadow:['0 0 0 rgba(150,255,190,0)','0 0 16px rgba(150,255,190,.95)'],delay:stagger(48),duration:220,ease:'outBack'},520)
            .add('.server-status',{opacity:[0,1],letterSpacing:['.28em','.16em'],duration:360},720)
            .add(overlay,{opacity:[1,0],duration:300,ease:'inOutQuad'},1120)
        }

      }

      if(self?.matches.pointer){
        const move=(event:PointerEvent)=>{if(cursor.current)animate(cursor.current,{x:event.clientX,y:event.clientY,opacity:1,duration:95,ease:'outQuad'})}
        const exit=()=>{if(cursor.current)animate(cursor.current,{opacity:0,duration:180,ease:'outQuad'})}
        const over=(event:PointerEvent)=>{if((event.target as Element).closest('a,button,[role="button"]')&&cursor.current)animate(cursor.current,{scale:.76,rotate:-8,duration:180,ease:'outBack'})}
        const out=(event:PointerEvent)=>{if((event.target as Element).closest('a,button,[role="button"]')&&cursor.current)animate(cursor.current,{scale:1,rotate:0,duration:180,ease:'outBack'})}
        const down=()=>{if(cursor.current)animate(cursor.current,{scale:.62,duration:100,ease:'outQuad'})}
        const up=()=>{if(cursor.current)animate(cursor.current,{scale:1,duration:190,ease:'outBack'})}
        window.addEventListener('pointermove',move,{passive:true})
        root.current?.addEventListener('pointerover',over)
        root.current?.addEventListener('pointerout',out)
        window.addEventListener('pointerdown',down)
        window.addEventListener('pointerup',up)
        document.documentElement.addEventListener('pointerleave',exit)
        return()=>{window.removeEventListener('pointermove',move);root.current?.removeEventListener('pointerover',over);root.current?.removeEventListener('pointerout',out);window.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);document.documentElement.removeEventListener('pointerleave',exit)}
      }
    })
    return()=>scope.revert()
  },[])

  useEffect(()=>{
    const view=root.current?.querySelector<HTMLElement>('.route-view')
    if(!view)return
    if(!routeReady.current){routeReady.current=true;return}
    const motion=animate(view,{opacity:[0,1],y:[18,0],filter:['blur(7px)','blur(0px)'],duration:520,ease:'outExpo'})
    return()=>{motion.revert()}
  },[pathname])

  useEffect(()=>{
    const mark=root.current?.querySelector<HTMLElement>('.scroll-cue-mark')
    if(!mark)return
    const motion=animate(mark,{y:[0,8],opacity:[.42,1],duration:760,alternate:true,loop:true,ease:'inOutSine'})
    return()=>{motion.revert()}
  },[pathname])

  return <main ref={root} className={`scene-shell ${className}`}>
    <div className="server-layer" aria-hidden="true"/>
    <WaterSurface/>
    <div className="paper-wash" aria-hidden="true"/>
    <div ref={cursor} className="custom-cursor" aria-hidden="true"><span/></div>

    <div className="server-system" aria-hidden="true">
      <div className="server-system__background"/>
      <div className="server-system__core">
        <div className="server-console">
          <div className="server-console__chrome"><span/><span/><span/><code>{system('terminalLabel')}</code></div>
          <div className="server-console__stream server-console__stream--boot">{bootCode.map((line,index)=><code className="boot-terminal-line" key={`terminal-${line}-${index}`}>{line}</code>)}</div>
        </div>
        <div className="server-rack">
          <div className="server-rack__header"><span>{system('rackLabel')}</span><i/></div>
          {serverUnits.map(unit=><div className="server-unit" key={unit}><span className="server-unit__vents"/><small>{unit}</small><div>{Array.from({length:4},(_,led)=><i className="server-led" key={led}/>)}</div></div>)}
          <p className="server-status">{system('online')}</p>
        </div>
      </div>
    </div>
    {children}
  </main>
}
