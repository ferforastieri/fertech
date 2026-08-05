'use client'

import {useEffect,useRef} from 'react'
import {createTimer} from 'animejs'

export function TypedText({text,className}:{text:string;className?:string}){
  const output=useRef<HTMLSpanElement>(null)

  useEffect(()=>{
    if(!output.current)return
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){output.current.textContent=text;return}
    output.current.textContent=''
    let started=false
    let timer:ReturnType<typeof createTimer>|undefined
    const start=()=>{
      if(started)return
      started=true
      const duration=Math.max(220,text.length*32)
      timer=createTimer({duration,frameRate:30,onUpdate:self=>{if(output.current)output.current.textContent=text.slice(0,Math.ceil(self.currentTime/duration*text.length))}})
    }
    const intro=document.querySelector<HTMLElement>('.book-intro')
    if(intro?.hidden)start()
    else window.addEventListener('book-opened',start,{once:true})
    const fallback=window.setTimeout(start,5000)
    return()=>{window.removeEventListener('book-opened',start);window.clearTimeout(fallback);timer?.cancel()}
  },[text])

  return <span className={className} aria-label={text}><span ref={output} aria-hidden="true"/></span>
}
