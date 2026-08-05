import {ProjectsPage} from '@/app/components/projects/projects-page'
import {siteContent} from '@/messages/site-content'
import {pageMetadata} from '@/app/seo'

export const metadata=pageMetadata(siteContent.metadata.titles.projects,siteContent.metadata.projects,'/projetos/')
export default function Page(){return <ProjectsPage/>}
