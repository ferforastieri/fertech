'use client'

import {useEffect,useRef,type ReactNode} from 'react'
import {animate} from 'animejs'
import {usePathname} from 'next/navigation'
import {WaterSurface} from './water-surface'
import './ui.css'

export function SceneShell({children,className=''}:{children:ReactNode;className?:string}){
  const pathname=usePathname()
  const root=useRef<HTMLElement>(null)
  const routeReady=useRef(false)
  const cursor=useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if(!root.current)return
    if(matchMedia('(pointer: fine)').matches){
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
  },[])

  useEffect(()=>{
    const view=root.current?.querySelector<HTMLElement>('.route-view')
    if(!view)return
    if(!routeReady.current){routeReady.current=true;return}
    const motion=animate(view,{opacity:[0,1],y:[24,0],scale:[.994,1],filter:['blur(10px)','blur(0px)'],duration:680,ease:'outExpo'})
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

    {children}
  </main>
}
