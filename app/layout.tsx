import type{Metadata,Viewport}from'next'
import{Header}from'@/components/header'
import{Experience}from'@/components/experience'
import{getHomeContent,getProfile,getSiteContent}from'@/lib/content'
import'./globals.css'
import'./art-direction.css'
import'./experience.css'
import'./immersive.css'
import'./palette-fix.css'
import'./spatial.css'
import'./theme.css'

const siteUrl=process.env.NEXT_PUBLIC_SITE_URL
if(!siteUrl)throw new Error('NEXT_PUBLIC_SITE_URL não configurada.')

export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Fernando Forastieri — Software Engineer',template:'%s — Fernando Forastieri'},description:'Engenheiro de software e product builder. Projetos, artigos e experiência construindo produtos digitais.',authors:[{name:'Fernando Forastieri Neto'}],alternates:{canonical:'/'},openGraph:{type:'website',locale:'pt_BR',siteName:'Fernando Forastieri',images:['/opengraph-image']},twitter:{card:'summary_large_image',images:['/opengraph-image']},robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1}}}
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#d8ff43'}
export default async function Layout({children}:{children:React.ReactNode}){const[profile,home,site]=await Promise.all([getProfile(),getHomeContent(),getSiteContent()]);return <html lang="pt-BR"><body><Experience><Header name={profile.name} navigation={{home:site.navigation.home,projects:site.navigation.projects,blog:site.navigation.blog,resume:site.navigation.resume}} contactLabel={home.contactButtonLabel} contactUrl={profile.contactUrl}/>{children}</Experience></body></html>}
