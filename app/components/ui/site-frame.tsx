import type {ReactNode} from 'react'
import Link from 'next/link'
import {FloatingNavigation} from './floating-navigation'
import {Logo} from './logo'
import {SceneShell} from './scene-shell'
import {GlobalProfile} from './global-profile'
import {siteContent} from '@/messages/site-content'

export function SiteFrame({children,className=''}:{children:ReactNode;className?:string}){return <SceneShell className={className}>
  <FloatingNavigation/>
  <Link className="corner-logo scene-item fixed top-[26px] left-[4.5vw] z-30 text-paper no-underline max-md:hidden" href="/" aria-label={siteContent.identity.name}><Logo/></Link>
  <div className="route-view relative z-1 min-h-svh min-w-0 pb-8 will-change-[opacity,transform,filter] md:pb-12">{children}</div>
  <GlobalProfile/>
</SceneShell>}
