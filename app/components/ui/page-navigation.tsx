'use client'

import {useCallback,useEffect,useRef} from 'react'
import {usePathname,useRouter} from 'next/navigation'
import {useTranslations} from 'next-intl'

const pages=['/','/projetos','/sobre','/curriculo'] as const

function pageIndex(pathname:string){
  const route=pathname.replace(/\/$/,'')||'/'
  const index=pages.indexOf(route as typeof pages[number])
  return index===-1?(route.startsWith('/projetos/')?1:0):index
}

function Arrow({direction,disabled,onClick,label}:{direction:'previous'|'next';disabled:boolean;onClick:()=>void;label:string}){
  return <button className={`group pointer-events-auto fixed top-1/2 z-20 hidden h-14 w-10 -translate-y-1/2 place-items-center border-0 bg-transparent text-paper opacity-45 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-15 md:grid ${direction==='previous'?'left-[1.2vw]':'right-[1.2vw]'}`} type="button" onClick={onClick} disabled={disabled} aria-label={label}>
    <span className="grid h-9 w-9 place-items-center rounded-full border border-current bg-[color-mix(in_srgb,var(--ink)_35%,transparent)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110">
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={direction==='previous'?'m15 5-7 7 7 7':'m9 5 7 7-7 7'}/></svg>
    </span>
  </button>
}

export function PageNavigation(){
  const pathname=usePathname()
  const router=useRouter()
  const t=useTranslations('Navigation')
  const touchStart=useRef<{x:number;y:number;target:EventTarget|null}|null>(null)
  const current=pageIndex(pathname)
  const navigate=useCallback((index:number)=>{if(index>=0&&index<pages.length)router.push(pages[index])},[router])

  useEffect(()=>{
    const start=(event:TouchEvent)=>{touchStart.current={x:event.touches[0].clientX,y:event.touches[0].clientY,target:event.target}}
    const end=(event:TouchEvent)=>{
      const startPoint=touchStart.current
      touchStart.current=null
      if(!startPoint)return
      const target=startPoint.target instanceof Element?startPoint.target:null
      if(target?.closest('a,button,input,textarea,select,[contenteditable]'))return
      const dx=event.changedTouches[0].clientX-startPoint.x
      const dy=event.changedTouches[0].clientY-startPoint.y
      if(Math.abs(dx)<58||Math.abs(dx)<Math.abs(dy)*1.25)return
      navigate(current+(dx<0?1:-1))
    }
    window.addEventListener('touchstart',start,{passive:true})
    window.addEventListener('touchend',end,{passive:true})
    return()=>{window.removeEventListener('touchstart',start);window.removeEventListener('touchend',end)}
  },[current,navigate])

  return <div className="pointer-events-none" aria-label={t('pages')}>
    <Arrow direction="previous" disabled={current===0} onClick={()=>navigate(current-1)} label={t('previousPage')}/>
    <Arrow direction="next" disabled={current===pages.length-1} onClick={()=>navigate(current+1)} label={t('nextPage')}/>
  </div>
}
