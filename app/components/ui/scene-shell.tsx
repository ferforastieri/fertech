'use client'

import {useEffect,useRef,type CSSProperties,type ReactNode} from 'react'
import {usePathname} from 'next/navigation'
import {WaterSurface} from './water-surface'
import {usePreferences} from './preferences-provider'
import {siteContent} from '@/messages/site-content'

export function SceneShell({children,className=''}:{children:ReactNode;className?:string}){
  const {navPosition,theme}=usePreferences()
  const pathname=usePathname()
  const isAbout=pathname.replace(/\/$/,'')==='/sobre'
  const isHome=(pathname.replace(/\/$/,'')||'/')==='/'
  const root=useRef<HTMLElement>(null)
  const cursor=useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if(!root.current)return
    if(matchMedia('(pointer: fine)').matches){
        const state={x:innerWidth/2,y:innerHeight/2,targetX:innerWidth/2,targetY:innerHeight/2,scale:1,targetScale:1,rotation:0,targetRotation:0,opacity:0,targetOpacity:0}
        const interactiveSelector='a[href],button:not(:disabled),summary,[role="button"],[role="menuitemradio"],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),label[for]'
        let raf=0
        const render=()=>{const element=cursor.current;if(element){state.x+=(state.targetX-state.x)*.38;state.y+=(state.targetY-state.y)*.38;state.scale+=(state.targetScale-state.scale)*.24;state.rotation+=(state.targetRotation-state.rotation)*.24;state.opacity+=(state.targetOpacity-state.opacity)*.3;element.style.transform=`translate3d(${state.x}px,${state.y}px,0) scale(${state.scale}) rotate(${state.rotation}deg)`;element.style.opacity=String(state.opacity)}raf=requestAnimationFrame(render)}
        const move=(event:PointerEvent)=>{state.targetX=event.clientX;state.targetY=event.clientY;state.targetOpacity=1}
        const exit=()=>{state.targetOpacity=0}
        const setInteractive=(interactive:boolean)=>{if(cursor.current)cursor.current.dataset.variant=interactive?'pointer':'default';state.targetScale=1;state.targetRotation=0}
        const over=(event:PointerEvent)=>{if((event.target as Element).closest(interactiveSelector))setInteractive(true)}
        const out=(event:PointerEvent)=>{const next=event.relatedTarget;setInteractive(next instanceof Element&&Boolean(next.closest(interactiveSelector)))}
        const down=()=>{state.targetScale=.78}
        const up=()=>{state.targetScale=1;state.targetRotation=0}
        raf=requestAnimationFrame(render)
        window.addEventListener('pointermove',move,{passive:true})
        root.current?.addEventListener('pointerover',over)
        root.current?.addEventListener('pointerout',out)
        window.addEventListener('pointerdown',down)
        window.addEventListener('pointerup',up)
        document.documentElement.addEventListener('pointerleave',exit)
        return()=>{cancelAnimationFrame(raf);window.removeEventListener('pointermove',move);root.current?.removeEventListener('pointerover',over);root.current?.removeEventListener('pointerout',out);window.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);document.documentElement.removeEventListener('pointerleave',exit)}
    }
  },[])

  useEffect(()=>{
    const view=root.current?.querySelector<HTMLElement>('.route-view')
    if(!view)return
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){view.style.opacity='1';view.style.transform='none';view.style.filter='none';view.style.clipPath='none';return}
    const route=pathname.replace(/\/$/,'')||'/'
    const frames:Keyframe[]=route==='/'
      ?[{opacity:0,transform:'scale(.965) translateY(18px)',filter:'blur(14px)'},{opacity:1,transform:'scale(1) translateY(0)',filter:'blur(0)'}]
      :route==='/sobre'
        ?[{opacity:0,transform:'translate3d(54px,0,0)',clipPath:'inset(0 0 0 18%)',filter:'blur(8px)'},{opacity:1,transform:'translate3d(0,0,0)',clipPath:'inset(0 0 0 0)',filter:'blur(0)'}]
        :route==='/curriculo'
          ?[{opacity:0,transform:'perspective(1200px) rotateX(5deg) translateY(38px)',filter:'blur(9px)'},{opacity:1,transform:'perspective(1200px) rotateX(0) translateY(0)',filter:'blur(0)'}]
          :route.startsWith('/projetos/')
              ?[{opacity:0,transform:'translate3d(-44px,22px,0) scale(.98)',filter:'blur(10px)'},{opacity:1,transform:'translate3d(0,0,0) scale(1)',filter:'blur(0)'}]
              :[{opacity:0,transform:'translateY(48px) skewY(.8deg)',filter:'blur(10px)'},{opacity:1,transform:'translateY(0) skewY(0)',filter:'blur(0)'}]
    view.style.transformOrigin=route==='/curriculo'?'50% 0':'50% 50%'
    const motion=view.animate(frames,{duration:920,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'})
    return()=>motion.cancel()
  },[pathname])

  useEffect(()=>{
    const mark=root.current?.querySelector<HTMLElement>('.scroll-cue-mark')
    if(!mark)return
    const motion=mark.animate([{transform:'translateY(0)',opacity:.42},{transform:'translateY(8px)',opacity:1}],{duration:760,direction:'alternate',iterations:Infinity,easing:'ease-in-out'})
    return()=>motion.cancel()
  },[pathname])

  const dark=theme==='dark'
  const desktopWash=dark?'radial-gradient(circle at 50% 42%,rgba(231,223,209,.25),transparent 34%),linear-gradient(90deg,rgba(24,23,20,.7),transparent 32%,transparent 68%,rgba(24,23,20,.7)),linear-gradient(180deg,rgba(24,23,20,.12),rgba(24,23,20,.22))':'radial-gradient(circle at 50% 42%,rgba(255,253,248,.3),transparent 42%),linear-gradient(90deg,rgba(242,237,228,.68),rgba(242,237,228,.28) 34%,rgba(242,237,228,.28) 66%,rgba(242,237,228,.68)),linear-gradient(180deg,rgba(242,237,228,.22),rgba(242,237,228,.48))'
  const mobileWash=dark?'linear-gradient(rgba(24,23,20,.38),rgba(24,23,20,.6))':'linear-gradient(rgba(246,242,234,.42),rgba(246,242,234,.62))'
  const washStyle={'--desktop-wash':isAbout?'transparent':desktopWash,'--mobile-wash':isAbout?'transparent':mobileWash} as CSSProperties

  return <main ref={root} className={`scene-shell scene-shell--nav-${navPosition}${isAbout?' scene-shell--about':''}${isHome?' scene-shell--home':''} relative isolate min-h-svh overflow-x-hidden bg-ink text-paper ${className}`}>
    <div className={`server-layer pointer-events-none fixed inset-0 -z-20 bg-cover bg-center max-md:bg-[position:54%_center] ${dark?'[filter:sepia(.28)_saturate(.5)_contrast(.9)]':'opacity-42 [filter:grayscale(.62)_sepia(.2)_contrast(.82)_brightness(1.18)]'}`} style={{backgroundImage:"linear-gradient(rgba(12,13,13,.62),rgba(12,13,13,.7)),url('https://images.pexels.com/photos/5408005/pexels-photo-5408005.jpeg?auto=compress&cs=tinysrgb&w=1920')"}} aria-hidden="true"/>
    {isAbout&&<div className={`about-shell-background pointer-events-none fixed inset-0 z-0 bg-cover bg-center after:absolute after:inset-0 after:content-[''] max-md:bg-[position:58%_center] ${dark?'[filter:grayscale(.88)_sepia(.18)_contrast(1.08)_brightness(.42)] after:bg-[linear-gradient(90deg,rgba(15,15,13,.82),rgba(15,15,13,.48)_52%,rgba(15,15,13,.78)),linear-gradient(180deg,rgba(15,15,13,.18),rgba(15,15,13,.58))] max-md:[filter:grayscale(.9)_sepia(.2)_contrast(1.05)_brightness(.34)]':'opacity-38 [filter:grayscale(.82)_sepia(.18)_contrast(.78)_brightness(1.1)] after:bg-[rgba(246,242,234,.42)]'}`} style={{backgroundImage:`url(${siteContent.assets.aboutBook})`}} aria-hidden="true"/>}
    <WaterSurface/>
    <div className="paper-wash pointer-events-none fixed inset-0 -z-10 [background:var(--desktop-wash)] max-md:[background:var(--mobile-wash)]" style={washStyle} aria-hidden="true"/>
    <div ref={cursor} className="custom-cursor pointer-events-none fixed top-[-2px] left-[-2px] z-80 h-[30px] w-6 origin-[2px_2px] opacity-0 will-change-[transform,opacity] max-md:hidden" data-variant="default" aria-hidden="true">
      <span className="custom-cursor__arrow absolute inset-0 before:absolute before:inset-0 before:bg-ink before:content-[''] before:[clip-path:polygon(0_0,100%_61%,61%_66%,49%_100%,35%_94%,47%_64%,17%_78%)] after:absolute after:inset-0.5 after:bg-paper after:content-[''] after:[clip-path:polygon(0_0,100%_61%,61%_66%,49%_100%,35%_94%,47%_64%,17%_78%)]"/>
      <svg className="custom-cursor__pointer absolute top-0 left-[-8px] h-7 w-7 overflow-visible" viewBox="0 0 24 24" fill="var(--ink)" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 14a8 8 0 0 1-8 8H9c-2.8 0-4.2-1.4-5.6-3.2L.6 15.2c-.7-.9-.5-2.3.4-3s2.3-.5 3 .4L6 15V4a2 2 0 0 1 4 0v7-1a2 2 0 0 1 4 0v1-1a2 2 0 0 1 4 0v2-1a2 2 0 0 1 4 0Z" stroke="var(--ink)" strokeWidth="4"/>
        <path d="M22 14a8 8 0 0 1-8 8H9c-2.8 0-4.2-1.4-5.6-3.2L.6 15.2c-.7-.9-.5-2.3.4-3s2.3-.5 3 .4L6 15V4a2 2 0 0 1 4 0v7-1a2 2 0 0 1 4 0v1-1a2 2 0 0 1 4 0v2-1a2 2 0 0 1 4 0Z" stroke="var(--paper)" strokeWidth="1.6"/>
      </svg>
    </div>

    {children}
  </main>
}
