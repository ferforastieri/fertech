import type {Metadata} from 'next'
import {ResumePage} from '@/app/components/resume/resume-page'
import {siteContent} from '@/messages/site-content'

export const metadata:Metadata={title:siteContent.metadata.titles.resume,description:siteContent.metadata.resume}

export default function Page(){return <ResumePage/>}
