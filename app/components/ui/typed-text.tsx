'use client'

import {useEffect,useRef} from 'react'

export function TypedText({text,className}:{text:string;className?:string}){
  const output=useRef<HTMLSpanElement>(null)

  useEffect(()=>{
    if(!output.current)return
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){output.current.textContent=text;return}
    output.current.textContent=''
    const duration=Math.max(220,text.length*32)
    const startedAt=performance.now()
    let raf=0
    const tick=(now:number)=>{
      const progress=Math.min(1,(now-startedAt)/duration)
      if(output.current)output.current.textContent=text.slice(0,Math.ceil(progress*text.length))
      if(progress<1)raf=requestAnimationFrame(tick)
    }
    raf=requestAnimationFrame(tick)
    return()=>cancelAnimationFrame(raf)
  },[text])

  return <span className={className} aria-label={text}><span ref={output} aria-hidden="true">{text}</span></span>
}
