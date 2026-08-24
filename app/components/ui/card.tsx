import type { HTMLAttributes,ReactNode } from 'react'

export function Card({children,className='',...props}:HTMLAttributes<HTMLDivElement>&{children:ReactNode}){return <div className={`border border-[color-mix(in_srgb,var(--paper)_38%,transparent)] bg-[var(--surface)] ${className}`} {...props}>{children}</div>}
