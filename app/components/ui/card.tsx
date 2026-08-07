import type { HTMLAttributes,ReactNode } from 'react'

export function Card({children,className='',...props}:HTMLAttributes<HTMLDivElement>&{children:ReactNode}){return <div className={`border border-[rgba(231,223,209,.32)] bg-[rgba(74,70,64,.4)] [[data-theme=light]_&]:border-[rgba(23,22,18,.24)] [[data-theme=light]_&]:bg-[rgba(255,253,248,.52)] ${className}`} {...props}>{children}</div>}
