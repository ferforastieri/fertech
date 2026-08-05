import { SpatialPortfolio } from '@/components/spatial-portfolio'
import { getArticles,getHomeContent,getProfile,getProjects,getResume,getSiteContent } from '@/lib/content'

export default async function Home(){
  const[profile,home,site,projects,articles,resume]=await Promise.all([getProfile(),getHomeContent(),getSiteContent(),getProjects(),getArticles(),getResume()])
  const schema={'@context':'https://schema.org','@type':'Person',name:profile.name,jobTitle:profile.role,url:process.env.NEXT_PUBLIC_SITE_URL,sameAs:profile.socialLinks.map(link=>link.href),knowsAbout:profile.technologies}
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><SpatialPortfolio profile={profile} home={home} site={site} projects={projects} articles={articles} resume={resume}/></>
}
