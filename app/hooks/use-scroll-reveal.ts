'use client'

import {type RefObject,useEffect} from 'react'
import {animate,stagger} from 'animejs'
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
    const motions:ReturnType<typeof animate>[]=[]

    const reveal=(targets:HTMLElement[],delay=0)=>{
      if(!targets.length)return
      targets.forEach(target=>target.dataset.revealed='true')
      motions.push(animate(targets,{opacity:[0,1],y:[32,0],scale:[.985,1],filter:['blur(9px)','blur(0px)'],delay:stagger(64,{start:delay}),duration:820,ease:'outExpo'}))
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
      motions.forEach(motion=>motion.revert())
    }
  },[pathname,root,selector])
}
