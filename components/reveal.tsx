'use client'

import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
export function Reveal({children,className='',delay=0}:{children:React.ReactNode;className?:string;delay?:number}){const ref=useRef<HTMLDivElement>(null);useEffect(()=>{const node=ref.current;if(!node)return;const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)return;animate(node,{opacity:[0,1],y:[45,0],duration:900,delay:delay*1000,ease:'outExpo'});observer.disconnect()},{rootMargin:'0px 0px -10%'});observer.observe(node);return()=>observer.disconnect()},[delay]);return <div ref={ref} className={className}>{children}</div>}
