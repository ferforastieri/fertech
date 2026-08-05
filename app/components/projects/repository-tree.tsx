'use client'

import {useEffect,useRef,useState} from 'react'
import {animate,stagger,utils} from 'animejs'
import type {TreeNode} from './project-data'

function FolderNode({node,depth=0}:{node:TreeNode;depth?:number}){
  const [open,setOpen]=useState(depth<2)
  const children=useRef<HTMLDivElement>(null)
  const toggle=()=>{
    if(!children.current)return
    const element=children.current
    if(open){
      animate(element,{height:[element.scrollHeight,0],opacity:[1,0],duration:360,ease:'inOutQuart',onComplete:()=>setOpen(false)})
    }else{
      setOpen(true)
      requestAnimationFrame(()=>{if(!children.current)return;utils.set(children.current,{height:0,opacity:0});animate(children.current,{height:[0,children.current.scrollHeight],opacity:[0,1],duration:440,ease:'outExpo',onComplete:()=>{if(children.current)children.current.style.height='auto'}})})
    }
  }

  if(node.type==='file')return <div className="tree-row tree-file" style={{'--tree-depth':depth} as React.CSSProperties}><span className="file-icon"/><span>{node.name}</span></div>
  return <div className="tree-folder">
    <button className="tree-row folder-row" style={{'--tree-depth':depth} as React.CSSProperties} type="button" onClick={toggle} aria-expanded={open}><span className={`folder-icon${open?' is-open':''}`}/><span>{node.name}</span><small>{open?'−':'+'}</small></button>
    <div ref={children} className="folder-children" hidden={!open}>{node.children?.map(child=><FolderNode key={`${node.name}/${child.name}`} node={child} depth={depth+1}/>)}</div>
  </div>
}

export function RepositoryTree({nodes}:{nodes:TreeNode[]}){
  const root=useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if(!root.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const reveal=()=>animate(root.current!.querySelectorAll('.tree-row'),{opacity:[0,1],x:[-16,0],delay:stagger(52,{start:180}),duration:520,ease:'outExpo'})
    window.addEventListener('book-opened',reveal,{once:true})
    const fallback=setTimeout(reveal,1300)
    return()=>{window.removeEventListener('book-opened',reveal);clearTimeout(fallback)}
  },[])
  return <div ref={root} className="repository-tree">{nodes.map(node=><FolderNode key={node.name} node={node}/>)}</div>
}
