import type {Metadata} from 'next'
import {AboutPage} from '@/app/components/about/about-page'
import {siteContent} from '@/messages/site-content'

export const metadata:Metadata={title:siteContent.metadata.titles.about,description:siteContent.metadata.about}
export default function Page(){return <AboutPage/>}
