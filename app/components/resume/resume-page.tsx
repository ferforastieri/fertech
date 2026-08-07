'use client'

import {useRef,useState} from 'react'
import Image from 'next/image'
import {useTranslations} from 'next-intl'
import {useScrollReveal} from '@/app/hooks/use-scroll-reveal'
import {siteContent} from '@/messages/site-content'

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
      const portrait=await new Promise<string>((resolve,reject)=>{
        const image=new window.Image()
        image.onload=()=>{
          const canvas=document.createElement('canvas')
          canvas.width=image.naturalWidth
          canvas.height=image.naturalHeight
          const context=canvas.getContext('2d')
          if(!context){reject(new Error('Canvas indisponível'));return}
          context.filter='grayscale(1) contrast(1.08)'
          context.drawImage(image,0,0)
          resolve(canvas.toDataURL('image/jpeg',.9))
        }
        image.onerror=()=>reject(new Error('Foto do currículo indisponível'))
        image.src='/assets/fernando.png'
      })

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
      const photoSize=34
      pdf.addImage(portrait,'JPEG',pageWidth-margin-photoSize,margin,photoSize,photoSize,undefined,'FAST')
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
      y=Math.max(y+8,margin+photoSize+7)

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
  const pill='inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-full border border-[color-mix(in_srgb,var(--paper)_34%,transparent)] bg-transparent px-3 text-center text-caption leading-none font-bold tracking-[.09em] text-inherit uppercase no-underline'
  const sectionClass='resume-section grid grid-cols-1 justify-items-center gap-[30px] border-t border-[color-mix(in_srgb,var(--paper)_22%,transparent)] py-10 md:grid-cols-[minmax(180px,.4fr)_1fr] md:justify-items-stretch md:gap-14 md:py-[54px]'
  return <main ref={root} className="editorial-page resume-page mx-auto min-h-svh w-[calc(100%_-_36px)] max-w-[1080px] pt-4 pb-6 text-center md:w-[min(1180px,91vw)] md:pt-[clamp(78px,9vh,108px)] md:pb-[120px] md:text-left" data-resume-document>
    <header className="resume-header resume-reveal grid grid-cols-1 [grid-template-areas:'eyebrow'_'title'_'photo'_'meta'_'links'] justify-items-center gap-[18px] border-b border-[color-mix(in_srgb,var(--paper)_28%,transparent)] pb-9 opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:grid-cols-[minmax(0,1fr)_190px] md:[grid-template-areas:'eyebrow_photo'_'title_photo'_'meta_photo'_'links_links'] md:items-end md:justify-items-stretch md:gap-x-12 md:gap-y-5 md:pb-12">
      <p className="m-0 [grid-area:eyebrow] text-caption font-[750] tracking-[.2em] uppercase opacity-55">{t('eyebrow')}</p>
      <h1 className="m-0 [grid-area:title] font-display text-[clamp(52px,17vw,68px)] leading-[.78] font-normal tracking-[-.055em] md:text-[clamp(62px,9vw,118px)]">{t('title')}</h1>
      <div className="resume-photo-frame pointer-events-none relative w-[min(48vw,180px)] [grid-area:photo] aspect-square overflow-hidden rounded-[20px] shadow-[0_20px_55px_rgba(0,0,0,.24)] after:absolute after:inset-0 after:bg-[color-mix(in_srgb,var(--paper)_10%,transparent)] after:mix-blend-color after:content-[''] md:w-[190px] md:rounded-3xl"><Image className="block h-full w-full object-cover mix-blend-luminosity [filter:grayscale(1)_contrast(1.1)]" src="/assets/fernando.png" alt={t('portraitAlt')} width={320} height={320} priority/></div>
      <div className="grid [grid-area:meta] gap-1.5"><strong className="font-display text-[25px] font-normal">{t('role')}</strong><span className="text-label tracking-[.11em] uppercase opacity-55">{t('location')}</span></div>
      <nav className="mt-1 flex flex-wrap justify-center gap-2.5 [grid-area:links] md:justify-start" aria-label={t('contact')}><a className={pill} href={`mailto:${siteContent.contacts.email}`}>{t('email')} ↗</a><a className={pill} href={siteContent.contacts.linkedin} target="_blank" rel="noreferrer">{t('linkedin')} ↗</a><a className={pill} href={siteContent.contacts.github} target="_blank" rel="noreferrer">{t('github')} ↗</a><button className="resume-download mt-1 ml-auto inline-flex min-h-11 w-full max-w-[290px] items-center justify-center gap-2 rounded-full border border-paper bg-paper px-[18px] text-label font-bold tracking-[.09em] text-ink uppercase shadow-[0_12px_30px_rgba(0,0,0,.18)] transition-[transform,box-shadow] duration-240 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,.25)] focus-visible:-translate-y-0.5 focus-visible:shadow-[0_16px_36px_rgba(0,0,0,.25)] focus-visible:outline-none disabled:cursor-wait disabled:opacity-55 md:w-auto" type="button" onClick={download} disabled={exporting} data-html2canvas-ignore>{t(exporting?'generating':'download')} <svg className="h-[15px] w-[15px] flex-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.5]" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v8m0 0 3-3m-3 3L5 7M3 13h10"/></svg></button></nav>
    </header>

    <section className="resume-summary resume-reveal grid grid-cols-1 justify-items-center gap-[30px] py-10 opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:grid-cols-[minmax(180px,.4fr)_1fr] md:justify-items-stretch md:gap-14 md:py-16">
      <aside className="grid justify-items-center gap-3 text-center md:justify-items-start md:text-left">
        <span className="font-display text-[clamp(58px,7vw,88px)] leading-[.72] font-normal tracking-[-.06em] opacity-30">01</span>
        <p className="m-0 text-caption font-[750] tracking-[.18em] uppercase opacity-50">{t('summaryEyebrow')}</p>
        <i className="h-9 w-px bg-[color-mix(in_srgb,var(--paper)_32%,transparent)] md:h-14" aria-hidden="true"/>
        <strong className="max-w-[18ch] font-display text-lg leading-[1.08] font-normal italic opacity-72">{t('summaryNote')}</strong>
      </aside>
      <h2 className="m-0 font-display text-[clamp(24px,7.5vw,32px)] leading-[1.13] font-normal tracking-[-.02em] md:text-[clamp(27px,3.5vw,43px)]">{t('summary')}</h2>
    </section>

    <section className={sectionClass} aria-labelledby="resume-experience">
      <header className="resume-section-title resume-reveal opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none"><p className="m-0 text-caption font-[750] tracking-[.18em] uppercase opacity-50">{siteContent.sectionNumbers.experience}</p><h2 className="mx-auto mt-3 mb-0 max-w-none font-display text-[clamp(35px,4.5vw,58px)] leading-[.9] font-normal md:mx-0 md:max-w-[8ch]" id="resume-experience">{t('experience')}</h2></header>
      <div className="resume-experience-list grid">{experiences.map((key,index)=><article className={`resume-experience resume-reveal grid grid-cols-1 gap-4 border-t border-[color-mix(in_srgb,var(--paper)_16%,transparent)] py-[25px] text-center opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:grid-cols-[150px_1fr] md:gap-7 md:text-left ${index===0?'border-t-0 pt-0':''}`} key={key}><div className="grid content-start justify-items-center gap-2 font-display text-base md:justify-items-stretch"><span>{t(`experiences.${key}.period`)}</span><small className="font-sans text-caption tracking-[.1em] uppercase opacity-46">{t(`experiences.${key}.location`)}</small></div><div><p className="m-0 mb-[7px] text-caption font-[750] tracking-[.15em] uppercase opacity-52">{t(`experiences.${key}.company`)}</p><h3 className="m-0 font-display text-[29px] leading-[.98] font-normal">{t(`experiences.${key}.role`)}</h3><span className="mt-3.5 block text-body-sm leading-[1.7] opacity-68">{t(`experiences.${key}.description`)}</span></div></article>)}</div>
    </section>

    <section className={sectionClass} aria-labelledby="resume-education">
      <header className="resume-section-title resume-reveal opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none"><p className="m-0 text-caption font-[750] tracking-[.18em] uppercase opacity-50">{siteContent.sectionNumbers.education}</p><h2 className="mx-auto mt-3 mb-0 max-w-none font-display text-[clamp(35px,4.5vw,58px)] leading-[.9] font-normal md:mx-0 md:max-w-[8ch]" id="resume-education">{t('education')}</h2></header>
      <div className="resume-education-list grid w-full grid-cols-1 gap-px bg-[color-mix(in_srgb,var(--paper)_18%,transparent)] md:grid-cols-3">{education.map(key=><article className="resume-reveal min-h-0 bg-[color-mix(in_srgb,var(--ink)_95%,transparent)] px-5 py-[26px] opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:min-h-[190px] md:p-[22px]" key={key}><span className="text-caption tracking-[.1em] opacity-45">{t(`educationItems.${key}.period`)}</span><h3 className="mt-[22px] mb-0 font-display text-[23px] leading-[.98] font-normal md:mt-[38px]">{t(`educationItems.${key}.course`)}</h3><p className="mt-3 mb-0 text-label leading-normal opacity-58">{t(`educationItems.${key}.school`)}</p></article>)}</div>
    </section>

    <section className={sectionClass} aria-labelledby="resume-skills">
      <header className="resume-section-title resume-reveal opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none"><p className="m-0 text-caption font-[750] tracking-[.18em] uppercase opacity-50">{siteContent.sectionNumbers.skills}</p><h2 className="mx-auto mt-3 mb-0 max-w-none font-display text-[clamp(35px,4.5vw,58px)] leading-[.9] font-normal md:mx-0 md:max-w-[8ch]" id="resume-skills">{t('skills')}</h2></header>
      <div className="resume-skills grid grid-cols-1 justify-items-center gap-x-9 gap-y-7 md:grid-cols-2 md:justify-items-stretch">{Object.entries(siteContent.resumeSkills).map(([group,items])=><article className="resume-reveal opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none" key={group}><h3 className="m-0 mb-3 text-caption tracking-[.15em] uppercase opacity-50">{t(`skillGroups.${group}`)}</h3><ul className="m-0 flex list-none flex-wrap justify-center gap-[7px] p-0 md:justify-start">{items.map(item=><li className="rounded-full border border-[color-mix(in_srgb,var(--paper)_23%,transparent)] px-[9px] py-1.5 text-caption" key={item}>{item}</li>)}</ul></article>)}</div>
    </section>

    <footer className="resume-footer resume-reveal grid grid-cols-1 items-center justify-items-center gap-6 border-t border-[color-mix(in_srgb,var(--paper)_22%,transparent)] pt-[34px] opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none md:grid-cols-[auto_1fr_auto] md:justify-items-stretch"><p className="m-0 text-caption font-[750] tracking-[.18em] uppercase opacity-50">{t('languages')}</p><strong className="font-display text-xl font-normal">{t('languageValue')}</strong><a className={pill} href={`mailto:${siteContent.contacts.email}`}>{t('cta')} ↗</a></footer>
  </main>
}
