'use client'

import {type RefObject,useEffect} from 'react'
import {animate} from 'animejs'

type RevealRoot=HTMLElement|null

export function useScrollReveal(root:RefObject<RevealRoot>,selector:string){
  useEffect(()=>{
    if(!root.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    let observer:IntersectionObserver|undefined
    let fallback=0

    const observe=()=>{
      if(!root.current||observer)return
      observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(!entry.isIntersecting)return
          observer?.unobserve(entry.target)
          animate(entry.target,{opacity:[0,1],y:[34,0],rotateX:[5,0],duration:760,ease:'outExpo'})
        })
      },{threshold:.12,rootMargin:'0px 0px -8% 0px'})
      root.current.querySelectorAll(selector).forEach(element=>observer?.observe(element))
    }

    const intro=document.querySelector<HTMLElement>('.server-system')
    if(intro?.hidden)observe()
    else window.addEventListener('site-ready',observe,{once:true})
    fallback=window.setTimeout(observe,5000)

    return()=>{
      window.removeEventListener('site-ready',observe)
      window.clearTimeout(fallback)
      observer?.disconnect()
    }
  },[root,selector])
}
