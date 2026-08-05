import type {Metadata} from 'next'
import {ProjectsPage} from '@/app/components/projects/projects-page'

export const metadata:Metadata={title:'Projetos',description:'Projetos pessoais e profissionais de Fernando Forastieri.'}
export default function Page(){return <ProjectsPage/>}
