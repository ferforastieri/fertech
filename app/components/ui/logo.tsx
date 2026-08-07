import {siteContent} from '@/messages/site-content'
import {TechMonogram} from './tech-monogram'

export function Logo({withName=true}:{withName?:boolean}){return <span className="inline-flex items-center gap-2.5" aria-label={siteContent.identity.brand}>
  <TechMonogram className="h-[30px] w-[45px] overflow-visible text-current"/>
  {withName&&<strong className="text-small font-bold tracking-[.12em] uppercase">{siteContent.identity.brand}</strong>}
</span>}
