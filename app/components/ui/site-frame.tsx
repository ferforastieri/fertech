import type {ReactNode} from 'react'
import Link from 'next/link'
import {FloatingNavigation} from './floating-navigation'
import {Logo} from './logo'
import {SceneShell} from './scene-shell'
import {GlobalFooter,GlobalProfileCorner} from './global-profile'
import {PageNavigation} from './page-navigation'
import {siteContent} from '@/messages/site-content'

export function SiteFrame({children,className=''}:{children:ReactNode;className?:string}){return <SceneShell className={className}>
  <FloatingNavigation/>
  <PageNavigation/>
  <Link className="corner-logo scene-item fixed top-[26px] left-[4.5vw] z-30 text-paper no-underline will-change-[transform,opacity] max-md:hidden" href="/" aria-label={siteContent.identity.name}><Logo/></Link>
  <div className="route-view relative z-1 min-h-svh min-w-0 will-change-[opacity,transform,filter]">{children}<GlobalFooter hideOnHome/></div>
  <GlobalProfileCorner/>
</SceneShell>}
