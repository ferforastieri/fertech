'use client'

import {useEffect,useRef} from 'react'
import {animate,createTimer,utils} from 'animejs'
import {siteContent} from '@/messages/site-content'

export function AnimatedIdentity({passion,role}:{passion:string;role:string}){
  const prompt=useRef<HTMLParagraphElement>(null)
  const output=useRef<HTMLSpanElement>(null)
  const caret=useRef<HTMLSpanElement>(null)

  useEffect(()=>{
    if(!prompt.current||!output.current||!caret.current)return
    const portrait=document.querySelector<HTMLElement>('.scene-portrait')
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){output.current.textContent=role;return}
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
      if(portrait)animate(portrait,{opacity:[0,1],y:[30,0],scale:[.88,1],rotate:[-3,0],duration:900,ease:'outExpo'})
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
        },
      })
    }
    const intro=document.querySelector<HTMLElement>('.server-system')
    if(intro?.hidden)start()
    else window.addEventListener('site-ready',start,{once:true})
    const fallback=window.setTimeout(start,5000)
    return()=>{window.removeEventListener('site-ready',start);window.clearTimeout(fallback);timer?.cancel();blink?.revert()}
  },[passion,role])

  return <div className="identity-stage">
    <h1 id="portfolio-title" className="visually-hidden">{siteContent.identity.name}</h1>
    <p ref={prompt} className="identity-prompt" aria-live="polite"><span ref={output}/><span ref={caret} className="typed-caret" aria-hidden="true"/></p>
  </div>
}
