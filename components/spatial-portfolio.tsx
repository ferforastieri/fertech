'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import type { Article, HomeContent, Profile, Project, SiteContent } from '@/lib/content'

type Space = 'origin' | 'projects' | 'articles' | 'trajectory' | 'contact'
type ResumeData = Awaited<ReturnType<typeof import('@/lib/content').getResume>>

const spaces: Space[] = ['origin','projects','articles','trajectory','contact']

function CoreScene({ space, theme }: { space: Space; theme: 'light'|'dark' }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const state = useRef({ space, theme })
  state.current = { space, theme }

  useEffect(() => {
    const element = canvas.current
    if (!element) return
    const renderer = new THREE.WebGLRenderer({ canvas: element, alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7)); renderer.setSize(innerWidth, innerHeight, false)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(38, innerWidth/innerHeight, .1, 100); camera.position.set(0,0,8)
    const group = new THREE.Group(); scene.add(group)
    const coreMaterial = new THREE.MeshPhysicalMaterial({ color:0xbec7ff,metalness:.52,roughness:.16,transmission:.42,thickness:1.8,clearcoat:1,wireframe:false })
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.45,5),coreMaterial); group.add(core)
    const cage = new THREE.Mesh(new THREE.IcosahedronGeometry(1.72,2),new THREE.MeshBasicMaterial({color:0x5b70ff,wireframe:true,transparent:true,opacity:.25}));group.add(cage)
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.25,.015,8,180),new THREE.MeshBasicMaterial({color:0x7387ff,transparent:true,opacity:.6}));ringA.rotation.x=1.08;group.add(ringA)
    const ringB=ringA.clone();ringB.rotation.set(.3,.7,1.1);ringB.scale.setScalar(.76);group.add(ringB)
    const satellites:THREE.Mesh[]=[]
    for(let i=0;i<18;i++){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.035+(i%4)*.018,12,12),new THREE.MeshBasicMaterial({color:i%3?0xb8c0ff:0x4261ff}));const a=i/18*Math.PI*2;mesh.position.set(Math.cos(a)*(2.25+(i%3)*.22),Math.sin(a*1.7)*.65,Math.sin(a)*1.25);satellites.push(mesh);group.add(mesh)}
    const count=850;const positions=new Float32Array(count*3);for(let i=0;i<count;i++){const r=3+Math.random()*7,a=Math.random()*Math.PI*2,b=(Math.random()-.5)*Math.PI;positions[i*3]=Math.cos(a)*Math.cos(b)*r;positions[i*3+1]=Math.sin(b)*r;positions[i*3+2]=Math.sin(a)*Math.cos(b)*r}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));const particles=new THREE.Points(geometry,new THREE.PointsMaterial({color:0x7184ff,size:.012,transparent:true,opacity:.5}));scene.add(particles)
    scene.add(new THREE.AmbientLight(0xffffff,1.8));const light=new THREE.PointLight(0x6680ff,35,20);light.position.set(3,2,4);scene.add(light);const rim=new THREE.PointLight(0xffffff,24,18);rim.position.set(-4,-2,2);scene.add(rim)
    const pointer=new THREE.Vector2();const target=new THREE.Vector2();const move=(e:PointerEvent)=>target.set((e.clientX/innerWidth-.5)*2,(e.clientY/innerHeight-.5)*2);addEventListener('pointermove',move)
    const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false)};addEventListener('resize',resize)
    const clock=new THREE.Clock();let frame=0
    const render=()=>{const t=clock.getElapsedTime();pointer.lerp(target,.035);const index=spaces.indexOf(state.current.space);const targetX=[0,-1.55,1.55,-1.25,1.1][index];const targetScale=[1,1.28,.82,1.05,.58][index];group.position.x+=(targetX-group.position.x)*.035;group.scale.lerp(new THREE.Vector3(targetScale,targetScale,targetScale),.035);group.rotation.x+=(pointer.y*.18+t*.035-group.rotation.x)*.025;group.rotation.y+=(pointer.x*.25+t*.09-group.rotation.y)*.025;core.rotation.y+=.0018;core.rotation.z-=.001;cage.rotation.x-=.0015;cage.rotation.y+=.0025;ringA.rotation.z+=.001;ringB.rotation.y-=.0015;particles.rotation.y=t*.012;coreMaterial.color.lerp(new THREE.Color(state.current.theme==='dark'?0x9aa8ff:0x172453),.035);(scene.children.find(x=>x.type==='AmbientLight') as THREE.AmbientLight).intensity=state.current.theme==='dark'?1.8:3.4;renderer.render(scene,camera);frame=requestAnimationFrame(render)};render()
    return()=>{cancelAnimationFrame(frame);removeEventListener('pointermove',move);removeEventListener('resize',resize);geometry.dispose();core.geometry.dispose();coreMaterial.dispose();renderer.dispose()}
  },[])
  return <canvas ref={canvas} className="core-canvas" aria-hidden="true"/>
}

export function SpatialPortfolio({profile,home,site,projects,articles,resume}:{profile:Profile;home:HomeContent;site:SiteContent;projects:Project[];articles:Article[];resume:ResumeData}){
  const[space,setSpace]=useState<Space>('origin');const[theme,setTheme]=useState<'light'|'dark'>('dark');const panel=useRef<HTMLDivElement>(null)
  useEffect(()=>{const saved=localStorage.getItem('fertech-theme');const initial=saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');setTheme(initial);document.documentElement.dataset.theme=initial},[])
  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('fertech-theme',theme);if(panel.current)gsap.fromTo(panel.current,{opacity:0,y:28,clipPath:'inset(0 0 100% 0)'},{opacity:1,y:0,clipPath:'inset(0 0 0% 0)',duration:.9,ease:'expo.out'})},[space,theme])
  const navigate=(next:Space)=>setSpace(next)
  return <main className="spatial-shell"><CoreScene space={space} theme={theme}/><div className="spatial-chrome"><button className="spatial-logo" onClick={()=>navigate('origin')}>{profile.name}<small>{profile.role}</small></button><div className="spatial-status"><i/>SYSTEM ONLINE · {String(projects.length).padStart(2,'0')} PROJECTS</div><button className="theme-switch" onClick={()=>setTheme(theme==='dark'?'light':'dark')} aria-label="Alternar tema"><span>{theme==='dark'?'LIGHT':'DARK'}</span><i/></button></div>
    <nav className="space-nav" aria-label="Espaços"><button className={space==='projects'?'active':''} onClick={()=>navigate('projects')}><span>01</span>{site.navigation.projects}</button><button className={space==='articles'?'active':''} onClick={()=>navigate('articles')}><span>02</span>{site.navigation.blog}</button><button className={space==='trajectory'?'active':''} onClick={()=>navigate('trajectory')}><span>03</span>{site.navigation.resume}</button><button className={space==='contact'?'active':''} onClick={()=>navigate('contact')}><span>04</span>{home.contactButtonLabel}</button></nav>
    <section ref={panel} className={`space-panel space-panel--${space}`} key={space}>
      {space==='origin'&&<div className="origin-copy"><p>{home.heroEyebrow}</p><h1>{home.heroHeadline}</h1><div><span>{home.heroDescription}</span><button onClick={()=>navigate('projects')}>ENTER THE SYSTEM ↗</button></div></div>}
      {space==='projects'&&<div className="space-content projects-space"><header><p>SELECTED SYSTEMS / {projects.length}</p><h2>{home.projectsTitle}</h2></header><div className="space-projects">{projects.map((project,index)=><Link href={`/projects/${project.id}/`} data-cursor="OPEN" key={project.id}><span>{String(index+1).padStart(2,'0')}</span><div className="space-project-image"><img src={project.logo} alt=""/></div><h3>{project.title}</h3><p>{project.groupTitle} · {project.tags.join(' / ')}</p></Link>)}</div></div>}
      {space==='articles'&&<div className="space-content articles-space"><header><p>FIELD NOTES / {articles.length}</p><h2>{home.blogTitle}</h2></header>{articles.map((article,index)=><Link href={`/blog/${article.slug}/`} key={article.slug}><span>{String(index+1).padStart(2,'0')}</span><h3>{article.title}</h3><p>{article.category} · {article.readTime}</p></Link>)}</div>}
      {space==='trajectory'&&<div className="space-content trajectory-space"><header><p>{resume.location}</p><h2>{profile.role}</h2></header><div className="trajectory-list">{resume.experiences.map((item:any)=><article key={item.id}><span>{item.period}</span><h3>{item.company}</h3><p>{item.position}</p></article>)}</div><Link href="/resume/">FULL TRAJECTORY ↗</Link></div>}
      {space==='contact'&&<div className="contact-space"><p>{home.contactDescription}</p><h2>{home.contactTitle}</h2><a href={profile.contactUrl}>{home.contactButtonLabel} ↗</a><div>{profile.socialLinks.map(link=><a href={link.href} key={link.href}>{link.name}</a>)}</div></div>}
    </section><div className="spatial-coordinates"><span>LAT 23.5505° S</span><span>{theme.toUpperCase()} MODE</span><span>{space.toUpperCase()} / ACTIVE</span></div></main>
}
