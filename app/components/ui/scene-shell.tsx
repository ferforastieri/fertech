'use client'

import { useEffect,useRef,type ReactNode } from 'react'
import { animate,createScope,createTimeline,stagger } from 'animejs'

export function SceneShell({children,className=''}:{children:ReactNode;className?:string}){
  const root=useRef<HTMLElement>(null)
  const cursor=useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if(!root.current)return
    const scope=createScope({root:root.current,mediaQueries:{reduce:'(prefers-reduced-motion: reduce)',pointer:'(pointer: fine)'}}).add(self=>{
      if(!self?.matches.reduce){
        createTimeline({defaults:{ease:'outExpo'}})
          .add('.scene-item',{opacity:[0,1],y:[16,0],delay:stagger(65),duration:620})
          .add('.scene-line',{y:['110%',0],delay:stagger(110),duration:1050},'-=420')
          .add('.scene-portrait',{opacity:[0,1],scale:[.84,1],rotate:[-3,0],duration:900},'-=720')
          .add('.scene-panel',{opacity:[0,1],y:[26,0],duration:740},'-=540')
        animate('.book-layer',{scale:[1.08,1.13],x:['-1.5%','1.5%'],y:['-1%','1%'],duration:12000,alternate:true,loop:true,ease:'inOutSine'})
      }
      if(self?.matches.pointer&&cursor.current){
        const move=(event:PointerEvent)=>animate(cursor.current!,{x:event.clientX,y:event.clientY,duration:520,ease:'outExpo'})
        const enter=()=>animate(cursor.current!,{scale:2.1,rotate:18,borderRadius:'38% 62% 58% 42%',duration:360,ease:'outExpo'})
        const leave=()=>animate(cursor.current!,{scale:1,rotate:0,borderRadius:'58% 42% 48% 52%',duration:360,ease:'outExpo'})
        window.addEventListener('pointermove',move,{passive:true})
        root.current?.querySelectorAll('a,button,input').forEach(element=>{element.addEventListener('pointerenter',enter);element.addEventListener('pointerleave',leave)})
        return()=>{window.removeEventListener('pointermove',move);root.current?.querySelectorAll('a,button,input').forEach(element=>{element.removeEventListener('pointerenter',enter);element.removeEventListener('pointerleave',leave)})}
      }
    })
    return()=>scope.revert()
  },[])

  return <main ref={root} className={`relative isolate min-h-svh overflow-hidden bg-[var(--ink)] text-[var(--paper)] ${className}`}>
    <div className="book-layer absolute -inset-[6%] -z-20 bg-cover bg-center" aria-hidden="true"/>
    <div className="paper-wash absolute inset-0 -z-10" aria-hidden="true"/>
    <div ref={cursor} className="custom-cursor pointer-events-none fixed left-0 top-0 z-50 hidden h-7 w-9 bg-[var(--paper)] mix-blend-difference lg:block" aria-hidden="true"/>
    {children}
  </main>
}
