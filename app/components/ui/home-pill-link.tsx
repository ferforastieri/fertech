import Link from 'next/link'
import type {MouseEventHandler} from 'react'

type HomePillLinkProps={
  href:string
  label:string
  arrow?:'external'|'down'
  className?:string
  external?:boolean
  onClick?:MouseEventHandler<HTMLAnchorElement>
}

export function HomePillLink({href,label,arrow='external',className='',external=false,onClick}:HomePillLinkProps){
  const classes=`group inline-flex min-h-10 items-center justify-center gap-3 rounded-full border border-[color-mix(in_srgb,var(--paper)_54%,transparent)] px-4 py-2 text-caption font-[760] tracking-[.12em] whitespace-nowrap text-inherit uppercase no-underline transition-[background,color,transform] duration-250 hover:-translate-y-0.5 hover:bg-paper hover:text-ink focus-visible:-translate-y-0.5 focus-visible:bg-paper focus-visible:text-ink focus-visible:outline-none md:min-h-9 md:px-[15px] md:text-label ${className}`
  const content=<>
    <span>{label}</span>
    {arrow==='down'
      ?<span className="mr-1 inline-grid h-4 w-4 shrink-0 place-items-center overflow-hidden" aria-hidden="true"><svg className="home-pill-link__down-arrow block h-3.5 w-3.5" viewBox="0 0 16 16" fill="none"><path d="M8 2.25v10.5m0 0 3.5-3.5M8 12.75l-3.5-3.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
      :<span className="font-display text-lg font-normal transition-transform duration-250 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">↗</span>}
  </>

  return external
    ?<a className={classes} href={href} target="_blank" rel="noreferrer" onClick={onClick}>{content}</a>
    :<Link className={classes} href={href} onClick={onClick}>{content}</Link>
}
