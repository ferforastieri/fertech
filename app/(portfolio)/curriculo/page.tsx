import {ResumePage} from './_components/resume-page'
import {JsonLd} from '@/app/components/seo/json-ld'
import {siteContent} from '@/messages/site-content'
import {breadcrumbJsonLd,pageMetadata} from '@/app/seo'

export const metadata=pageMetadata(siteContent.metadata.titles.resume,siteContent.metadata.resume,'/curriculo/')
const breadcrumbs=breadcrumbJsonLd([{name:'Início',path:'/'},{name:'Currículo',path:'/curriculo/'}])

export default function Page(){return <><JsonLd data={breadcrumbs}/><ResumePage/></>}
