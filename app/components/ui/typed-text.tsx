'use client'

import {useEffect,useRef} from 'react'
import {createTimer} from 'animejs'

export function TypedText({text,className}:{text:string;className?:string}){
  const output=useRef<HTMLSpanElement>(null)

  useEffect(()=>{
    if(!output.current)return
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){output.current.textContent=text;return}
    output.current.textContent=''
    let timer:ReturnType<typeof createTimer>|undefined
    const start=()=>{
      const duration=Math.max(220,text.length*32)
      timer=createTimer({duration,frameRate:30,onUpdate:self=>{if(output.current)output.current.textContent=text.slice(0,Math.ceil(self.currentTime/duration*text.length))}})
    }
    start()
    return()=>{timer?.cancel()}
  },[text])

  return <span className={className} aria-label={text}><span ref={output} aria-hidden="true"/></span>
}
