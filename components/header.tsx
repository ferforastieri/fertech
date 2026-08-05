'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'

export function Header({name,navigation,contactLabel,contactUrl}:{name:string;navigation:{home:string;projects:string;blog:string;resume:string};contactLabel:string;contactUrl:string}){
  const header=useRef<HTMLElement>(null);const[solid,setSolid]=useState(false);const[theme,setTheme]=useState<'light'|'dark'>('dark')
  useEffect(()=>{const saved=localStorage.getItem('fertech-theme');const value=saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');setTheme(value);document.documentElement.dataset.theme=value},[])
  useEffect(()=>{let previous=scrollY;const scroll=()=>{const hidden=scrollY>previous&&scrollY>180;setSolid(scrollY>30);if(header.current)animate(header.current,{y:hidden?-90:0,duration:420,ease:'outExpo'});previous=scrollY};addEventListener('scroll',scroll,{passive:true});return()=>removeEventListener('scroll',scroll)},[])
  function toggle(){const value=theme==='dark'?'light':'dark';setTheme(value);document.documentElement.dataset.theme=value;localStorage.setItem('fertech-theme',value)}
  return <header ref={header} className={`header ${solid?'solid':''}`}><Link href="/" className="brand"><span>F</span><b>{name}</b></Link><nav><Link href="/">{navigation.home}</Link><Link href="/blog/">{navigation.blog}</Link><Link href="/resume/">{navigation.resume}</Link><button className="header-theme" onClick={toggle}>{theme==='dark'?'LIGHT':'DARK'}</button></nav><a className="contact" href={contactUrl}>{contactLabel} ↗</a></header>
}
