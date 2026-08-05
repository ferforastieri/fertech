import {siteContent} from '@/messages/site-content'

export function Logo({withName=true}:{withName?:boolean}){return <span className="brand-logo" aria-label={siteContent.identity.brand}>
  <span className="brand-mark" aria-hidden="true"><i/><i/><i/></span>
  {withName&&<strong>{siteContent.identity.brand}</strong>}
</span>}
