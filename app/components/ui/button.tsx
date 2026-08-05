import type { AnchorHTMLAttributes,ButtonHTMLAttributes,ReactNode } from 'react'

type ButtonProps=ButtonHTMLAttributes<HTMLButtonElement>&{children:ReactNode;arrow?:boolean}
type ButtonLinkProps=AnchorHTMLAttributes<HTMLAnchorElement>&{children:ReactNode;arrow?:boolean}

export function Button({children,arrow=false,className='',...props}:ButtonProps){return <button className={`ui-button ${className}`} {...props}><span>{children}</span>{arrow&&<b aria-hidden="true">↗</b>}</button>}

export function ButtonLink({children,arrow=false,className='',...props}:ButtonLinkProps){return <a className={`ui-button ${className}`} {...props}><span>{children}</span>{arrow&&<b aria-hidden="true">↗</b>}</a>}
