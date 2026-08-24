import type {Metadata} from 'next'
import {siteContent} from '@/messages/site-content'

const configuredUrl=process.env.NEXT_PUBLIC_SITE_URL||process.env.VERCEL_PROJECT_PRODUCTION_URL||'https://fer.tec.br'
export const siteUrl=new URL(configuredUrl.startsWith('http')?configuredUrl:`https://${configuredUrl}`)

export function pageMetadata(title:string,description:string,path:string):Metadata{
  const socialTitle=`${title} — ${siteContent.identity.name}`
  const socialImage='/opengraph-image/?social=v2'
  return {
    title,
    description,
    alternates:{canonical:path},
    openGraph:{title:socialTitle,description,url:path,type:'website',siteName:siteContent.identity.brand,locale:'pt_BR',images:[{url:socialImage,width:1200,height:630,alt:`${siteContent.identity.name} — ${title}`}]},
    twitter:{card:'summary_large_image',title:socialTitle,description,images:[socialImage]},
  }
}

export function breadcrumbJsonLd(items:ReadonlyArray<{name:string;path:string}>){
  return {
    '@context':'https://schema.org',
    '@type':'BreadcrumbList',
    itemListElement:items.map((item,index)=>({
      '@type':'ListItem',
      position:index+1,
      name:item.name,
      item:new URL(item.path,siteUrl).href,
    })),
  }
}
