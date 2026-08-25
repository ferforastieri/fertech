import {AboutPage} from './_components/about-page'
import {JsonLd} from '@/app/components/seo/json-ld'
import {siteContent} from '@/messages/site-content'
import {breadcrumbJsonLd,pageMetadata} from '@/app/seo'

export const metadata=pageMetadata(siteContent.metadata.titles.about,siteContent.metadata.about,'/sobre/')
const breadcrumbs=breadcrumbJsonLd([{name:'Início',path:'/'},{name:'Sobre Fernando Forastieri',path:'/sobre/'}])
export default function Page(){return <><JsonLd data={breadcrumbs}/><AboutPage/></>}
