'use client'

import {useRef,useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {useTranslations} from 'next-intl'
import {useScrollReveal} from '@/app/hooks/use-scroll-reveal'
import {siteContent} from '@/messages/site-content'
import {projects} from '@/messages/project-data'
import {SocialIcon} from '@/app/components/ui/social-icon'

const experiences=['smart','inet','getninjas'] as const
const education=['projectManagement','ai','computer','systems','it','administration'] as const
const featuredProjects=projects.filter(project=>project.id==='miraj'||project.id==='mimelie').sort((a,b)=>Number(b.id==='miraj')-Number(a.id==='miraj'))
const languages=['portuguese','english'] as const

export function ResumePage(){
  const t=useTranslations('Resume')
  const projectT=useTranslations('Projects')
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
      experiences.forEach(key=>{
        const [role,progression='']=t(`experiences.${key}.role`).split(' · ')
        const pdfRole=progression?`${role} | ${progression.replace(/\s*→\s*/,' a ')}`:role
        item(
          pdfRole,
          `${t(`experiences.${key}.company`)} | ${t(`experiences.${key}.location`)} | ${t(`experiences.${key}.period`)}`,
          t(`experiences.${key}.description`),
        )
      })

      section(t('education'))
      education.forEach(key=>item(
        t(`educationItems.${key}.course`),
        [t(`educationItems.${key}.school`),t(`educationItems.${key}.period`),key==='computer'||key==='systems'?t('parallelEducation'):''].filter(Boolean).join(' | '),
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

      section(t('projects'))
      featuredProjects.forEach(project=>item(
        project.title,
        project.tags.join(' · '),
        projectT(`items.${project.id}`),
      ))

      section(t('languages'))
      languages.forEach(language=>item(
        t(`languageItems.${language}.name`),
        `${t(`languageItems.${language}.level`)} | ${t(`languageItems.${language}.cefr`)}`,
        '',
      ))

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
  const pill='group inline-flex min-h-9 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[color-mix(in_srgb,var(--paper)_34%,transparent)] bg-transparent px-3 text-center text-caption leading-none font-bold tracking-[.09em] text-inherit uppercase no-underline transition-[background,color,border-color] duration-200 hover:border-paper hover:bg-paper hover:text-ink'
  const contactIcon='h-3.5 w-3.5 flex-none transition-transform duration-200 group-hover:scale-110'
  const sectionClass='resume-section grid grid-cols-1 justify-items-center gap-[30px] border-t border-[color-mix(in_srgb,var(--paper)_22%,transparent)] py-10 md:grid-cols-[minmax(180px,.4fr)_1fr] md:justify-items-stretch md:gap-14 md:py-[54px]'
  const sectionHeaderClass='resume-section-title resume-reveal opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none'
  const sectionTitleClass='mx-auto mt-3 mb-0 max-w-none font-display text-[clamp(35px,4.5vw,58px)] leading-[.9] font-normal md:mx-0 md:max-w-[8ch]'
  const timelineClass='relative grid w-full before:absolute before:top-[7px] before:bottom-[7px] before:left-[5px] before:w-px before:bg-[color-mix(in_srgb,var(--paper)_24%,transparent)]'
  const timelineItemClass='resume-reveal relative grid grid-cols-[11px_minmax(0,1fr)] gap-x-5 pb-10 text-left opacity-0 last:pb-0 motion-reduce:opacity-100 motion-reduce:transform-none'
  const timelineMarker=<span className="relative z-10 mt-1.5 block h-[11px] w-[11px] rounded-full border-2 border-paper bg-ink shadow-[0_0_0_5px_var(--ink)]" aria-hidden="true"/>
  return <main ref={root} className="editorial-page resume-page mx-auto w-[calc(100%_-_36px)] max-w-[1080px] pt-4 text-center md:w-[min(1180px,91vw)] md:pt-[clamp(78px,9vh,108px)] md:text-left" data-resume-document>
    <header className="resume-header resume-reveal grid grid-cols-1 [grid-template-areas:'eyebrow'_'title'_'photo'_'meta'_'links'] justify-items-center gap-[18px] border-b border-[color-mix(in_srgb,var(--paper)_28%,transparent)] pb-9 opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:grid-cols-[minmax(0,1fr)_190px] md:[grid-template-areas:'eyebrow_eyebrow'_'title_photo'_'meta_photo'_'links_links'] md:items-end md:justify-items-stretch md:gap-x-12 md:gap-y-5 md:pb-12">
      <p className="m-0 [grid-area:eyebrow] text-caption font-[750] tracking-[.2em] uppercase opacity-55">{t('eyebrow')}</p>
      <h1 className="m-0 max-w-[12ch] [grid-area:title] font-display text-[clamp(44px,12vw,58px)] leading-[.9] font-normal tracking-[-.04em] md:text-[clamp(54px,6vw,78px)]">{t('title')}</h1>
      <div className="resume-photo-frame pointer-events-none relative w-[min(48vw,180px)] [grid-area:photo] aspect-square overflow-hidden rounded-[20px] border border-[color-mix(in_srgb,var(--paper)_28%,transparent)] shadow-[0_20px_55px_rgba(0,0,0,.24)] md:w-[190px] md:self-start md:rounded-3xl"><Image className="block h-full w-full object-cover" src="/assets/fernando.png" alt={t('portraitAlt')} width={320} height={320} priority/></div>
      <div className="grid [grid-area:meta] gap-1.5"><strong className="font-display text-[25px] font-normal">{t('role')}</strong><span className="text-label tracking-[.11em] uppercase opacity-55">{t('location')}</span></div>
      <nav className="mt-1 flex flex-wrap justify-center gap-2.5 [grid-area:links] md:justify-start" aria-label={t('contact')}><a className={pill} href={`mailto:${siteContent.contacts.email}`}><SocialIcon network="email" className={contactIcon}/>{t('email')} ↗</a><a className={pill} href={siteContent.contacts.linkedin} target="_blank" rel="noreferrer"><SocialIcon network="linkedin" className={contactIcon}/>{t('linkedin')} ↗</a><a className={pill} href={siteContent.contacts.github} target="_blank" rel="noreferrer"><SocialIcon network="github" className={contactIcon}/>{t('github')} ↗</a><button className="resume-download mx-auto mt-1 inline-flex min-h-11 w-full max-w-[290px] items-center justify-center gap-2 rounded-full border border-paper bg-paper px-[18px] text-label font-bold tracking-[.09em] text-ink uppercase shadow-[0_12px_30px_rgba(0,0,0,.18)] transition-[transform,box-shadow] duration-240 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,.25)] focus-visible:-translate-y-0.5 focus-visible:shadow-[0_16px_36px_rgba(0,0,0,.25)] focus-visible:outline-none disabled:cursor-wait disabled:opacity-55 md:mr-0 md:ml-auto md:w-auto" type="button" onClick={download} disabled={exporting} data-html2canvas-ignore>{t(exporting?'generating':'download')} <svg className="h-[15px] w-[15px] flex-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.5]" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v8m0 0 3-3m-3 3L5 7M3 13h10"/></svg></button></nav>
    </header>

    <section className={sectionClass} aria-labelledby="resume-objective">
      <header className={sectionHeaderClass}><p className="editorial-number m-0 text-caption tracking-[.18em] uppercase">{siteContent.sectionNumbers.objective}</p><h2 className={sectionTitleClass} id="resume-objective">{t('summaryEyebrow')}</h2></header>
      <p className="resume-reveal m-0 w-full text-center font-display text-[clamp(20px,5.6vw,25px)] leading-[1.36] font-normal tracking-[-.01em] opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:text-left md:text-[clamp(21px,2.15vw,27px)]">{t('summary')}</p>
    </section>

    <section className={sectionClass} aria-labelledby="resume-experience">
      <header className={sectionHeaderClass}><p className="editorial-number m-0 text-caption tracking-[.18em] uppercase">{siteContent.sectionNumbers.experience}</p><h2 className={sectionTitleClass} id="resume-experience">{t('experience')}</h2></header>
      <div className={`resume-experience-list ${timelineClass}`}>{experiences.map(key=>{const [role,...progressionParts]=t(`experiences.${key}.role`).split(' · ');const progression=progressionParts.join(' · ');const [previousRole,nextRole]=progression.split('→').map(value=>value.trim());return <article className={`resume-experience ${timelineItemClass}`} key={key}>{timelineMarker}<div><div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1"><p className="m-0 text-caption font-[750] tracking-[.15em] uppercase opacity-58">{t(`experiences.${key}.company`)}</p><span className="font-display text-base leading-none opacity-62">{t(`experiences.${key}.period`)}</span></div><h3 className="m-0 font-display text-[29px] leading-[.98] font-normal"><span>{role}</span>{progression&&<span className="hidden md:inline"> · {progression}</span>}</h3>{previousRole&&nextRole&&<div className="mt-3 grid grid-cols-[auto_minmax(28px,1fr)_auto] items-center gap-2 md:hidden" aria-label={progression}><span className="content-chip rounded-full px-3 py-2 text-caption leading-none">{previousRole}</span><i className="relative h-px bg-[color-mix(in_srgb,var(--paper)_38%,transparent)] after:absolute after:top-1/2 after:right-0 after:h-1.5 after:w-1.5 after:-translate-y-1/2 after:rotate-45 after:border-t after:border-r after:border-current after:content-['']" aria-hidden="true"/><span className="content-chip rounded-full px-3 py-2 text-caption leading-none">{nextRole}</span></div>}<small className="mt-2 block font-sans text-caption tracking-[.1em] uppercase opacity-46">{t(`experiences.${key}.location`)}</small><p className="mt-3.5 mb-0 text-body-sm leading-[1.7] opacity-68">{t(`experiences.${key}.description`)}</p></div></article>})}</div>
    </section>

    <section className={sectionClass} aria-labelledby="resume-education">
      <header className={sectionHeaderClass}><p className="editorial-number m-0 text-caption tracking-[.18em] uppercase">{siteContent.sectionNumbers.education}</p><h2 className={sectionTitleClass} id="resume-education">{t('education')}</h2></header>
      <div className={`resume-education-list ${timelineClass}`}>{education.filter(key=>key!=='systems').map(key=>key==='computer'?<article className={timelineItemClass} key="parallel-degrees">{timelineMarker}<div><p className="m-0 mb-3 text-caption font-[750] tracking-[.14em] uppercase opacity-62">{t('parallelEducation')}</p><div className="grid gap-px bg-[color-mix(in_srgb,var(--paper)_20%,transparent)] sm:grid-cols-2">{(['computer','systems'] as const).map(course=><section className="grid content-start gap-2 bg-[color-mix(in_srgb,var(--ink)_94%,transparent)] p-4 text-left" key={course}><span className="font-display text-base leading-none opacity-62">{t(`educationItems.${course}.period`)}</span><p className="m-0 text-caption font-[750] tracking-[.13em] uppercase opacity-58">{t(`educationItems.${course}.school`)}</p><h3 className="m-0 font-display text-[26px] leading-[.98] font-normal">{t(`educationItems.${course}.course`)}</h3></section>)}</div></div></article>:<article className={timelineItemClass} key={key}>{timelineMarker}<div><div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1"><p className="m-0 text-caption font-[750] tracking-[.15em] uppercase opacity-58">{t(`educationItems.${key}.school`)}</p>{t(`educationItems.${key}.period`)?<span className="font-display text-base leading-none opacity-62">{t(`educationItems.${key}.period`)}</span>:null}</div><h3 className="m-0 font-display text-[29px] leading-[.98] font-normal">{t(`educationItems.${key}.course`)}</h3></div></article>)}</div>
    </section>

    <section className={sectionClass} aria-labelledby="resume-skills">
      <header className={sectionHeaderClass}><p className="editorial-number m-0 text-caption tracking-[.18em] uppercase">{siteContent.sectionNumbers.skills}</p><h2 className={sectionTitleClass} id="resume-skills">{t('skills')}</h2></header>
      <div className="resume-skills grid grid-cols-1 justify-items-center gap-x-9 gap-y-7 md:grid-cols-2 md:justify-items-stretch">{Object.entries(siteContent.resumeSkills).map(([group,items])=><article className="resume-reveal opacity-0 last:md:col-span-2 motion-reduce:opacity-100 motion-reduce:transform-none" key={group}><h3 className="m-0 mb-3 text-caption tracking-[.15em] uppercase opacity-74">{t(`skillGroups.${group}`)}</h3><ul className="m-0 flex list-none flex-wrap justify-center gap-2 p-0 md:justify-start">{items.map(item=><li className="content-chip rounded-full px-3 py-2 text-caption" key={item}>{item}</li>)}</ul></article>)}</div>
    </section>

    <section className={sectionClass} aria-labelledby="resume-projects">
      <header className={sectionHeaderClass}><p className="editorial-number m-0 text-caption tracking-[.18em] uppercase">{siteContent.sectionNumbers.projects}</p><h2 className={sectionTitleClass} id="resume-projects">{t('projects')}</h2></header>
      <div className="resume-project-list grid w-full">{featuredProjects.map((project,index)=><Link className={`resume-reveal group relative grid grid-cols-1 border-t border-[color-mix(in_srgb,var(--paper)_24%,transparent)] py-6 text-left text-inherit no-underline opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:grid-cols-[minmax(0,1fr)_auto] md:gap-x-5 md:py-7 ${index===0?'border-t-0 pt-0':''}`} href={`/projetos/${project.id}`} key={project.id}><div className="pr-10 md:pr-0"><p className="m-0 mb-2 max-w-full text-caption leading-[1.55] font-[750] tracking-[.12em] uppercase opacity-52">{project.tags.join(' · ')}</p><h3 className="m-0 font-display text-[clamp(30px,8vw,36px)] leading-none font-normal">{project.title}</h3><p className="mt-3 mb-0 max-w-[54ch] text-body-sm leading-[1.65] opacity-68">{projectT(`items.${project.id}`)}</p></div><span className="absolute top-0 right-0 grid h-9 w-9 place-items-center rounded-full border border-[color-mix(in_srgb,var(--paper)_30%,transparent)] font-display text-xl transition-[transform,background,color] duration-200 group-hover:translate-x-1 group-hover:bg-paper group-hover:text-ink md:static md:mt-6 md:block md:h-auto md:w-auto md:rounded-none md:border-0 md:text-2xl" aria-hidden="true">→</span></Link>)}</div>
    </section>

    <section className={sectionClass} aria-labelledby="resume-languages"><header className={sectionHeaderClass}><p className="editorial-number m-0 text-caption tracking-[.18em] uppercase">{siteContent.sectionNumbers.languages}</p><h2 className={sectionTitleClass} id="resume-languages">{t('languages')}</h2></header><ul className="m-0 grid w-full list-none gap-px bg-[color-mix(in_srgb,var(--paper)_18%,transparent)] p-0 sm:grid-cols-2">{languages.map(language=><li className="grid gap-2 bg-[color-mix(in_srgb,var(--ink)_95%,transparent)] p-5 text-center sm:text-left" key={language}><strong className="font-display text-2xl font-normal">{t(`languageItems.${language}.name`)}</strong><span className="text-label opacity-64">{t(`languageItems.${language}.level`)}</span><span className="text-caption font-[750] tracking-[.14em] uppercase opacity-48">CEFR · {t(`languageItems.${language}.cefr`)}</span></li>)}</ul></section>
  </main>
}
