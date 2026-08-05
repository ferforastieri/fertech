import type {Metadata} from 'next'
import {WebGLPage} from '@/app/components/webgl/webgl-page'
import {siteContent} from '@/messages/site-content'

export const metadata:Metadata={title:siteContent.metadata.titles.webgl,description:siteContent.metadata.webgl}
export default function Page(){return <WebGLPage/>}
