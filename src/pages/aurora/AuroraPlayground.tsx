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
  AimGameExperiment,
  ReflexGameExperiment,
  OrbitDodgeExperiment,
  PulseGridExperiment,
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
    <article className="overflow-hidden rounded-[2rem] border border-rose-900/12 bg-white/80 text-foreground shadow-sm shadow-rose-950/5 dark:border-white/12 dark:bg-white/[0.04] dark:text-white dark:shadow-none">
      <div className="p-6 md:p-8">
        <p className={`text-xs uppercase tracking-[0.28em] ${accent}`}>{copy.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-bold">{copy.title}</h2>
        <p className="mt-3 text-muted-foreground dark:text-white/60">{copy.description}</p>
      </div>
      <div className="h-[32rem] border-t border-border/70 dark:border-white/10">{children}</div>
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
  const experiments = copy.experiments
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
    <div className="bg-background px-4 pb-24 pt-10 text-foreground dark:bg-[#020003] dark:text-white md:pt-32">
      <header className="mx-auto mb-14 max-w-6xl">
        <p className="text-sm uppercase tracking-[0.32em] text-primary dark:text-rose-500">{copy.eyebrow}</p>
        <h1 className="mt-4 text-5xl font-bold md:text-7xl">{copy.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground dark:text-white/70">
          {copy.description}
        </p>
      </header>

      <div className="mx-auto max-w-6xl space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-border bg-card/80 shadow-sm shadow-rose-950/5 dark:border-white/12 dark:bg-white/[0.04] dark:shadow-none">
        <div className="grid gap-0 border-b border-border/70 dark:border-white/10 lg:grid-cols-[1fr_14rem]">
          <div className="min-w-0 p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-primary dark:text-rose-400">{experiments[0].eyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">{experiments[0].title}</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground dark:text-white/60">{experiments[0].description}</p>
          </div>

        <aside
          data-playground-controls
          className="border-t border-border/70 bg-background/80 p-2.5 text-foreground backdrop-blur-xl dark:border-white/10 dark:bg-black/48 dark:text-white lg:border-l lg:border-t-0"
        >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-3.5 w-3.5 text-primary dark:text-rose-400" />
            <span className="text-xs font-semibold">{copy.controlsTitle}</span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => updateSettings({ paused: !settings.paused })}
              className="grid h-6 w-6 place-items-center border border-border text-foreground/80 transition hover:bg-accent hover:text-foreground dark:border-white/12 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
              title={settings.paused ? copy.resume : copy.pause}
              aria-label={settings.paused ? copy.resume : copy.pause}
            >
              {settings.paused ? <PlayIcon className="h-3.5 w-3.5" /> : <PauseIcon className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={randomize}
              className="grid h-6 w-6 place-items-center border border-border text-foreground/80 transition hover:bg-accent hover:text-foreground dark:border-white/12 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
              title={copy.randomize}
              aria-label={copy.randomize}
            >
              <ArrowPathIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setClearToken((current) => current + 1)}
              className="grid h-6 w-6 place-items-center border border-border text-foreground/80 transition hover:bg-accent hover:text-foreground dark:border-white/12 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
              title={copy.clear}
              aria-label={copy.clear}
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-1.5 flex gap-1">
          {modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => updateSettings({ mode: mode.id })}
              className={`flex-1 border px-1.5 py-0.5 text-[10px] transition ${
                settings.mode === mode.id
                  ? 'border-primary bg-primary text-primary-foreground dark:border-rose-500 dark:bg-rose-950 dark:text-white'
                  : 'border-border text-muted-foreground hover:bg-accent dark:border-white/12 dark:text-white/62 dark:hover:bg-white/8'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="mt-1.5 rounded-lg border border-border bg-muted/40 p-1.5 dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex flex-wrap gap-1">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => updateSettings({ color })}
              className={`h-4 w-4 border transition hover:scale-110 ${
                settings.color === color ? 'border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              title={`${copy.controlsTitle}: ${color}`}
              aria-label={`${copy.controlsTitle}: ${color}`}
            />
          ))}
        </div>
        </div>

        <div className="mt-1.5 grid gap-1">
          <label className="text-[10px] leading-none text-muted-foreground dark:text-white/64">
            {copy.brush}
            <input
              type="range"
              min="1"
              max="8"
              value={settings.brushSize}
              onChange={(event) => updateSettings({ brushSize: Number(event.target.value) })}
              className="h-3 w-full accent-rose-500"
            />
          </label>
          <label className="text-[10px] leading-none text-muted-foreground dark:text-white/64">
            {copy.elements}
            <input
              type="range"
              min="25"
              max="160"
              value={settings.density}
              onChange={(event) => updateSettings({ density: Number(event.target.value) })}
              className="h-3 w-full accent-rose-500"
            />
          </label>
          <label className="text-[10px] leading-none text-muted-foreground dark:text-white/64">
            {copy.speed}
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={settings.speed}
              onChange={(event) => updateSettings({ speed: Number(event.target.value) })}
              className="h-3 w-full accent-rose-500"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => updateSettings({ drawing: !settings.drawing })}
          className={`mt-1.5 flex w-full items-center justify-center gap-1.5 border px-2 py-1 text-[11px] font-semibold transition ${
            settings.drawing
              ? 'border-primary bg-primary text-primary-foreground dark:border-rose-500 dark:bg-rose-950 dark:text-white'
              : 'border-border text-muted-foreground hover:bg-accent dark:border-white/12 dark:text-white/64 dark:hover:bg-white/8'
          }`}
        >
          <CursorArrowRaysIcon className="h-3.5 w-3.5" />
          {settings.drawing ? copy.drawingEnabled : copy.enableDrawing}
        </button>
        </aside>
        </div>
        <div className="h-[70svh] min-h-[560px] overflow-hidden">
          <WebGLPlayground settings={settings} clearToken={clearToken} />
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        <ExperimentCard copy={experiments[6]} accent="text-rose-300">
          <AimGameExperiment />
        </ExperimentCard>
        <ExperimentCard copy={experiments[7]} accent="text-cyan-300">
          <ReflexGameExperiment />
        </ExperimentCard>
        <ExperimentCard copy={experiments[8]} accent="text-violet-300">
          <OrbitDodgeExperiment />
        </ExperimentCard>
        <ExperimentCard copy={experiments[1]} accent="text-rose-400">
          <SignalSculptureExperiment />
        </ExperimentCard>
        <ExperimentCard copy={experiments[2]} accent="text-violet-400">
          <PulseGridExperiment />
        </ExperimentCard>
        <ExperimentCard copy={experiments[3]} accent="text-cyan-300">
          <LandingHeroExperiment />
        </ExperimentCard>
        <ExperimentCard copy={experiments[4]} accent="text-cyan-300">
          <ParticleTunnelExperiment />
        </ExperimentCard>
        <ExperimentCard copy={experiments[5]} accent="text-violet-300">
          <TerrainWaveExperiment />
        </ExperimentCard>
      </section>
      </div>
    </div>
    </AuroraPageReveal>
  )
}
