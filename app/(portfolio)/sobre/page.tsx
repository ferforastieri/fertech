import {AboutPage} from '@/app/components/about/about-page'
import {siteContent} from '@/messages/site-content'
import {pageMetadata} from '@/app/seo'

export const metadata=pageMetadata(siteContent.metadata.titles.about,siteContent.metadata.about,'/sobre/')
export default function Page(){return <AboutPage/>}
