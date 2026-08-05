import {siteContent} from '@/messages/site-content'
import {TechMonogram} from './tech-monogram'

export function Logo({withName=true}:{withName?:boolean}){return <span className="brand-logo" aria-label={siteContent.identity.brand}>
  <TechMonogram className="brand-mark"/>
  {withName&&<strong>{siteContent.identity.brand}</strong>}
</span>}
