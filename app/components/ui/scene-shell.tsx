'use client'

import { useEffect,useRef,type ReactNode } from 'react'
import { animate,createScope,createTimeline,stagger } from 'animejs'
import {useTranslations} from 'next-intl'
import { Logo } from './logo'
import './ui.css'

const introCode=['const idea = human;','design.with(ia);','return beautiful;']

export function SceneShell({children,className=''}:{children:ReactNode;className?:string}){
  const book=useTranslations('Book')
  const root=useRef<HTMLElement>(null)
  const cursor=useRef<HTMLDivElement>(null)
  const water=useRef<HTMLDivElement>(null)
  const noise=useRef<SVGFETurbulenceElement>(null)
  const displacement=useRef<SVGFEDisplacementMapElement>(null)

  useEffect(()=>{
    if(!root.current)return
    const scope=createScope({root:root.current,mediaQueries:{reduce:'(prefers-reduced-motion: reduce)',pointer:'(pointer: fine)'}}).add(self=>{
      if(!self?.matches.reduce){
        const intro=root.current?.querySelector<HTMLElement>('.book-intro')
        createTimeline({defaults:{ease:'outExpo'},onComplete:()=>{if(intro)intro.hidden=true;window.dispatchEvent(new Event('book-opened'))}})
          .add('.intro-book',{opacity:[0,1],scale:[.94,1],x:'-25%',y:[18,0],rotateX:[10,4],duration:210})
          .add('.intro-code-char',{opacity:[0,1],y:[4,0],delay:stagger(7),duration:55,ease:'outQuad'},20)
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
        animate('.scroll-cue-mark',{y:[0,8],opacity:[.42,1],duration:760,alternate:true,loop:true,ease:'inOutSine'})

        const internalLinks=Array.from(root.current?.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')??[])
        const closeBook=(event:MouseEvent)=>{const link=event.currentTarget as HTMLAnchorElement;if(event.metaKey||event.ctrlKey||event.shiftKey)return;event.preventDefault();if(!intro)return;intro.hidden=false;createTimeline({defaults:{ease:'inOutQuart'},onComplete:()=>window.location.assign(link.href)}).add(intro,{opacity:[0,1],duration:140}).add('.intro-page',{rotateY:0,duration:460},0).add('.intro-cover',{rotateY:0,duration:560},55).add('.intro-book',{x:'-25%',duration:560},55)}
        internalLinks.forEach(link=>link.addEventListener('click',closeBook))
        self?.add(()=>internalLinks.forEach(link=>link.removeEventListener('click',closeBook)))
      }
      if(self?.matches.pointer){
        if(noise.current)animate(noise.current,{baseFrequency:['0.008 0.014','0.02 0.028'],duration:2400,alternate:true,loop:true,ease:'inOutSine'})
        let waterVisible=false
        let animationFrame=0
        let lastDistortion=0
        const target={x:-300,y:-300}
        const trail=Array.from({length:5},()=>({x:-300,y:-300}))
        const renderTrail=()=>{
          trail[0].x+=(target.x-trail[0].x)*.3;trail[0].y+=(target.y-trail[0].y)*.3
          for(let index=1;index<trail.length;index++){
            const follow=.2-index*.018
            trail[index].x+=(trail[index-1].x-trail[index].x)*follow
            trail[index].y+=(trail[index-1].y-trail[index].y)*follow
          }
          if(water.current){
            water.current.style.setProperty('--water-x',`${target.x}px`);water.current.style.setProperty('--water-y',`${target.y}px`)
            trail.forEach((point,index)=>{water.current?.style.setProperty(`--trail-${index+1}-x`,`${point.x}px`);water.current?.style.setProperty(`--trail-${index+1}-y`,`${point.y}px`)})
          }
          animationFrame=requestAnimationFrame(renderTrail)
        }
        animationFrame=requestAnimationFrame(renderTrail)
        const move=(event:PointerEvent)=>{
          target.x=event.clientX;target.y=event.clientY
          if(cursor.current)animate(cursor.current,{x:event.clientX,y:event.clientY,duration:70,ease:'outQuad'})
          if(water.current&&!waterVisible){waterVisible=true;trail.forEach(point=>{point.x=target.x;point.y=target.y});animate(water.current,{opacity:.9,duration:220,ease:'outQuad'})}
          const now=performance.now()
          if(displacement.current&&now-lastDistortion>110){
            lastDistortion=now
            animate(displacement.current,{scale:[18,30,20],duration:520,ease:'outExpo'})
          }
        }
        const exit=()=>{waterVisible=false;if(water.current)animate(water.current,{opacity:0,duration:520,ease:'outQuad'})}
        window.addEventListener('pointermove',move,{passive:true})
        document.documentElement.addEventListener('pointerleave',exit)
        return()=>{cancelAnimationFrame(animationFrame);window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',exit)}
      }
    })
    return()=>scope.revert()
  },[])

  return <main ref={root} className={`scene-shell ${className}`}>
    <div className="book-layer" aria-hidden="true"/>
    <div ref={water} className="water-reactive-layer" aria-hidden="true"/>
    <div className="paper-wash" aria-hidden="true"/>
    <svg className="cursor-filter" aria-hidden="true"><defs><filter id="water-background-displacement" x="-25%" y="-25%" width="150%" height="150%"><feTurbulence ref={noise} type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="8" result="noise"/><feDisplacementMap ref={displacement} in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="B" result="displaced"/><feGaussianBlur in="displaced" stdDeviation="1.6"/></filter></defs></svg>
    <div ref={cursor} className="precision-cursor" aria-hidden="true"/>
    <div className="book-intro" aria-hidden="true">
      <div className="intro-book">
        <div className="intro-book__shadow"/>
        <div className="intro-back-cover"/>
        <div className="intro-page intro-page--four"/>
        <div className="intro-page intro-page--three"/>
        <div className="intro-page intro-page--two"/>
        <div className="intro-page intro-page--one"/>
        <div className="intro-cover"><div className="intro-cover__front"><div className="cover-rule"/><Logo/><div className="cover-title"><small>{book('portfolio')}</small><strong>Fernando<br/>Forastieri</strong><span>{book('disciplines')}</span></div><code className="intro-code">{introCode.map((line,lineIndex)=><span className="intro-code-line" key={line}>{line.split('').map((character,index)=><i className="intro-code-char" key={`${lineIndex}-${index}`}>{character===' '?'\u00a0':character}</i>)}</span>)}</code><p>{book('volume')}</p></div><div className="intro-cover__inside"/></div>
        <div className="intro-spine"/>
      </div>
    </div>
    {children}
  </main>
}
