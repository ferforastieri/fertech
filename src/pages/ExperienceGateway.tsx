import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline'
import AuroraScene from '@/components/aurora/AuroraScene'
import { EXPERIENCE_STORAGE_KEY, ExperienceMode, saveExperienceMode } from '@/lib/experience'

const modes = [
  {
    id: 'classic' as const,
    name: 'Tradicional',
    description: 'O portfólio atual, direto, limpo e familiar.',
    href: '/classic',
  },
  {
    id: 'aurora' as const,
    name: 'Modo Imersivo',
    description: 'As mesmas informações em uma experiência imersiva com WebGL, scroll narrativo e navegação flutuante.',
    href: '/aurora',
  },
]

export default function ExperienceGateway() {
  const rootRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const savedMode = localStorage.getItem(EXPERIENCE_STORAGE_KEY)
    if (savedMode === 'classic') {
      navigate('/classic', { replace: true })
      return
    }
    if (savedMode === 'aurora') {
      navigate('/aurora', { replace: true })
      return
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('.gateway-kicker', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 })
        gsap.fromTo('.gateway-title span', { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.08, ease: 'power4.out' })
        gsap.fromTo('.gateway-card', { opacity: 0, y: 40, rotateX: -18 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' })
      })
      return () => mm.revert()
    }, rootRef)

    return () => ctx.revert()
  }, [navigate])

  const chooseMode = (mode: ExperienceMode, href: string) => {
    saveExperienceMode(mode)
    navigate(href)
  }

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden bg-[#040001] px-4 py-8 text-white">
      <AuroraScene />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center">
        <div className="mb-10 max-w-3xl">
          <div className="gateway-kicker mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-rose-200 backdrop-blur">
            <SparklesIcon className="h-4 w-4" />
            Escolha como quer navegar
          </div>
          <h1 className="gateway-title overflow-hidden text-5xl font-bold leading-[0.95] text-white md:text-7xl">
            <span className="block">FerTech em</span>
            <span className="block text-rose-500">dois modos.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
            O conteúdo continua o mesmo. Você escolhe entre a leitura tradicional ou uma versão imersiva com movimento, profundidade e uma navegação mais cinematográfica.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => chooseMode(mode.id, mode.href)}
              className="gateway-card group min-h-[220px] rounded-[2rem] border border-white/12 bg-white/[0.08] p-7 text-left shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-rose-700/60 hover:bg-white/[0.12]"
            >
              <span className="mb-10 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/68">
                {mode.id === 'classic' ? 'Atual' : 'Novo'}
              </span>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white">{mode.name}</h2>
                  <p className="mt-3 max-w-md text-base leading-7 text-white/68">{mode.description}</p>
                </div>
                <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-rose-900 text-white transition group-hover:translate-x-1">
                  <ArrowRightIcon className="h-5 w-5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
