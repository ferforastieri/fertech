import type {ReactNode} from 'react'
import {FloatingNavigation} from './floating-navigation'
import {Logo} from './logo'
import {SceneShell} from './scene-shell'
import {TypedText} from './typed-text'

export function SiteFrame({children,className=''}:{children:ReactNode;className?:string}){return <SceneShell className={className}>
  <FloatingNavigation/>
  <a className="corner-logo scene-item" href="/" aria-label="Fernando Forastieri"><Logo/></a>
  <p className="site-signature scene-item"><TypedText text="Fernando Forastieri"/></p>
  {children}
</SceneShell>}
