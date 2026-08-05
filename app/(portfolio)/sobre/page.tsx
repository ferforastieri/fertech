import type {Metadata} from 'next'
import {AboutPage} from '@/app/components/about/about-page'

export const metadata:Metadata={title:'Sobre mim',description:'Trajetória, princípios e interesses de Fernando Forastieri.'}
export default function Page(){return <AboutPage/>}
