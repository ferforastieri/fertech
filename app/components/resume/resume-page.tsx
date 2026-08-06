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
    if(exporting)return
    setExporting(true)
    try{
      const {jsPDF}=await import('jspdf')
      const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'})
      const pageWidth=pdf.internal.pageSize.getWidth()
      const pageHeight=pdf.internal.pageSize.getHeight()
      const margin=18
      const contentWidth=pageWidth-margin*2
      const bottom=pageHeight-18
      let y=margin

      const nextPage=()=>{pdf.addPage();y=margin}
      const ensureSpace=(height:number)=>{if(y+height>bottom)nextPage()}
      const line=(offset=0)=>{ensureSpace(6);pdf.setDrawColor(185,185,185);pdf.setLineWidth(.25);pdf.line(margin,y+offset,pageWidth-margin,y+offset)}
      const paragraph=(text:string,size=10,leading=4.5)=>{
        pdf.setFont('helvetica','normal')
        pdf.setFontSize(size)
        pdf.setTextColor(45,45,45)
        const lines=pdf.splitTextToSize(text,contentWidth)
        ensureSpace(lines.length*leading+2)
        pdf.text(lines,margin,y)
        y+=lines.length*leading+2
      }
      const section=(title:string)=>{
        ensureSpace(13)
        if(y>margin)line()
        y+=6
        pdf.setFont('helvetica','bold')
        pdf.setFontSize(11)
        pdf.setTextColor(25,25,25)
        pdf.text(title.toUpperCase(),margin,y)
        y+=7
      }
      const item=(title:string,subtitle:string,detail:string)=>{
        ensureSpace(18)
        pdf.setFont('helvetica','bold')
        pdf.setFontSize(10.5)
        pdf.setTextColor(30,30,30)
        pdf.text(title,margin,y)
        y+=4.8
        pdf.setFont('helvetica','normal')
        pdf.setFontSize(9.5)
        pdf.setTextColor(85,85,85)
        const subtitleLines=pdf.splitTextToSize(subtitle,contentWidth)
        ensureSpace(subtitleLines.length*4.2)
        pdf.text(subtitleLines,margin,y)
        y+=subtitleLines.length*4.2
        paragraph(detail,9.5,4.2)
        y+=3
      }

      pdf.setProperties({title:`${siteContent.identity.name} - ${t('role')}`,author:siteContent.identity.name,subject:t('eyebrow')})
      pdf.setFont('helvetica','bold')
      pdf.setFontSize(22)
      pdf.setTextColor(25,25,25)
      pdf.text(siteContent.identity.name,margin,y)
      y+=8
      pdf.setFont('helvetica','normal')
      pdf.setFontSize(11)
      pdf.setTextColor(75,75,75)
      pdf.text(t('role'),margin,y)
      y+=5
      pdf.setFontSize(9)
      pdf.text(`${t('location')}  |  ${siteContent.contacts.email}`,margin,y)
      y+=4.5
      pdf.text(`${siteContent.contacts.linkedin}  |  ${siteContent.contacts.github}`,margin,y)
      y+=8

      section(t('summaryEyebrow'))
      paragraph(t('summary'))

      section(t('experience'))
      experiences.forEach(key=>item(
        t(`experiences.${key}.role`),
        `${t(`experiences.${key}.company`)} | ${t(`experiences.${key}.location`)} | ${t(`experiences.${key}.period`)}`,
        t(`experiences.${key}.description`),
      ))

      section(t('education'))
      education.forEach(key=>item(
        t(`educationItems.${key}.course`),
        `${t(`educationItems.${key}.school`)} | ${t(`educationItems.${key}.period`)}`,
        '',
      ))

      section(t('skills'))
      Object.entries(siteContent.resumeSkills).forEach(([group,items])=>{
        ensureSpace(11)
        pdf.setFont('helvetica','bold')
        pdf.setFontSize(9.5)
        pdf.setTextColor(45,45,45)
        pdf.text(`${t(`skillGroups.${group}`)}:`,margin,y)
        const labelWidth=pdf.getTextWidth(`${t(`skillGroups.${group}`)}: `)
        pdf.setFont('helvetica','normal')
        const skillLines=pdf.splitTextToSize(items.join(' · '),contentWidth-labelWidth)
        pdf.text(skillLines,margin+labelWidth,y)
        y+=Math.max(1,skillLines.length)*4.5+2
      })

      section(t('languages'))
      paragraph(t('languageValue'),9.5,4.2)

      const pages=pdf.getNumberOfPages()
      for(let page=1;page<=pages;page++){
        pdf.setPage(page)
        pdf.setFont('helvetica','normal')
        pdf.setFontSize(8)
        pdf.setTextColor(120,120,120)
        pdf.text(`${siteContent.identity.name} · ${page}/${pages}`,pageWidth-margin,pageHeight-10,{align:'right'})
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
      <nav aria-label={t('contact')}><a href={`mailto:${siteContent.contacts.email}`}>{t('email')} ↗</a><a href={siteContent.contacts.linkedin} target="_blank" rel="noreferrer">{t('linkedin')} ↗</a><a href={siteContent.contacts.github} target="_blank" rel="noreferrer">{t('github')} ↗</a><button className="resume-download" type="button" onClick={download} disabled={exporting} data-html2canvas-ignore>{t(exporting?'generating':'download')} <span aria-hidden="true">↓</span></button></nav>
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
