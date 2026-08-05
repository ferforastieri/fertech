import type {Metadata} from 'next'
import {siteContent} from '@/messages/site-content'

const configuredUrl=process.env.NEXT_PUBLIC_SITE_URL||process.env.VERCEL_PROJECT_PRODUCTION_URL||'https://fer.tec.br'
export const siteUrl=new URL(configuredUrl.startsWith('http')?configuredUrl:`https://${configuredUrl}`)

export function pageMetadata(title:string,description:string,path:string):Metadata{
  return {
    title,
    description,
    alternates:{canonical:path},
    openGraph:{title,description,url:path,type:'website',siteName:siteContent.identity.brand,locale:'pt_BR',images:[{url:'/opengraph-image',width:1200,height:630,alt:`${siteContent.identity.name} — ${title}`}]},
    twitter:{card:'summary_large_image',title,description,images:['/opengraph-image']},
  }
}
