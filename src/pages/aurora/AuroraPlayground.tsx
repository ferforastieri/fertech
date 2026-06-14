import { ReactNode, useEffect, useState } from 'react'
import {
  ArrowPathIcon,
  CursorArrowRaysIcon,
  PauseIcon,
  PlayIcon,
  SparklesIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import {
  PlaygroundMode,
  PlaygroundSettings,
  WebGLPlayground,
} from '@/components/playground/WebGLPlayground'
import {
  PulseGridExperiment,
  AimGameExperiment,
  LandingHeroExperiment,
  ParticleTunnelExperiment,
  SignalSculptureExperiment,
  TerrainWaveExperiment,
} from '@/components/playground/WebGLExperiments'
import { AuroraPageReveal } from '@/components/aurora/AuroraPageReveal'
import { useSiteContent } from '@/api/site/useSiteContent'

type ExperimentCopy = {
  eyebrow: string
  title: string
  description: string
}

const experimentFallbacks: ExperimentCopy[] = [
  {
    eyebrow: 'Interactive field',
    title: 'Canvas de partículas',
    description: 'Cena interativa com desenho, órbita, ondas e caos procedural.',
  },
  {
    eyebrow: 'Landing page',
    title: 'Composição prismática',
    description: 'Placas, partículas e núcleo abstrato em uma composição WebGL limpa.',
  },
  {
    eyebrow: 'Sculpture',
    title: 'Escultura de sinal',
    description: 'Forma orgânica com distorção, luz emissiva e rotação lenta para página editorial.',
  },
  {
    eyebrow: 'Data pulse',
    title: 'Grid de pulsos',
    description: 'Visualização generativa para dados, infra e sinais de produto.',
  },
  {
    eyebrow: 'Particles',
    title: 'Túnel de partículas',
    description: 'Partículas em profundidade com movimento contínuo, inspirado em shaders e experiências imersivas.',
  },
  {
    eyebrow: 'Terrain',
    title: 'Terreno procedural',
    description: 'Malha WebGL deformada em tempo real para simular superfície, água ou topografia.',
  },
  {
    eyebrow: 'Mini game',
    title: 'Aim trainer',
    description: 'Micro jogo clicável com alvos 3D, pontuação e reposicionamento procedural.',
  },
]

function getExperimentCopy(experiments: ExperimentCopy[], index: number) {
  return experiments[index] ?? experimentFallbacks[index] ?? experimentFallbacks[0]
}

function getFallbackExperimentCopy(index: number) {
  return experimentFallbacks[index] ?? experimentFallbacks[0]
}

function ExperimentCard({
  copy,
  accent = 'text-rose-400',
  children,
}: {
  copy: ExperimentCopy
  accent?: string
  children: ReactNode
}) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.04]">
      <div className="p-6 md:p-8">
        <p className={`text-xs uppercase tracking-[0.28em] ${accent}`}>{copy.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-bold">{copy.title}</h2>
        <p className="mt-3 text-white/60">{copy.description}</p>
      </div>
      <div className="h-[32rem] border-t border-white/10">{children}</div>
    </article>
  )
}

export default function AuroraPlayground() {
  const { data: siteContent } = useSiteContent()
  const [settings, setSettings] = useState<PlaygroundSettings | null>(null)
  const [clearToken, setClearToken] = useState(0)

  useEffect(() => {
    if (!siteContent || settings) return
    const copy = siteContent.playground
    setSettings({
      color: copy.colors[0],
      brushSize: 3,
      density: 90,
      speed: 1,
      mode: copy.modes[0].id,
      drawing: true,
      paused: false,
    })
  }, [settings, siteContent])

  const updateSettings = (next: Partial<PlaygroundSettings>) => {
    setSettings((current) => current ? ({ ...current, ...next }) : current)
  }

  if (!siteContent) return null
  const copy = siteContent.playground
  const colors = copy.colors
  const modes: { id: PlaygroundMode; label: string }[] = copy.modes
  if (!settings) return null

  const randomize = () => {
    updateSettings({
      color: colors[Math.floor(Math.random() * colors.length)],
      mode: modes[Math.floor(Math.random() * modes.length)].id,
      density: 45 + Math.floor(Math.random() * 110),
      speed: Number((0.45 + Math.random() * 1.8).toFixed(2)),
    })
  }

  return (
    <AuroraPageReveal>
    <div className="bg-[#020003] px-4 pb-24 pt-10 text-white md:pt-32">
      <header className="mx-auto mb-14 max-w-6xl">
        <p className="text-sm uppercase tracking-[0.32em] text-rose-500">{copy.eyebrow}</p>
        <h1 className="mt-4 text-5xl font-bold md:text-7xl">{copy.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
          {copy.description}
        </p>
      </header>

      <div className="mx-auto max-w-6xl space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.04]">
        <div className="grid gap-0 border-b border-white/10 lg:grid-cols-[1fr_18rem]">
          <div className="min-w-0 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-rose-400">{getExperimentCopy(copy.experiments, 0).eyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">{getExperimentCopy(copy.experiments, 0).title}</h2>
            <p className="mt-3 max-w-2xl text-white/60">{getExperimentCopy(copy.experiments, 0).description}</p>
          </div>

        <aside
          data-playground-controls
          className="border-t border-white/10 bg-black/48 p-3 text-white backdrop-blur-xl lg:border-l lg:border-t-0"
        >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-rose-400" />
            <span className="text-sm font-semibold">{copy.controlsTitle}</span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => updateSettings({ paused: !settings.paused })}
              className="grid h-7 w-7 place-items-center border border-white/12 text-white/80 transition hover:bg-white/10 hover:text-white"
              title={settings.paused ? copy.resume : copy.pause}
              aria-label={settings.paused ? copy.resume : copy.pause}
            >
              {settings.paused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={randomize}
              className="grid h-7 w-7 place-items-center border border-white/12 text-white/80 transition hover:bg-white/10 hover:text-white"
              title={copy.randomize}
              aria-label={copy.randomize}
            >
              <ArrowPathIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setClearToken((current) => current + 1)}
              className="grid h-7 w-7 place-items-center border border-white/12 text-white/80 transition hover:bg-white/10 hover:text-white"
              title={copy.clear}
              aria-label={copy.clear}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-2 flex gap-1">
          {modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => updateSettings({ mode: mode.id })}
              className={`flex-1 border px-2 py-1 text-[11px] transition ${
                settings.mode === mode.id
                  ? 'border-rose-500 bg-rose-950 text-white'
                  : 'border-white/12 text-white/62 hover:bg-white/8'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.04] p-2">
        <div className="flex flex-wrap gap-1">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => updateSettings({ color })}
              className={`h-5 w-5 border-2 transition hover:scale-110 ${
                settings.color === color ? 'border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              title={`Usar cor ${color}`}
              aria-label={`Usar cor ${color}`}
            />
          ))}
        </div>
        </div>

        <div className="mt-2 grid gap-1.5">
          <label className="text-[11px] text-white/64">
            {copy.brush}
            <input
              type="range"
              min="1"
              max="8"
              value={settings.brushSize}
              onChange={(event) => updateSettings({ brushSize: Number(event.target.value) })}
              className="mt-1 w-full accent-rose-500"
            />
          </label>
          <label className="text-[11px] text-white/64">
            {copy.elements}
            <input
              type="range"
              min="25"
              max="160"
              value={settings.density}
              onChange={(event) => updateSettings({ density: Number(event.target.value) })}
              className="mt-1 w-full accent-rose-500"
            />
          </label>
          <label className="text-[11px] text-white/64">
            {copy.speed}
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={settings.speed}
              onChange={(event) => updateSettings({ speed: Number(event.target.value) })}
              className="mt-1 w-full accent-rose-500"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => updateSettings({ drawing: !settings.drawing })}
          className={`mt-2 flex w-full items-center justify-center gap-2 border px-3 py-1.5 text-xs font-semibold transition ${
            settings.drawing
              ? 'border-rose-500 bg-rose-950 text-white'
              : 'border-white/12 text-white/64 hover:bg-white/8'
          }`}
        >
          <CursorArrowRaysIcon className="h-4 w-4" />
          {settings.drawing ? copy.drawingEnabled : copy.enableDrawing}
        </button>
        </aside>
        </div>
        <div className="h-[70svh] min-h-[560px] overflow-hidden">
          <WebGLPlayground settings={settings} clearToken={clearToken} />
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        <ExperimentCard copy={getExperimentCopy(copy.experiments, 1)} accent="text-rose-400">
          <SignalSculptureExperiment />
        </ExperimentCard>
        <ExperimentCard copy={getExperimentCopy(copy.experiments, 2)} accent="text-violet-400">
          <PulseGridExperiment />
        </ExperimentCard>
        <ExperimentCard copy={getFallbackExperimentCopy(1)} accent="text-cyan-300">
          <LandingHeroExperiment />
        </ExperimentCard>
        <ExperimentCard copy={getFallbackExperimentCopy(4)} accent="text-cyan-300">
          <ParticleTunnelExperiment />
        </ExperimentCard>
        <ExperimentCard copy={getFallbackExperimentCopy(5)} accent="text-violet-300">
          <TerrainWaveExperiment />
        </ExperimentCard>
        <ExperimentCard copy={getFallbackExperimentCopy(6)} accent="text-rose-300">
          <AimGameExperiment />
        </ExperimentCard>
      </section>
      </div>
    </div>
    </AuroraPageReveal>
  )
}
