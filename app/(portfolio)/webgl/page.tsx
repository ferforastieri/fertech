import {WebGLPage} from '@/app/components/webgl/webgl-page'
import {siteContent} from '@/messages/site-content'
import {pageMetadata} from '@/app/seo'

export const metadata=pageMetadata(siteContent.metadata.titles.webgl,siteContent.metadata.webgl,'/webgl/')
export default function Page(){return <WebGLPage/>}
