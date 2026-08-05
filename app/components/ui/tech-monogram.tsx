import type {CSSProperties} from 'react'

export function TechMonogram({className='',style}:{className?:string;style?:CSSProperties}){
  return <svg className={className} style={style} viewBox="0 0 72 52" fill="none" aria-hidden="true">
    <path className="tech-monogram__trace" fill="currentColor" d="M4 5h29v9H15v9h15v9H15v15H4V5Zm35 0h29v9H50v9h15v9H50v15H39V5Z"/>
    <path className="tech-monogram__circuit" d="M10 5V1M25 27h8v12h6M45 47v4M59 9h9V2" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="8" y="0" width="4" height="3" fill="currentColor"/><rect x="37" y="37" width="4" height="4" fill="currentColor"/><rect x="43" y="49" width="4" height="3" fill="currentColor"/><rect x="66" y="0" width="4" height="4" fill="currentColor"/>
  </svg>
}
