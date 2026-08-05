'use client'

import { useEffect,useRef } from 'react'
import { animate,createTimeline,createTimer,stagger,utils } from 'animejs'

export function AnimatedIdentity({passion}:{passion:string}){
  const prompt=useRef<HTMLParagraphElement>(null)
  const output=useRef<HTMLSpanElement>(null)
  const caret=useRef<HTMLSpanElement>(null)
  const name=useRef<HTMLHeadingElement>(null)

  useEffect(()=>{
    if(!prompt.current||!output.current||!caret.current||!name.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const portrait=document.querySelector<HTMLElement>('.scene-portrait')
    const lines=name.current.querySelectorAll('.identity-line')
    utils.set(name.current,{opacity:0})
    utils.set(lines,{y:'110%'})
    if(portrait)utils.set(portrait,{opacity:0,y:30,scale:.88})
    output.current.textContent=''

    let timer:ReturnType<typeof createTimer>|undefined
    let blink:ReturnType<typeof animate>|undefined
    let started=false
    const start=()=>{
      if(started)return
      started=true
      const typeDuration=passion.length*30
      const pauseDuration=720
      const deleteDuration=passion.length*15
      blink=animate(caret.current!,{opacity:[1,0],duration:420,alternate:true,loop:true,ease:'inOutQuad'})
      timer=createTimer({
      delay:120,
      duration:typeDuration+pauseDuration+deleteDuration,
      frameRate:30,
      onUpdate:self=>{
        if(!output.current)return
        const time=self.currentTime
        if(time<=typeDuration)output.current.textContent=passion.slice(0,Math.ceil(time/typeDuration*passion.length))
        else if(time<=typeDuration+pauseDuration)output.current.textContent=passion
        else output.current.textContent=passion.slice(0,Math.max(0,passion.length-Math.ceil((time-typeDuration-pauseDuration)/deleteDuration*passion.length)))
      },
      onComplete:()=>{
        blink?.pause()
        animate(caret.current!,{opacity:0,duration:160})
        createTimeline({defaults:{ease:'outExpo'}})
          .add(prompt.current!,{opacity:[1,0],duration:180})
          .add(name.current!,{opacity:[0,1],duration:120},'-=40')
          .add(lines,{y:['110%',0],delay:stagger(115),duration:1050},'-=100')
          .add(portrait!,{opacity:[0,1],y:[30,0],scale:[.88,1],rotate:[-3,0],duration:900},'-=720')
      },
      })
    }
    const intro=document.querySelector<HTMLElement>('.book-intro')
    if(intro?.hidden)start()
    else window.addEventListener('book-opened',start,{once:true})
    const fallback=window.setTimeout(start,1400)
    return()=>{window.removeEventListener('book-opened',start);window.clearTimeout(fallback);timer?.cancel();blink?.revert()}
  },[passion])

  return <div className="identity-stage absolute inset-0 text-center">
    <p ref={prompt} className="identity-prompt absolute inset-x-0 top-1/2 mx-auto max-w-[22ch] -translate-y-1/2 overflow-visible px-4 font-[var(--serif)] text-[clamp(34px,5.3vw,78px)] leading-[.94] tracking-[-.03em]" aria-label={passion}><span ref={output} aria-hidden="true"/><span ref={caret} className="typed-caret" aria-hidden="true"/></p>
    <h1 ref={name} id="portfolio-title" className="identity-name absolute inset-x-0 top-1/2 -translate-y-1/2 text-[clamp(66px,12vw,184px)] font-extrabold leading-[.84] tracking-[-.075em] uppercase">
      <span className="block overflow-hidden"><span className="identity-line block">Fernando</span></span>
      <span className="mt-[.08em] block overflow-hidden"><span className="identity-line block">Forastieri</span></span>
    </h1>
  </div>
}
