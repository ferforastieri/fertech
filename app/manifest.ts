import type {MetadataRoute} from 'next'
import {siteContent} from '@/messages/site-content'

export default function manifest():MetadataRoute.Manifest{return{
  name:`${siteContent.identity.brand} — ${siteContent.identity.name}`,
  short_name:siteContent.identity.brand,
  description:siteContent.metadata.description,
  start_url:'/',
  scope:'/',
  display:'standalone',
  background_color:'#1c0e08',
  theme_color:'#1c0e08',
  orientation:'portrait-primary',
  categories:['portfolio','technology','design'],
  icons:[
    {src:'/pwa-icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'},
    {src:'/pwa-maskable.svg',sizes:'any',type:'image/svg+xml',purpose:'maskable'},
  ],
}}
