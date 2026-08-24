import type {Metadata,Viewport} from 'next'
import {PreferencesProvider} from '@/app/components/ui/preferences-provider'
import {PwaRegistration} from '@/app/components/ui/pwa-registration'
import {siteContent} from '@/messages/site-content'
import {siteUrl} from './seo'
import './globals.css'

const socialTitle=`${siteContent.identity.name} — ${siteContent.identity.jobTitle}`
const socialImage='/opengraph-image/?social=v2'
const defaultTitle=`${siteContent.identity.name} | ${siteContent.identity.jobTitle}`

export const metadata:Metadata={
  metadataBase:siteUrl,
  title:{default:defaultTitle,template:`%s | ${siteContent.identity.name}`},
  description:siteContent.metadata.description,
  applicationName:siteContent.identity.brand,
  authors:[{name:siteContent.identity.name,url:siteContent.contacts.linkedin}],
  creator:siteContent.identity.name,
  publisher:siteContent.identity.name,
  category:'technology',
  keywords:['Fernando Forastieri','Engenheiro de Software','Desenvolvedor Fullstack','Next.js','React','Inteligência Artificial'],
  alternates:{canonical:'/'},
  manifest:'/manifest.webmanifest',
  icons:{icon:[{url:'/favicon.svg',type:'image/svg+xml',sizes:'any'},{url:'/icon/',type:'image/png',sizes:'128x128'}],shortcut:'/favicon.svg',apple:'/pwa-icon.svg'},
  appleWebApp:{capable:true,title:siteContent.identity.brand,statusBarStyle:'black-translucent'},
  openGraph:{type:'website',locale:'pt_BR',url:'/',siteName:siteContent.identity.brand,title:socialTitle,description:siteContent.metadata.description,images:[{url:socialImage,width:1200,height:630,alt:`${siteContent.identity.name}, ${siteContent.identity.jobTitle}`}]},
  twitter:{card:'summary_large_image',title:socialTitle,description:siteContent.metadata.description,images:[socialImage]},
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
}
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:[{media:'(prefers-color-scheme: dark)',color:'#181714'},{media:'(prefers-color-scheme: light)',color:'#e9e1d4'}]}

export default function Layout({children}:{children:React.ReactNode}){
  const person={
    '@type':'Person','@id':new URL('/#person',siteUrl).href,name:siteContent.identity.name,url:siteUrl.href,image:new URL('/assets/fernando.png',siteUrl).href,jobTitle:siteContent.identity.jobTitle,address:{'@type':'PostalAddress',addressLocality:'Sorocaba',addressRegion:'SP',addressCountry:'BR'},sameAs:[siteContent.contacts.linkedin,siteContent.contacts.github,siteContent.contacts.x],email:`mailto:${siteContent.contacts.email}`,knowsAbout:['Next.js','React','TypeScript','Node.js','Inteligência Artificial','Design Systems','Infraestrutura de software'],
  }
  const website={'@type':'WebSite','@id':new URL('/#website',siteUrl).href,name:siteContent.identity.brand,alternateName:`Portfólio de ${siteContent.identity.name}`,url:siteUrl.href,description:siteContent.metadata.description,inLanguage:'pt-BR',publisher:{'@id':person['@id']}}
  const profilePage={'@type':'ProfilePage','@id':new URL('/#webpage',siteUrl).href,url:siteUrl.href,name:defaultTitle,description:siteContent.metadata.description,inLanguage:'pt-BR',isPartOf:{'@id':website['@id']},mainEntity:{'@id':person['@id']}}
  const navigation={'@type':'ItemList','@id':new URL('/#navigation',siteUrl).href,name:'Navegação principal',itemListElement:[['Início','/'],['Projetos','/projetos/'],['Sobre Fernando Forastieri','/sobre/'],['Currículo','/curriculo/']].map(([name,path],index)=>({'@type':'ListItem',position:index+1,name,url:new URL(path,siteUrl).href}))}
  const structuredData={'@context':'https://schema.org','@graph':[person,website,profilePage,navigation]}
  return <html lang="pt-BR" data-theme="dark" className="min-h-full min-w-80 bg-ink scroll-smooth font-sans"><body className="min-h-full bg-ink font-sans" suppressHydrationWarning><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,'\\u003c')}}/><PreferencesProvider><PwaRegistration/>{children}</PreferencesProvider></body></html>
}
