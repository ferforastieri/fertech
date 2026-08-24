import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {ProjectDetailPage} from '@/app/components/projects/project-detail-page'
import {JsonLd} from '@/app/components/seo/json-ld'
import {getProject,projects} from '@/app/components/projects/project-data'
import messages from '@/messages/pt-BR.json'
import {breadcrumbJsonLd,pageMetadata} from '@/app/seo'

export function generateStaticParams(){return projects.map(project=>({slug:project.id}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const project=getProject(slug);if(!project)return{};const description=messages.Projects.items[project.id as keyof typeof messages.Projects.items];return pageMetadata(project.title,description,`/projetos/${project.id}/`)}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const project=getProject(slug);if(!project)notFound();const breadcrumbs=breadcrumbJsonLd([{name:'Início',path:'/'},{name:'Projetos',path:'/projetos/'},{name:project.title,path:`/projetos/${project.id}/`}]);return <><JsonLd data={breadcrumbs}/><ProjectDetailPage project={project}/></>}
