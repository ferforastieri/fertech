import type {ReactNode} from 'react'
import Link from 'next/link'
import {FloatingNavigation} from './floating-navigation'
import {Logo} from './logo'
import {SceneShell} from './scene-shell'
import {GlobalProfile} from './global-profile'
import {siteContent} from '@/messages/site-content'

export function SiteFrame({children,className=''}:{children:ReactNode;className?:string}){return <SceneShell className={className}>
  <FloatingNavigation/>
  <Link className="corner-logo scene-item" href="/" aria-label={siteContent.identity.name}><Logo/></Link>
  <GlobalProfile/>
  {children}
</SceneShell>}
