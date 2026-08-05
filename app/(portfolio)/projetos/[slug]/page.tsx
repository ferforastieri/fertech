import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {ProjectDetailPage} from '@/app/components/projects/project-detail-page'
import {getProject,projects} from '@/app/components/projects/project-data'

export function generateStaticParams(){return projects.map(project=>({slug:project.id}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const project=getProject(slug);return project?{title:project.title,description:`Detalhes técnicos e estrutura do projeto ${project.title}.`}:{}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const project=getProject(slug);if(!project)notFound();return <ProjectDetailPage project={project}/>}
