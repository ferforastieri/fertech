'use client'

import {type RefObject,useEffect} from 'react'
import {usePathname} from 'next/navigation'

type RevealRoot=HTMLElement|null

export function useScrollReveal(root:RefObject<RevealRoot>,selector:string){
  const pathname=usePathname()
  useEffect(()=>{
    const container=root.current
    if(!container)return
    const elements=Array.from(container.querySelectorAll<HTMLElement>(selector))
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){elements.forEach(element=>{element.style.opacity='1';element.style.transform='none';element.style.filter='none'});return}
    let observer:IntersectionObserver|undefined
    let frame=0
    const motions:Animation[]=[]

    const reveal=(targets:HTMLElement[],delay=0)=>{
      if(!targets.length)return
      targets.forEach(target=>target.dataset.revealed='true')
      targets.forEach((target,index)=>motions.push(target.animate([
        {opacity:0,transform:'translateY(32px) scale(.985)',filter:'blur(9px)'},
        {opacity:1,transform:'translateY(0) scale(1)',filter:'blur(0)'},
      ],{duration:820,delay:delay+index*64,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'})))
    }
    const start=()=>{
      if(observer)return
      frame=requestAnimationFrame(()=>{
        const fold=window.innerHeight*.96
        const initial=elements.filter(element=>element.getBoundingClientRect().top<fold)
        reveal(initial,90)
        observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
          if(!entry.isIntersecting)return
          observer?.unobserve(entry.target)
          const target=entry.target as HTMLElement
          if(target.dataset.revealed!=='true')reveal([target])
        }),{threshold:.1,rootMargin:'0px 0px -7% 0px'})
        elements.filter(element=>element.dataset.revealed!=='true').forEach(element=>observer?.observe(element))
      })
    }

    start()

    return()=>{
      cancelAnimationFrame(frame)
      observer?.disconnect()
      motions.forEach(motion=>motion.cancel())
    }
  },[pathname,root,selector])
}
