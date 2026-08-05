import type {ReactNode} from 'react'
import {SiteFrame} from '@/app/components/ui/site-frame'

export default function PortfolioLayout({children}:{children:ReactNode}){
  return <SiteFrame>{children}</SiteFrame>
}
