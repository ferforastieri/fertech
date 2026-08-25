import {ProjectsPage} from './_components/projects-page'
import {JsonLd} from '@/app/components/seo/json-ld'
import {siteContent} from '@/messages/site-content'
import {breadcrumbJsonLd,pageMetadata} from '@/app/seo'

export const metadata=pageMetadata(siteContent.metadata.titles.projects,siteContent.metadata.projects,'/projetos/')
const breadcrumbs=breadcrumbJsonLd([{name:'Início',path:'/'},{name:'Projetos',path:'/projetos/'}])
export default function Page(){return <><JsonLd data={breadcrumbs}/><ProjectsPage/></>}
