import type {ReactNode} from 'react'
import {FloatingNavigation} from './floating-navigation'
import {Logo} from './logo'
import {SceneShell} from './scene-shell'
import {GlobalProfile} from './global-profile'

export function SiteFrame({children,className=''}:{children:ReactNode;className?:string}){return <SceneShell className={className}>
  <FloatingNavigation/>
  <a className="corner-logo scene-item" href="/" aria-label="Fernando Forastieri"><Logo/></a>
  <GlobalProfile/>
  {children}
</SceneShell>}
