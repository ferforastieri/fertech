'use client'

import {useEffect,useRef} from 'react'
import {animate,createTimeline,createTimer,utils} from 'animejs'

export function AnimatedIdentity({passion,role}:{passion:string;role:string}){
  const prompt=useRef<HTMLParagraphElement>(null)
  const output=useRef<HTMLSpanElement>(null)
  const caret=useRef<HTMLSpanElement>(null)

  useEffect(()=>{
    if(!prompt.current||!output.current||!caret.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const portrait=document.querySelector<HTMLElement>('.scene-portrait')
    if(portrait)utils.set(portrait,{opacity:0,y:30,scale:.88})
    output.current.textContent=''

    let timer:ReturnType<typeof createTimer>|undefined
    let blink:ReturnType<typeof animate>|undefined
    let started=false
    const start=()=>{
      if(started)return
      started=true
      const passionType=passion.length*28
      const pause=620
      const passionDelete=passion.length*14
      const roleType=role.length*32
      const roleStart=passionType+pause+passionDelete
      blink=animate(caret.current!,{opacity:[1,0],duration:420,alternate:true,loop:true,ease:'inOutQuad'})
      timer=createTimer({
        delay:100,
        duration:roleStart+roleType,
        frameRate:30,
        onUpdate:self=>{
          if(!output.current)return
          const time=self.currentTime
          if(time<=passionType)output.current.textContent=passion.slice(0,Math.ceil(time/passionType*passion.length))
          else if(time<=passionType+pause)output.current.textContent=passion
          else if(time<=roleStart)output.current.textContent=passion.slice(0,Math.max(0,passion.length-Math.ceil((time-passionType-pause)/passionDelete*passion.length)))
          else output.current.textContent=role.slice(0,Math.ceil((time-roleStart)/roleType*role.length))
        },
        onComplete:()=>{
          blink?.pause()
          animate(caret.current!,{opacity:[1,.35],duration:620,alternate:true,loop:true,ease:'inOutSine'})
          if(portrait)createTimeline({defaults:{ease:'outExpo'}}).add(portrait,{opacity:[0,1],y:[30,0],scale:[.88,1],rotate:[-3,0],duration:900})
        },
      })
    }
    const intro=document.querySelector<HTMLElement>('.book-intro')
    if(intro?.hidden)start()
    else window.addEventListener('book-opened',start,{once:true})
    const fallback=window.setTimeout(start,1400)
    return()=>{window.removeEventListener('book-opened',start);window.clearTimeout(fallback);timer?.cancel();blink?.revert()}
  },[passion,role])

  return <div className="identity-stage text-center">
    <h1 id="portfolio-title" className="sr-only">Fernando Forastieri</h1>
    <p ref={prompt} className="identity-prompt mx-auto min-h-[1.9em] max-w-[22ch] overflow-visible px-4 font-[var(--serif)] text-[clamp(34px,5.3vw,78px)] leading-[.94] tracking-[-.03em]" aria-live="polite"><span ref={output}/><span ref={caret} className="typed-caret" aria-hidden="true"/></p>
  </div>
}
