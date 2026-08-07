import type {MetadataRoute} from 'next'
import {projects} from '@/messages/project-data'
import {siteUrl} from './seo'

export const dynamic='force-static'

export default function sitemap():MetadataRoute.Sitemap{
  const route=(path:string,priority:number,changeFrequency:MetadataRoute.Sitemap[number]['changeFrequency']='monthly')=>({url:new URL(path,siteUrl).href,changeFrequency,priority})
  return [route('/',1,'weekly'),route('/projetos/',.9),route('/sobre/',.8),route('/curriculo/',.8),...projects.map(project=>route(`/projetos/${project.id}/`,.65))]
}
