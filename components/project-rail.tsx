import Link from 'next/link'
import type { Project } from '@/lib/content'

export function ProjectRail({ projects, totalLabel }: { projects: Project[]; totalLabel: string }) {
  return <div className="rail-wrap">
    <div className="rail-head"><span>{String(projects.length).padStart(2,'0')} {totalLabel}</span><span>DRAG / SCROLL →</span></div>
    <div className="project-rail">
      {projects.map((project,index)=><Link className="rail-project" data-cursor="VIEW" href={`/projects/${project.id}/`} key={project.id}>
        <div className="rail-project__meta"><span>{String(index+1).padStart(2,'0')}</span><span>{project.groupTitle}</span></div>
        <div className="rail-project__visual"><div className="rail-project__glow"/><img src={project.logo} alt=""/></div>
        <h3>{project.title}</h3><p>{project.description}</p><div className="rail-project__tags">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
      </Link>)}
    </div>
  </div>
}
