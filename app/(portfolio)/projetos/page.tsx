import type {Metadata} from 'next'
import {ProjectsPage} from '@/app/components/projects/projects-page'
import {siteContent} from '@/messages/site-content'

export const metadata:Metadata={title:siteContent.metadata.titles.projects,description:siteContent.metadata.projects}
export default function Page(){return <ProjectsPage/>}
