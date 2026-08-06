import type {Metadata,Viewport} from 'next'
import {PreferencesProvider} from '@/app/components/ui/preferences-provider'
import {PwaRegistration} from '@/app/components/ui/pwa-registration'
import {siteContent} from '@/messages/site-content'
import {siteUrl} from './seo'
import './globals.css'
import './components/ui/ui.css'

export const metadata:Metadata={
  metadataBase:siteUrl,
  title:{default:siteContent.identity.name,template:`%s — ${siteContent.identity.name}`},
  description:siteContent.metadata.description,
  applicationName:siteContent.identity.brand,
  authors:[{name:siteContent.identity.name,url:siteContent.contacts.linkedin}],
  creator:siteContent.identity.name,
  publisher:siteContent.identity.name,
  category:'technology',
  keywords:['Fernando Forastieri','Engenheiro de Software','Desenvolvedor Fullstack','Next.js','React','Inteligência Artificial','WebGL'],
  alternates:{canonical:'/'},
  manifest:'/manifest.webmanifest',
  icons:{icon:[{url:'/icon',type:'image/png'}],apple:'/pwa-icon.svg'},
  appleWebApp:{capable:true,title:siteContent.identity.brand,statusBarStyle:'black-translucent'},
  openGraph:{type:'website',locale:'pt_BR',url:'/',siteName:siteContent.identity.brand,title:siteContent.identity.name,description:siteContent.metadata.description},
  twitter:{card:'summary_large_image',title:siteContent.identity.name,description:siteContent.metadata.description},
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
}
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:[{media:'(prefers-color-scheme: dark)',color:'#181714'},{media:'(prefers-color-scheme: light)',color:'#e9e1d4'}]}

export default function Layout({children}:{children:React.ReactNode}){
  const person={
    '@context':'https://schema.org','@type':'Person',name:siteContent.identity.name,url:siteUrl.href,jobTitle:siteContent.identity.jobTitle,address:{'@type':'PostalAddress',addressLocality:'Sorocaba',addressRegion:'SP',addressCountry:'BR'},sameAs:[siteContent.contacts.linkedin,siteContent.contacts.github,siteContent.contacts.x],email:`mailto:${siteContent.contacts.email}`,
  }
  const website={'@context':'https://schema.org','@type':'WebSite',name:siteContent.identity.brand,url:siteUrl.href,description:siteContent.metadata.description,inLanguage:['pt-BR','en','es'],author:{'@type':'Person',name:siteContent.identity.name}}
  return <html lang="pt-BR" data-theme="dark"><body suppressHydrationWarning><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify([person,website]).replace(/</g,'\\u003c')}}/><PreferencesProvider><PwaRegistration/>{children}</PreferencesProvider></body></html>
}
