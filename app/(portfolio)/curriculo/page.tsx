import {ResumePage} from '@/app/components/resume/resume-page'
import {siteContent} from '@/messages/site-content'
import {pageMetadata} from '@/app/seo'

export const metadata=pageMetadata(siteContent.metadata.titles.resume,siteContent.metadata.resume,'/curriculo/')

export default function Page(){return <ResumePage/>}
