'use client'

import { useEffect,useRef,type ReactNode } from 'react'
import { animate,createScope,createTimeline,stagger } from 'animejs'
import {useTranslations} from 'next-intl'
import { Logo } from './logo'

export function SceneShell({children,className=''}:{children:ReactNode;className?:string}){
  const book=useTranslations('Book')
  const root=useRef<HTMLElement>(null)
  const cursor=useRef<HTMLDivElement>(null)
  const noise=useRef<SVGFETurbulenceElement>(null)

  useEffect(()=>{
    if(!root.current)return
    const scope=createScope({root:root.current,mediaQueries:{reduce:'(prefers-reduced-motion: reduce)',pointer:'(pointer: fine)'}}).add(self=>{
      if(!self?.matches.reduce){
        const intro=root.current?.querySelector<HTMLElement>('.book-intro')
        createTimeline({defaults:{ease:'outExpo'},onComplete:()=>{if(intro)intro.hidden=true;window.dispatchEvent(new Event('book-opened'))}})
          .add('.intro-book',{opacity:[0,1],scale:[.94,1],x:'-25%',y:[18,0],rotateX:[10,4],duration:210})
          .add('.intro-cover',{rotateY:[0,-179],duration:690,ease:'inOutQuart'},90)
          .add('.intro-book',{x:['-25%','0%'],scale:[1,1.035],duration:690,ease:'inOutQuart'},90)
          .add('.intro-page--one',{rotateY:[0,-177],z:[8,5],duration:570,ease:'inOutQuart'},185)
          .add('.intro-page--two',{rotateY:[0,-169],z:[6,4],duration:535,ease:'inOutQuart'},225)
          .add('.intro-page--three',{rotateY:[0,-158],z:[4,3],duration:500,ease:'inOutQuart'},265)
          .add('.intro-page--four',{rotateY:[0,-146],z:[2,2],duration:465,ease:'inOutQuart'},305)
          .add('.intro-spine',{scaleY:[.6,1],opacity:[0,1],duration:260},180)
          .add('.scene-item',{opacity:[0,1],y:[12,0],delay:stagger(42),duration:410},610)
          .add('.scene-panel',{opacity:[0,1],y:[18,0],duration:460},610)
          .add('.book-intro',{opacity:[1,0],scale:[1,1.018],duration:230,ease:'outQuad'},700)
        animate('.book-layer',{scale:[1.08,1.13],x:['-1.5%','1.5%'],y:['-1%','1%'],duration:12000,alternate:true,loop:true,ease:'inOutSine'})

        const internalLinks=Array.from(root.current?.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')??[])
        const closeBook=(event:MouseEvent)=>{const link=event.currentTarget as HTMLAnchorElement;if(event.metaKey||event.ctrlKey||event.shiftKey)return;event.preventDefault();if(!intro)return;intro.hidden=false;createTimeline({defaults:{ease:'inOutQuart'},onComplete:()=>window.location.assign(link.href)}).add(intro,{opacity:[0,1],duration:140}).add('.intro-page',{rotateY:0,duration:460},0).add('.intro-cover',{rotateY:0,duration:560},55).add('.intro-book',{x:'-25%',duration:560},55)}
        internalLinks.forEach(link=>link.addEventListener('click',closeBook))
        self?.add(()=>internalLinks.forEach(link=>link.removeEventListener('click',closeBook)))
      }
      if(self?.matches.pointer&&cursor.current){
        if(noise.current)animate(noise.current,{baseFrequency:['0.008 0.014','0.02 0.028'],duration:2400,alternate:true,loop:true,ease:'inOutSine'})
        const move=(event:PointerEvent)=>animate(cursor.current!,{x:event.clientX,y:event.clientY,duration:430,ease:'outExpo'})
        const enter=()=>animate(cursor.current!,{scale:1.55,rotate:14,duration:380,ease:'outExpo'})
        const leave=()=>animate(cursor.current!,{scale:1,rotate:0,duration:420,ease:'outElastic(1, .55)'})
        const press=()=>animate(cursor.current!,{scale:[1,1.85,1.08],rotate:[0,-18,4],duration:520,ease:'outExpo'})
        window.addEventListener('pointermove',move,{passive:true})
        window.addEventListener('pointerdown',press,{passive:true})
        root.current?.querySelectorAll('a,button,input').forEach(element=>{element.addEventListener('pointerenter',enter);element.addEventListener('pointerleave',leave)})
        return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerdown',press);root.current?.querySelectorAll('a,button,input').forEach(element=>{element.removeEventListener('pointerenter',enter);element.removeEventListener('pointerleave',leave)})}
      }
    })
    return()=>scope.revert()
  },[])

  return <main ref={root} className={`relative isolate min-h-svh overflow-hidden bg-[var(--ink)] text-[var(--paper)] ${className}`}>
    <div className="book-layer absolute -inset-[6%] -z-20 bg-cover bg-center" aria-hidden="true"/>
    <div className="paper-wash absolute inset-0 -z-10" aria-hidden="true"/>
    <svg className="cursor-filter" aria-hidden="true"><defs><filter id="water-displacement"><feTurbulence ref={noise} type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="8" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="13" xChannelSelector="R" yChannelSelector="B"/></filter></defs></svg>
    <div ref={cursor} className="water-cursor pointer-events-none fixed left-0 top-0 z-50 hidden lg:block" aria-hidden="true"><span className="water-cursor__halo"/><span className="water-cursor__lens"/><span className="water-cursor__core"/></div>
    <div className="book-intro fixed inset-0 z-40 grid place-items-center overflow-hidden bg-[var(--ink)]" aria-hidden="true">
      <div className="intro-book">
        <div className="intro-book__shadow"/>
        <div className="intro-back-cover"/>
        <div className="intro-page intro-page--four"/>
        <div className="intro-page intro-page--three"/>
        <div className="intro-page intro-page--two"/>
        <div className="intro-page intro-page--one"/>
        <div className="intro-cover"><div className="intro-cover__front"><div className="cover-rule"/><Logo/><div className="cover-title"><small>{book('portfolio')}</small><strong>Fernando<br/>Forastieri</strong><span>{book('disciplines')}</span></div><p>{book('volume')}</p></div><div className="intro-cover__inside"/></div>
        <div className="intro-spine"/>
      </div>
    </div>
    {children}
  </main>
}
