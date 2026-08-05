import type { Metadata,Viewport } from 'next'
import {PreferencesProvider} from '@/app/components/ui/preferences-provider'
import './globals.css'
import './components/ui/ui.css'

const siteUrl=process.env.NEXT_PUBLIC_SITE_URL

export const metadata:Metadata={
  metadataBase:siteUrl?new URL(siteUrl):undefined,
  title:{default:'Fernando Forastieri',template:'%s — Fernando Forastieri'},
  description:'Desenvolvedor fullstack focado em design systems, infraestrutura e experiências digitais.',
}
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:[{media:'(prefers-color-scheme: dark)',color:'#181714'},{media:'(prefers-color-scheme: light)',color:'#e9e1d4'}]}

export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR" data-theme="dark"><body suppressHydrationWarning><PreferencesProvider>{children}</PreferencesProvider></body></html>}
