'use client'

import { useEffect,useRef,type ReactNode } from 'react'
import { animate,createScope,createTimeline,stagger } from 'animejs'
import {useTranslations} from 'next-intl'
import { Logo } from './logo'
import './ui.css'

const introCode=['class Portfolio {','  constructor(public mind: Human) {}','  async build(): Promise<Experience> {','    return this.design.with({ ai: true });','  }','}']
const introPages=[
  {layer:'four',front:['export type Vision = {','  software: true;','  human: true;','};'],back:['SELECT craft, clarity','FROM experience','ORDER BY impact DESC;']},
  {layer:'three',front:['async function build() {','  const idea = await think();','  return ship(idea);','}'],back:['interface Product {','  useful: boolean;','  beautiful: boolean;','}']},
  {layer:'two',front:['const stack = [','  "interfaces",','  "ai", "hardware"','];'],back:['model.learn(context);','system.scale();','team.collaborate();']},
  {layer:'one',front:['while (curious) {','  study();','  create();','}'],back:['git commit -m','"make it tangible"','// Fernando, 2026']},
] as const

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
        const mobileBook=window.matchMedia('(max-width: 767px)').matches
        const mobileOpenWidth=mobileBook?Math.min(window.innerWidth-24,(window.innerHeight-32)*1.4,740):0
        const mobileOpenHeight=mobileOpenWidth/1.4
        const closedBookScale=mobileBook?Math.max(1,Math.min(1.75,(window.innerWidth*.86*2)/mobileOpenWidth,(window.innerHeight*.9)/mobileOpenHeight)):1
        let revealObserver:IntersectionObserver|undefined
        const setupScrollReveals=()=>{
          if(revealObserver||!root.current)return
          revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
            if(!entry.isIntersecting)return
            const element=entry.target as HTMLElement
            revealObserver?.unobserve(element)
            animate(element,{opacity:[0,1],y:[38,0],rotateX:[4,0],filter:['blur(8px)','blur(0px)'],duration:880,ease:'outExpo'})
          }),{threshold:.12,rootMargin:'0px 0px -7% 0px'})
          root.current.querySelectorAll<HTMLElement>('.scroll-reveal').forEach(element=>revealObserver?.observe(element))
        }
        if(intro?.hidden)setupScrollReveals()
        else window.addEventListener('book-opened',setupScrollReveals,{once:true})
        self?.add(()=>{window.removeEventListener('book-opened',setupScrollReveals);revealObserver?.disconnect()})
        createTimeline({defaults:{ease:'outExpo'},onComplete:()=>{if(intro)intro.hidden=true;window.dispatchEvent(new Event('book-opened'))}})
          .add('.intro-book',{opacity:[0,1],scale:mobileBook?[closedBookScale*.94,closedBookScale]:[.92,1],x:'-25%',y:[26,0],rotateX:[12,4],duration:450})
          .add('.intro-cover',{rotateY:[0,-179],duration:1000,ease:'inOutQuart'},320)
          .add('.intro-book',{x:['-25%','0%'],scale:[closedBookScale,mobileBook?1:1.035],duration:1000,ease:'inOutQuart'},320)
          .add('.intro-page--one',{rotateY:[0,-177],z:[8,5],duration:680,ease:'inOutQuart'},1260)
          .add('.intro-page--one .intro-page-code--front',{opacity:[1,0],duration:90},1530)
          .add('.intro-page--one .intro-page-code--back',{opacity:[0,1],duration:90},1530)
          .add('.intro-page--two',{rotateY:[0,-169],z:[6,4],duration:660,ease:'inOutQuart'},1550)
          .add('.intro-page--two .intro-page-code--front',{opacity:[1,0],duration:90},1810)
          .add('.intro-page--two .intro-page-code--back',{opacity:[0,1],duration:90},1810)
          .add('.intro-page--three',{rotateY:[0,-158],z:[4,3],duration:640,ease:'inOutQuart'},1840)
          .add('.intro-page--three .intro-page-code--front',{opacity:[1,0],duration:90},2090)
          .add('.intro-page--three .intro-page-code--back',{opacity:[0,1],duration:90},2090)
          .add('.intro-page--four',{rotateY:[0,-146],z:[2,2],duration:620,ease:'inOutQuart'},2130)
          .add('.intro-page--four .intro-page-code--front',{opacity:[1,0],duration:90},2370)
          .add('.intro-page--four .intro-page-code--back',{opacity:[0,1],duration:90},2370)
          .add('.intro-spine',{scaleY:[.6,1],opacity:[0,1],duration:420},680)
          .add('.scene-item',{opacity:[0,1],y:[16,0],delay:stagger(48),duration:520},2580)
          .add('.scene-panel',{opacity:[0,1],y:[22,0],duration:520},2580)
          .add('.book-intro',{opacity:[1,0],scale:[1,1.012],duration:360,ease:'outQuad'},2800)
        animate('.book-layer,.water-reactive-layer',{scale:[1.04,1.08],x:['-1%','1%'],y:['-.7%','.7%'],duration:12000,alternate:true,loop:true,ease:'inOutSine'})
        animate('.scroll-cue-mark',{y:[0,8],opacity:[.42,1],duration:760,alternate:true,loop:true,ease:'inOutSine'})

        const internalLinks=Array.from(root.current?.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')??[])
        const closeBook=(event:MouseEvent)=>{const link=event.currentTarget as HTMLAnchorElement;if(event.metaKey||event.ctrlKey||event.shiftKey)return;event.preventDefault();if(!intro)return;intro.hidden=false;createTimeline({defaults:{ease:'inOutQuart'},onComplete:()=>window.location.assign(link.href)}).add(intro,{opacity:[0,1],duration:140}).add('.intro-page',{rotateY:0,duration:460},0).add('.intro-page-code--front',{opacity:1,duration:90},220).add('.intro-page-code--back',{opacity:0,duration:90},220).add('.intro-cover',{rotateY:0,duration:560},55).add('.intro-book',{x:'-25%',scale:closedBookScale,duration:560},55)}
        internalLinks.forEach(link=>link.addEventListener('click',closeBook))
        self?.add(()=>internalLinks.forEach(link=>link.removeEventListener('click',closeBook)))
      }
      if(self?.matches.pointer){
        if(noise.current)animate(noise.current,{baseFrequency:['0.008 0.014','0.02 0.028'],duration:2400,alternate:true,loop:true,ease:'inOutSine'})
        let waterVisible=false
        let animationFrame=0
        let lastDistortion=0
        const target={x:-300,y:-300}
        const trail=Array.from({length:7},()=>({x:-300,y:-300}))
        const renderTrail=()=>{
          trail[0].x+=(target.x-trail[0].x)*.3;trail[0].y+=(target.y-trail[0].y)*.3
          for(let index=1;index<trail.length;index++){
            const follow=.2-index*.018
            trail[index].x+=(trail[index-1].x-trail[index].x)*follow
            trail[index].y+=(trail[index-1].y-trail[index].y)*follow
          }
          if(water.current){
            trail.forEach((point,index)=>{water.current?.style.setProperty(`--trail-${index+1}-x`,`${point.x}px`);water.current?.style.setProperty(`--trail-${index+1}-y`,`${point.y}px`)})
          }
          animationFrame=requestAnimationFrame(renderTrail)
        }
        animationFrame=requestAnimationFrame(renderTrail)
        const move=(event:PointerEvent)=>{
          target.x=event.clientX;target.y=event.clientY
          if(cursor.current)animate(cursor.current,{x:event.clientX,y:event.clientY,opacity:1,duration:95,ease:'outQuad'})
          if(water.current&&!waterVisible){waterVisible=true;trail.forEach(point=>{point.x=target.x;point.y=target.y});animate(water.current,{opacity:.9,duration:220,ease:'outQuad'})}
          const now=performance.now()
          if(displacement.current&&now-lastDistortion>80){
            lastDistortion=now
            animate(displacement.current,{scale:[24,44,28],duration:680,ease:'outExpo'})
          }
        }
        const exit=()=>{waterVisible=false;if(water.current)animate(water.current,{opacity:0,duration:520,ease:'outQuad'});if(cursor.current)animate(cursor.current,{opacity:0,duration:180,ease:'outQuad'})}
        const cursorOver=(event:PointerEvent)=>{if((event.target as Element).closest('a,button,[role="button"]')&&cursor.current)animate(cursor.current,{scale:.76,rotate:-8,duration:180,ease:'outBack'})}
        const cursorOut=(event:PointerEvent)=>{if((event.target as Element).closest('a,button,[role="button"]')&&cursor.current)animate(cursor.current,{scale:1,rotate:0,duration:180,ease:'outBack'})}
        const cursorDown=()=>{if(cursor.current)animate(cursor.current,{scale:.62,duration:100,ease:'outQuad'})}
        const cursorUp=()=>{if(cursor.current)animate(cursor.current,{scale:1,duration:190,ease:'outBack'})}
        window.addEventListener('pointermove',move,{passive:true})
        root.current?.addEventListener('pointerover',cursorOver)
        root.current?.addEventListener('pointerout',cursorOut)
        window.addEventListener('pointerdown',cursorDown)
        window.addEventListener('pointerup',cursorUp)
        document.documentElement.addEventListener('pointerleave',exit)
        return()=>{cancelAnimationFrame(animationFrame);window.removeEventListener('pointermove',move);root.current?.removeEventListener('pointerover',cursorOver);root.current?.removeEventListener('pointerout',cursorOut);window.removeEventListener('pointerdown',cursorDown);window.removeEventListener('pointerup',cursorUp);document.documentElement.removeEventListener('pointerleave',exit)}
      }
    })
    return()=>scope.revert()
  },[])

  return <main ref={root} className={`scene-shell ${className}`}>
    <div className="book-layer" aria-hidden="true"/>
    <div ref={water} className="water-reactive-layer" aria-hidden="true"/>
    <div className="paper-wash" aria-hidden="true"/>
    <svg className="cursor-filter" aria-hidden="true"><defs><filter id="water-background-displacement" x="-25%" y="-25%" width="150%" height="150%"><feTurbulence ref={noise} type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="8" result="noise"/><feDisplacementMap ref={displacement} in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="B" result="displaced"/><feGaussianBlur in="displaced" stdDeviation="1.6"/></filter></defs></svg>
    <div ref={cursor} className="custom-cursor" aria-hidden="true"><span/></div>
    <div className="book-intro" aria-hidden="true">
      <div className="intro-book">
        <div className="intro-book__shadow"/>
        <div className="intro-back-cover"/>
        {introPages.map(page=><div className={`intro-page intro-page--${page.layer}`} key={page.layer}>
          <code className="intro-page-code intro-page-code--front">{page.front.map(line=><span key={line}>{line}</span>)}</code>
          <code className="intro-page-code intro-page-code--back">{page.back.map(line=><span key={line}>{line}</span>)}</code>
        </div>)}
        <div className="intro-cover"><div className="intro-cover__front"><div className="cover-rule"/><Logo/><div className="cover-title"><small>{book('portfolio')}</small><strong>Fernando<br/>Forastieri</strong><span>{book('disciplines')}</span></div><code className="intro-code">{introCode.map((line,lineIndex)=><span className="intro-code-line" key={line}>{line.split('').map((character,index)=><i className="intro-code-char" key={`${lineIndex}-${index}`}>{character===' '?'\u00a0':character}</i>)}</span>)}</code><p>{book('volume')}</p></div><div className="intro-cover__inside"/></div>
        <div className="intro-spine"/>
      </div>
    </div>
    {children}
  </main>
}
