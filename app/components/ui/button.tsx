import type { AnchorHTMLAttributes,ButtonHTMLAttributes,ReactNode } from 'react'

type ButtonProps=ButtonHTMLAttributes<HTMLButtonElement>&{children:ReactNode;arrow?:boolean}
type ButtonLinkProps=AnchorHTMLAttributes<HTMLAnchorElement>&{children:ReactNode;arrow?:boolean}

const base='group flex min-h-10.5 w-max items-center justify-between gap-7 border border-paper bg-transparent px-4 text-label font-bold tracking-[.1em] text-paper uppercase transition-[background,color] duration-250 hover:bg-paper hover:text-ink focus-visible:bg-paper focus-visible:text-ink focus-visible:outline-none disabled:opacity-55'

export function Button({children,arrow=false,className='',...props}:ButtonProps){return <button className={`${base} ${className}`} {...props}><span>{children}</span>{arrow&&<b className="font-display text-xl leading-none font-normal transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">↗</b>}</button>}

export function ButtonLink({children,arrow=false,className='',...props}:ButtonLinkProps){return <a className={`${base} ${className}`} {...props}><span>{children}</span>{arrow&&<b className="font-display text-xl leading-none font-normal transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">↗</b>}</a>}
