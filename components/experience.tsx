'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AmbientCanvas } from './ambient-canvas'

gsap.registerPlugin(ScrollTrigger)

export function Experience({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const cursor = useRef<HTMLDivElement>(null)
  const cursorLabel = useRef<HTMLSpanElement>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let value = 0
    const timer = window.setInterval(() => {
      value = Math.min(100, value + Math.ceil((100 - value) * .18))
      setProgress(value)
      if (value === 100) {
        window.clearInterval(timer)
        window.setTimeout(() => setLoading(false), 350)
      }
    }, 45)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: .85 })
    let frame = 0
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf) }
    frame = requestAnimationFrame(raf)
    lenis.on('scroll', ScrollTrigger.update)
    return () => { cancelAnimationFrame(frame); lenis.destroy() }
  }, [])

  useEffect(() => {
    if (loading) return
    const context = gsap.context(() => {
      gsap.fromTo('.header', { y: -100 }, { y: 0, duration: 1.1, ease: 'expo.out' })
      gsap.utils.toArray<HTMLElement>('.manifesto h2,.section-head h2,.listing h1,.resume h1,.case header h1').forEach((element) => {
        gsap.from(element, { yPercent: 115, rotate: 3, opacity: 0, duration: 1.25, ease: 'expo.out', scrollTrigger: { trigger: element, start: 'top 88%' } })
      })
      gsap.utils.toArray<HTMLElement>('.stack-row,.highlight,.article-grid>a').forEach((element, index) => {
        gsap.from(element, { xPercent: index % 2 ? 8 : -8, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 90%' } })
      })
      const media = gsap.matchMedia()
      media.add('(min-width: 801px)', () => {
        const rail = document.querySelector<HTMLElement>('.project-rail')
        if (!rail) return
        const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth + window.innerWidth * .12)
        gsap.to(rail, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: '.work', start: 'top top', end: () => `+=${distance() + window.innerHeight * .75}`, pin: true, scrub: 1.05, invalidateOnRefresh: true } })
        gsap.utils.toArray<HTMLElement>('.rail-project').forEach((card, index) => {
          const visual = card.querySelector<HTMLElement>('.rail-project__visual')
          gsap.fromTo(card, { rotate: index % 2 ? 2.5 : -2.5 }, { rotate: index % 2 ? -1 : 1, ease: 'none', scrollTrigger: { trigger: '.work', start: 'top top', end: 'bottom bottom', scrub: 1 } })
          if (visual) gsap.to(visual, { yPercent: index % 2 ? -14 : 14, ease: 'none', scrollTrigger: { trigger: '.work', start: 'top top', end: 'bottom bottom', scrub: 1 } })
        })
      })
      gsap.to('.sphere', { scale: 1.4, rotate: 35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
      gsap.to('.closing h2', { letterSpacing: '-.09em', scale: 1.05, ease: 'none', scrollTrigger: { trigger: '.closing', start: 'top bottom', end: 'center center', scrub: 1 } })
    })
    ScrollTrigger.refresh()
    return () => context.revert()
  }, [loading, pathname])

  useEffect(() => {
    const node = cursor.current
    const label = cursorLabel.current
    if (!node || !label) return
    const x = gsap.quickTo(node, 'x', { duration: .45, ease: 'power3' })
    const y = gsap.quickTo(node, 'y', { duration: .45, ease: 'power3' })
    const move = (event: MouseEvent) => { x(event.clientX); y(event.clientY) }
    const enter = (event: Event) => { const target = event.currentTarget as HTMLElement; node.classList.add('is-active'); label.textContent = target.dataset.cursor || 'OPEN' }
    const leave = () => node.classList.remove('is-active')
    window.addEventListener('mousemove', move)
    const targets = document.querySelectorAll<HTMLElement>('a,.rail-project,.article-grid>a')
    targets.forEach(target => { target.addEventListener('mouseenter', enter); target.addEventListener('mouseleave', leave) })
    return () => { window.removeEventListener('mousemove', move); targets.forEach(target => { target.removeEventListener('mouseenter', enter); target.removeEventListener('mouseleave', leave) }) }
  }, [loading, pathname])

  return <>
    <div className={`loader ${loading ? '' : 'loader--done'}`} aria-hidden="true"><div className="loader__brand">FERTECH®</div><div className="loader__count">{String(progress).padStart(3, '0')}</div><div className="loader__line"><i style={{ transform: `scaleX(${progress / 100})` }} /></div></div>
    <AmbientCanvas />
    <div className="grain" aria-hidden="true" />
    <div ref={cursor} className="cursor" aria-hidden="true"><span ref={cursorLabel}>OPEN</span></div>
    <div className={loading ? 'experience experience--loading' : 'experience'}>{children}</div>
  </>
}
