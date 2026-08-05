'use client'

import { useEffect,useRef,type ReactNode } from 'react'
import { animate,createScope,createTimeline,stagger,utils } from 'animejs'
import {useTranslations} from 'next-intl'
import { Logo } from './logo'
import {WaterSurface} from './water-surface'
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

  useEffect(()=>{
    if(!root.current)return
    const scope=createScope({root:root.current,mediaQueries:{reduce:'(prefers-reduced-motion: reduce)',pointer:'(pointer: fine)'}}).add(self=>{
      if(!self?.matches.reduce){
        const intro=root.current?.querySelector<HTMLElement>('.book-intro')
        const mobileBook=window.matchMedia('(max-width: 767px)').matches
        const openedBookScale=mobileBook?1:1.035
        const mobileOpenWidth=mobileBook?Math.min(window.innerWidth-24,(window.innerHeight-32)*1.4,740):1
        const closedBookScale=mobileBook?Math.max(1,Math.min(1.72,(window.innerWidth*.86*2)/mobileOpenWidth,(window.innerHeight*.9)/(mobileOpenWidth/1.4))):1
        const internalArrival=sessionStorage.getItem('fertec-internal-navigation')==='1'
        sessionStorage.removeItem('fertec-internal-navigation')
        const setOpenedBook=()=>{
          if(!root.current)return
          utils.set(root.current.querySelectorAll('.intro-book'),{opacity:1,x:'0%',y:0,scale:openedBookScale,rotateX:4})
          utils.set(root.current.querySelectorAll('.intro-cover'),{rotateY:-179})
          ;([['four',-146,2],['three',-158,3],['two',-169,4],['one',-177,5]] as const).forEach(([layer,rotateY,z])=>utils.set(root.current!.querySelectorAll(`.intro-page--${layer}`),{rotateY,z}))
          utils.set(root.current.querySelectorAll('.intro-page-code--front'),{opacity:0})
          utils.set(root.current.querySelectorAll('.intro-page-code--back'),{opacity:1})
        }
        const setClosedBook=()=>{
          if(!root.current)return
          utils.set(root.current.querySelectorAll('.intro-book'),{opacity:1,x:'-25%',y:0,scale:closedBookScale,rotateX:4})
          utils.set(root.current.querySelectorAll('.intro-cover'),{rotateY:0})
          ;(['four','three','two','one'] as const).forEach((layer,index)=>utils.set(root.current!.querySelectorAll(`.intro-page--${layer}`),{rotateY:0,z:index+2}))
          utils.set(root.current.querySelectorAll('.intro-page-code--front'),{opacity:1})
          utils.set(root.current.querySelectorAll('.intro-page-code--back'),{opacity:0})
        }
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
        if(internalArrival){setOpenedBook();if(intro)intro.hidden=true;setupScrollReveals();requestAnimationFrame(()=>window.dispatchEvent(new Event('book-opened')))}
        else if(intro?.hidden)setupScrollReveals()
        else window.addEventListener('book-opened',setupScrollReveals,{once:true})
        self?.add(()=>{window.removeEventListener('book-opened',setupScrollReveals);revealObserver?.disconnect()})
        if(!internalArrival&&intro&&root.current){
          const page=root.current.querySelector('.intro-page--one')
          const front=root.current.querySelector('.intro-page--one .intro-page-code--front')
          const back=root.current.querySelector('.intro-page--one .intro-page-code--back')
          if(page&&front&&back){
            setClosedBook()
            intro.hidden=false
            utils.set(intro,{opacity:1})
            createTimeline({defaults:{ease:'inOutQuart'},onComplete:()=>{intro.hidden=true;window.dispatchEvent(new Event('book-opened'))}})
              .add('.intro-cover',{rotateY:[0,-179],duration:900},100)
              .add('.intro-book',{x:['-25%','0%'],scale:[closedBookScale,openedBookScale],duration:900},100)
              .add('.intro-spine',{scaleY:[.82,1],opacity:[.55,1],duration:420},260)
              .add('.scene-item',{opacity:[0,1],y:[16,0],delay:stagger(40),duration:480},900)
              .add('.scene-panel',{opacity:[0,1],y:[22,0],duration:480},900)
              .add(intro,{opacity:[1,0],duration:280,ease:'outQuad'},920)
          }
        }
        animate('.scroll-cue-mark',{y:[0,8],opacity:[.42,1],duration:760,alternate:true,loop:true,ease:'inOutSine'})

        const turnPage=(event:MouseEvent)=>{
          const link=(event.target as Element).closest<HTMLAnchorElement>('a[href^="/"]')
          if(!link||link.target==='_blank'||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return
          event.preventDefault()
          event.stopPropagation()
          if(!intro||!root.current)return
          const page=root.current.querySelector('.intro-page--one')
          const front=root.current.querySelector('.intro-page--one .intro-page-code--front')
          const back=root.current.querySelector('.intro-page--one .intro-page-code--back')
          if(!page||!front||!back)return
          setOpenedBook()
          intro.hidden=false
          utils.set(intro,{opacity:0})
          utils.set(page,{rotateY:0,z:8})
          utils.set(front,{opacity:1})
          utils.set(back,{opacity:0})
          createTimeline({defaults:{ease:'inOutQuart'},onComplete:()=>{sessionStorage.setItem('fertec-internal-navigation','1');window.location.assign(link.href)}})
            .add(intro,{opacity:[0,1],duration:80},0)
            .add(page,{rotateY:[0,-178],z:[8,5],duration:430},40)
            .add(front,{opacity:[1,0],duration:60},220)
            .add(back,{opacity:[0,1],duration:60},220)
            .add(intro,{opacity:[1,0],duration:140,ease:'outQuad'},370)
        }
        root.current?.addEventListener('click',turnPage,true)
        self?.add(()=>root.current?.removeEventListener('click',turnPage,true))
      }
      if(self?.matches.pointer){
        const move=(event:PointerEvent)=>{
          if(cursor.current)animate(cursor.current,{x:event.clientX,y:event.clientY,opacity:1,duration:95,ease:'outQuad'})
        }
        const exit=()=>{if(cursor.current)animate(cursor.current,{opacity:0,duration:180,ease:'outQuad'})}
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
        return()=>{window.removeEventListener('pointermove',move);root.current?.removeEventListener('pointerover',cursorOver);root.current?.removeEventListener('pointerout',cursorOut);window.removeEventListener('pointerdown',cursorDown);window.removeEventListener('pointerup',cursorUp);document.documentElement.removeEventListener('pointerleave',exit)}
      }
    })
    return()=>scope.revert()
  },[])

  return <main ref={root} className={`scene-shell ${className}`}>
    <div className="book-layer" aria-hidden="true"/>
    <WaterSurface/>
    <div className="paper-wash" aria-hidden="true"/>
    <div ref={cursor} className="custom-cursor" aria-hidden="true"><span/></div>
    <div className="book-intro" aria-hidden="true">
      <div className="intro-book">
        <div className="intro-book__shadow"/>
        <div className="intro-page-base"/>
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
