'use client'

import {useRef,useState} from 'react'
import Image from 'next/image'
import {useTranslations} from 'next-intl'
import {useScrollReveal} from '@/app/hooks/use-scroll-reveal'
import {siteContent} from '@/messages/site-content'
import './resume.css'

const experiences=['smart','inet','getninjas'] as const
const education=['ai','computer','systems'] as const

export function ResumePage(){
  const t=useTranslations('Resume')
  const root=useRef<HTMLElement>(null)
  const [exporting,setExporting]=useState(false)
  useScrollReveal(root,'.resume-reveal')
  const download=async()=>{
    if(!root.current||exporting)return
    setExporting(true)
    try{
      await document.fonts.ready
      const [{default:html2canvas},{jsPDF}]=await Promise.all([import('html2canvas'),import('jspdf')])
      const canvas=await html2canvas(root.current,{scale:2,useCORS:true,backgroundColor:'#181714',onclone:documentClone=>{
        const clone=documentClone.querySelector<HTMLElement>('[data-resume-document]')
        if(!clone)return
        clone.style.setProperty('background-color','#181714','important')
        clone.style.setProperty('color','#e7dfd1','important')
        clone.querySelectorAll<HTMLElement>('*').forEach(element=>{
          element.style.setProperty('color','#e7dfd1','important')
          element.style.setProperty('background-color','transparent','important')
          element.style.setProperty('border-color','rgba(231, 223, 209, 0.28)','important')
          element.style.setProperty('outline-color','#e7dfd1','important')
          element.style.setProperty('text-decoration-color','#e7dfd1','important')
          element.style.setProperty('box-shadow','none','important')
          element.style.setProperty('text-shadow','none','important')
        })
        clone.querySelectorAll<HTMLElement>('.resume-education-list article').forEach(element=>element.style.setProperty('background-color','#181714','important'))
        clone.querySelectorAll<HTMLElement>('.resume-reveal').forEach(element=>{element.style.opacity='1';element.style.transform='none';element.style.filter='none'})
      }})
      const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'})
      const pageWidth=pdf.internal.pageSize.getWidth()
      const pageHeight=pdf.internal.pageSize.getHeight()
      const imageHeight=canvas.height*pageWidth/canvas.width
      const image=canvas.toDataURL('image/jpeg',.94)
      for(let offset=0,page=0;offset<imageHeight;offset+=pageHeight,page++){
        if(page>0)pdf.addPage()
        pdf.addImage(image,'JPEG',0,-offset,pageWidth,imageHeight,undefined,'FAST')
      }
      pdf.save(t('downloadFileName'))
    }catch(error){console.error('Não foi possível gerar o currículo em PDF.',error)}finally{setExporting(false)}
  }
  return <main ref={root} className="editorial-page resume-page" data-resume-document>
    <header className="resume-header resume-reveal">
      <p>{t('eyebrow')}</p>
      <h1>{t('title')}</h1>
      <Image className="resume-photo" src="/assets/fernando.png" alt={t('portraitAlt')} width={320} height={320} priority/>
      <div><strong>{t('role')}</strong><span>{t('location')}</span></div>
      <nav aria-label={t('contact')}><a href={`mailto:${siteContent.contacts.email}`}>{t('email')} ↗</a><a href={siteContent.contacts.linkedin} target="_blank" rel="noreferrer">{t('linkedin')} ↗</a><a href={siteContent.contacts.github} target="_blank" rel="noreferrer">{t('github')} ↗</a><button type="button" onClick={download} disabled={exporting} data-html2canvas-ignore>{t(exporting?'generating':'download')} ↓</button></nav>
    </header>

    <section className="resume-summary resume-reveal"><p>{t('summaryEyebrow')}</p><h2>{t('summary')}</h2></section>

    <section className="resume-section" aria-labelledby="resume-experience">
      <header className="resume-section-title resume-reveal"><p>{siteContent.sectionNumbers.experience}</p><h2 id="resume-experience">{t('experience')}</h2></header>
      <div className="resume-experience-list">{experiences.map(key=><article className="resume-experience resume-reveal" key={key}><div><span>{t(`experiences.${key}.period`)}</span><small>{t(`experiences.${key}.location`)}</small></div><div><p>{t(`experiences.${key}.company`)}</p><h3>{t(`experiences.${key}.role`)}</h3><span>{t(`experiences.${key}.description`)}</span></div></article>)}</div>
    </section>

    <section className="resume-section resume-section--split" aria-labelledby="resume-education">
      <header className="resume-section-title resume-reveal"><p>{siteContent.sectionNumbers.education}</p><h2 id="resume-education">{t('education')}</h2></header>
      <div className="resume-education-list">{education.map(key=><article className="resume-reveal" key={key}><span>{t(`educationItems.${key}.period`)}</span><h3>{t(`educationItems.${key}.course`)}</h3><p>{t(`educationItems.${key}.school`)}</p></article>)}</div>
    </section>

    <section className="resume-section resume-section--split" aria-labelledby="resume-skills">
      <header className="resume-section-title resume-reveal"><p>{siteContent.sectionNumbers.skills}</p><h2 id="resume-skills">{t('skills')}</h2></header>
      <div className="resume-skills">{Object.entries(siteContent.resumeSkills).map(([group,items])=><article className="resume-reveal" key={group}><h3>{t(`skillGroups.${group}`)}</h3><ul>{items.map(item=><li key={item}>{item}</li>)}</ul></article>)}</div>
    </section>

    <footer className="resume-footer resume-reveal"><p>{t('languages')}</p><strong>{t('languageValue')}</strong><a href={`mailto:${siteContent.contacts.email}`}>{t('cta')} ↗</a></footer>
  </main>
}
