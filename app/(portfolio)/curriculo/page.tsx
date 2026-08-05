import type {Metadata} from 'next'
import {ResumePage} from '@/app/components/resume/resume-page'

export const metadata:Metadata={title:'Currículo',description:'Experiência, formação e competências de Fernando Forastieri.'}

export default function Page(){return <ResumePage/>}
