'use client'

import {useEffect,useRef} from 'react'
import {siteContent} from '@/messages/site-content'

export function AnimatedIdentity({passion,role}:{passion:string;role:string}){
  const prompt=useRef<HTMLParagraphElement>(null)
  const output=useRef<HTMLSpanElement>(null)
  const caret=useRef<HTMLSpanElement>(null)

  useEffect(()=>{
    if(!prompt.current||!output.current||!caret.current)return
    const portrait=document.querySelector<HTMLElement>('.scene-portrait')
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){prompt.current.dataset.phase='role';output.current.textContent=role;return}
    prompt.current.dataset.phase='passion'
    output.current.textContent=''
    const passionType=passion.length*28
    const pause=620
    const passionDelete=passion.length*14
    const roleType=role.length*32
    const roleStart=passionType+pause+passionDelete
    const duration=roleStart+roleType
    const startedAt=performance.now()+100
    let raf=0
    let caretMotion=caret.current.animate([{opacity:1},{opacity:0}],{duration:420,direction:'alternate',iterations:Infinity,easing:'ease-in-out'})
    const portraitMotion=portrait?.animate([{opacity:0,transform:'translateY(30px) scale(.88) rotate(-3deg)'},{opacity:1,transform:'translateY(0) scale(1) rotate(0)'}],{duration:900,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'})
    const tick=(now:number)=>{
      if(!output.current)return
      const time=Math.max(0,Math.min(duration,now-startedAt))
      if(time<=passionType)output.current.textContent=passion.slice(0,Math.ceil(time/passionType*passion.length))
      else if(time<=passionType+pause)output.current.textContent=passion
      else if(time<=roleStart)output.current.textContent=passion.slice(0,Math.max(0,passion.length-Math.ceil((time-passionType-pause)/passionDelete*passion.length)))
      else{prompt.current!.dataset.phase='role';output.current.textContent=role.slice(0,Math.ceil((time-roleStart)/roleType*role.length))}
      if(time<duration){raf=requestAnimationFrame(tick);return}
      caretMotion.cancel()
      caretMotion=caret.current!.animate([{opacity:1},{opacity:.35}],{duration:620,direction:'alternate',iterations:Infinity,easing:'ease-in-out'})
    }
    raf=requestAnimationFrame(tick)
    return()=>{cancelAnimationFrame(raf);caretMotion.cancel();portraitMotion?.cancel()}
  },[passion,role])

  return <div className="identity-stage w-full text-center">
    <h1 id="portfolio-title" className="sr-only">{siteContent.identity.name}</h1>
    <p ref={prompt} className="identity-prompt mx-auto min-h-[2em] w-full max-w-none overflow-visible p-0 font-display text-[clamp(27px,9vw,39px)] leading-[.94] tracking-[-.03em] motion-reduce:hidden md:w-max md:max-w-full md:whitespace-pre-line md:px-4 md:text-[clamp(38px,4vw,60px)] md:leading-[.88]" aria-live="polite"><span ref={output}/><span ref={caret} className="typed-caret inline-block h-[1.15em] w-px translate-x-[5px] origin-center bg-paper motion-reduce:hidden" aria-hidden="true"/></p>
  </div>
}
