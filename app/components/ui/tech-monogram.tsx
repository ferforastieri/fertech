import type {CSSProperties} from 'react'

export function TechMonogram({className='',style}:{className?:string;style?:CSSProperties}){
  return <svg className={className} style={style} viewBox="0 0 72 52" fill="none" aria-hidden="true">
    <path className="tech-monogram__trace" d="M5 47V7h25M5 25h20M39 47V7h28M39 25h22" stroke="currentColor" strokeWidth="5"/>
    <path className="tech-monogram__circuit" d="M16 7V2M25 25h7v15h7M50 7V2M61 25h6v12" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="16" cy="2" r="2" fill="currentColor"/><circle cx="39" cy="40" r="2" fill="currentColor"/><circle cx="50" cy="2" r="2" fill="currentColor"/><circle cx="67" cy="37" r="2" fill="currentColor"/>
  </svg>
}
