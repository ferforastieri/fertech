import type { Metadata,Viewport } from 'next'
import './globals.css'

const siteUrl=process.env.NEXT_PUBLIC_SITE_URL

export const metadata:Metadata={
  metadataBase:siteUrl?new URL(siteUrl):undefined,
  title:{default:'Fernando Forastieri',template:'%s — Fernando Forastieri'},
  description:'Desenvolvedor fullstack focado em design systems, infraestrutura e experiências digitais.',
}
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#181714'}

export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body suppressHydrationWarning>{children}</body></html>}
