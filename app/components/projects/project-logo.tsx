import Image from 'next/image'
import {getProjectLogo} from '@/messages/project-brand'

export function ProjectLogo({id,title,className='',framed=true,compact=false,preview=false}:{id:string;title:string;className?:string;framed?:boolean;compact?:boolean;preview?:boolean}){
  const logo=getProjectLogo(id)
  const initials=title.split(/\s+/).filter(Boolean).slice(0,2).map(word=>word[0]).join('').toUpperCase()
  const needsLightContrast=id==='rehau'||id==='fertec'
  const frame=framed?'overflow-hidden border border-[color-mix(in_srgb,var(--paper)_28%,transparent)] bg-[#11120f] text-[#f3ede4]':'text-paper'
  const boxStyle=compact
    ?{width:'48px',minWidth:'48px',maxWidth:'48px',height:'36px',minHeight:'36px',maxHeight:'36px',alignSelf:'center'}
    :preview
      ?{width:'116px',minWidth:'116px',maxWidth:'116px',height:'88px',minHeight:'88px',maxHeight:'88px',alignSelf:'center',overflow:'hidden'}
      :undefined
  const imageStyle=compact
    ?{display:'block',width:'48px',height:'30px',maxWidth:'48px',maxHeight:'30px',objectFit:'contain' as const,objectPosition:'center'}
    :{display:'block',width:'100%',height:'100%',maxWidth:'100%',maxHeight:'100%',objectFit:'contain' as const,objectPosition:'center'}
  return <div className={`project-logo grid place-items-center ${frame} ${className}`} style={boxStyle}>
    {logo?<Image className={`block object-contain object-center ${compact?'':'h-full w-full'} ${framed?'p-[14%]':'p-0'} ${!framed&&needsLightContrast?'[[data-theme=light]_&]:invert':''}`} style={imageStyle} src={logo} alt={`Logo ${title}`} width={compact?48:320} height={compact?30:220}/>:<span className={`font-display tracking-[-.04em] ${framed?'text-[clamp(30px,5vw,54px)]':'text-2xl'}`} aria-label={`Identidade ${title}`}>{initials}</span>}
  </div>
}
