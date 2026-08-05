'use client'

import { useEffect,useRef } from 'react'
import { animate,createTimer } from 'animejs'

export function Typewriter({text}:{text:string}){
  const output=useRef<HTMLSpanElement>(null)
  const caret=useRef<HTMLSpanElement>(null)

  useEffect(()=>{
    if(!output.current||!caret.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    output.current.textContent=''
    const timer=createTimer({delay:2550,duration:text.length*48,frameRate:30,onUpdate:self=>{if(output.current)output.current.textContent=text.slice(0,Math.ceil(self.progress*text.length))}})
    const blink=animate(caret.current,{opacity:[1,0],duration:520,alternate:true,loop:true,ease:'inOutQuad',delay:2550})
    return()=>{timer.cancel();blink.revert()}
  },[text])

  return <span className="typed-line" aria-label={text}><span ref={output} aria-hidden="true">{text}</span><span ref={caret} className="typed-caret" aria-hidden="true"/></span>
}
