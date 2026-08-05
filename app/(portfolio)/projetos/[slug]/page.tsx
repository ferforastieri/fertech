import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {ProjectDetailPage} from '@/app/components/projects/project-detail-page'
import {getProject,projects} from '@/app/components/projects/project-data'
import {siteContent} from '@/messages/site-content'
import {pageMetadata} from '@/app/seo'

export function generateStaticParams(){return projects.map(project=>({slug:project.id}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const project=getProject(slug);if(!project)return{};const description=`${siteContent.metadata.projectPrefix} ${project.title}.`;return pageMetadata(project.title,description,`/projetos/${project.id}/`)}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const project=getProject(slug);if(!project)notFound();return <ProjectDetailPage project={project}/>}
