'use client'

import {useEffect,useRef,useState} from 'react'
import type {TreeNode} from './project-data'

function FolderNode({node,depth=0}:{node:TreeNode;depth?:number}){
  const [open,setOpen]=useState(depth<3)
  const children=useRef<HTMLDivElement>(null)
  const activeMotion=useRef<Animation|null>(null)
  useEffect(()=>()=>activeMotion.current?.cancel(),[])
  const toggle=()=>{
    if(!children.current)return
    const element=children.current
    activeMotion.current?.cancel()
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){setOpen(value=>!value);return}
    if(open){
      const motion=element.animate([{height:`${element.scrollHeight}px`,opacity:1},{height:'0px',opacity:0}],{duration:360,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'})
      activeMotion.current=motion
      motion.finished.then(()=>{if(activeMotion.current!==motion)return;setOpen(false);activeMotion.current=null}).catch(()=>undefined)
    }else{
      setOpen(true)
      requestAnimationFrame(()=>{if(!children.current)return;const target=children.current;const motion=target.animate([{height:'0px',opacity:0},{height:`${target.scrollHeight}px`,opacity:1}],{duration:440,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});activeMotion.current=motion;motion.finished.then(()=>{if(activeMotion.current!==motion)return;target.style.height='auto';target.style.opacity='1';activeMotion.current=null;motion.cancel()}).catch(()=>undefined)})
    }
  }

  const rowClass='tree-row flex h-[34px] w-full items-center gap-2.5 rounded-[7px] border-0 bg-transparent pr-2.5 pl-[calc(7px+var(--tree-depth)*17px)] text-left font-mono text-small text-inherit opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:pl-[calc(10px+var(--tree-depth)*22px)] md:text-body-sm'
  if(node.type==='file')return <div className={`${rowClass} tree-file`} style={{'--tree-depth':depth} as React.CSSProperties}><span className="relative h-4 w-[13px] flex-none rounded-[1px] border border-[color-mix(in_srgb,var(--paper)_48%,transparent)] after:absolute after:top-[-1px] after:right-[-1px] after:border-t-[5px] after:border-t-ink after:border-l-[5px] after:border-l-transparent after:content-['']"/><span>{node.name}</span></div>
  return <div className="tree-folder">
    <button className={`${rowClass} folder-row hover:bg-[color-mix(in_srgb,var(--paper)_9%,transparent)] focus-visible:bg-[color-mix(in_srgb,var(--paper)_9%,transparent)] focus-visible:outline-none`} style={{'--tree-depth':depth} as React.CSSProperties} type="button" onClick={toggle} aria-expanded={open}><span className={`relative h-3 w-[17px] flex-none origin-bottom-left rounded-sm border border-[color-mix(in_srgb,var(--paper)_65%,transparent)] bg-[color-mix(in_srgb,var(--paper)_10%,transparent)] transition-[transform,background-color] duration-220 before:absolute before:bottom-full before:left-px before:h-[3px] before:w-[7px] before:rounded-t-sm before:border before:border-b-0 before:border-[color-mix(in_srgb,var(--paper)_65%,transparent)] before:content-[''] ${open?'skew-x-[-7deg] bg-[color-mix(in_srgb,var(--paper)_22%,transparent)]':''}`}/><span>{node.name}</span><small className="ml-auto font-sans text-[13px] opacity-40">{open?'−':'+'}</small></button>
    <div ref={children} className="overflow-hidden" hidden={!open}>{open&&node.children?.map(child=><FolderNode key={`${node.name}/${child.name}`} node={child} depth={depth+1}/>)}</div>
  </div>
}

export function RepositoryTree({nodes}:{nodes:TreeNode[]}){
  const root=useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if(!root.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const motions=Array.from(root.current.querySelectorAll<HTMLElement>('.tree-row')).map((row,index)=>row.animate([{opacity:0,transform:'translateX(-16px)'},{opacity:1,transform:'translateX(0)'}],{duration:520,delay:180+index*52,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}))
    return()=>motions.forEach(motion=>motion.cancel())
  },[])
  return <div ref={root} className="repository-tree min-h-[310px] overflow-x-auto rounded-b-[17px] border border-[color-mix(in_srgb,var(--paper)_24%,transparent)] bg-[color-mix(in_srgb,var(--ink)_72%,transparent)] px-2.5 pt-[18px] pb-[25px] shadow-[0_25px_70px_rgba(0,0,0,.2)] backdrop-blur-2xl md:min-h-[410px] md:overflow-x-visible">{nodes.map(node=><FolderNode key={node.name} node={node}/>)}</div>
}
