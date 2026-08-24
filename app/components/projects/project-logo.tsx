import Image from 'next/image'
import {getProjectLogo} from '@/messages/project-brand'

export function ProjectLogo({id,title,className='',framed=true}:{id:string;title:string;className?:string;framed?:boolean}){
  const logo=getProjectLogo(id)
  const initials=title.split(/\s+/).filter(Boolean).slice(0,2).map(word=>word[0]).join('').toUpperCase()
  const needsLightContrast=id==='rehau'||id==='fertec'
  const frame=framed?'overflow-hidden border border-[color-mix(in_srgb,var(--paper)_28%,transparent)] bg-[#11120f] text-[#f3ede4]':'text-paper'
  return <div className={`project-logo grid place-items-center ${frame} ${className}`}>
    {logo?<Image className={`h-full w-full object-contain ${framed?'p-[14%]':'p-0'} ${!framed&&needsLightContrast?'[[data-theme=light]_&]:invert':''}`} src={logo} alt={`Logo ${title}`} width={320} height={220}/>:<span className={`font-display tracking-[-.04em] ${framed?'text-[clamp(30px,5vw,54px)]':'text-2xl'}`} aria-label={`Identidade ${title}`}>{initials}</span>}
  </div>
}
