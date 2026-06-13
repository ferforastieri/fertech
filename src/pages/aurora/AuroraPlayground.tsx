import { useEffect, useState } from 'react'
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
} from '@/features/playground/WebGLPlayground'
import {
  PulseGridExperiment,
  SignalSculptureExperiment,
} from '@/features/playground/WebGLExperiments'
import { AuroraPageReveal } from '@/components/aurora/AuroraPageReveal'
import { ArchitectureLab } from '@/features/playground/ArchitectureLab'
import { useSiteContent } from '@/api/site/useSiteContent'

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
        <div className="border-b border-white/10 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-rose-400">{copy.experiments[0].eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">{copy.experiments[0].title}</h2>
          <p className="mt-3 max-w-2xl text-white/60">{copy.experiments[0].description}</p>
        </div>
        <div className="relative h-[72svh] min-h-[620px] overflow-hidden">
        <div className="absolute inset-0">
          <WebGLPlayground settings={settings} clearToken={clearToken} />
        </div>

        <aside
          data-playground-controls
          className="absolute bottom-3 left-3 right-3 z-20 rounded-2xl border border-white/14 bg-black/78 p-4 text-white shadow-2xl backdrop-blur-xl md:bottom-6 md:left-6 md:right-auto md:w-[25rem]"
        >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-rose-400" />
            <span className="font-semibold">{copy.controlsTitle}</span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => updateSettings({ paused: !settings.paused })}
              className="grid h-9 w-9 place-items-center border border-white/12 text-white/80 transition hover:bg-white/10 hover:text-white"
              title={settings.paused ? copy.resume : copy.pause}
              aria-label={settings.paused ? copy.resume : copy.pause}
            >
              {settings.paused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={randomize}
              className="grid h-9 w-9 place-items-center border border-white/12 text-white/80 transition hover:bg-white/10 hover:text-white"
              title={copy.randomize}
              aria-label={copy.randomize}
            >
              <ArrowPathIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setClearToken((current) => current + 1)}
              className="grid h-9 w-9 place-items-center border border-white/12 text-white/80 transition hover:bg-white/10 hover:text-white"
              title={copy.clear}
              aria-label={copy.clear}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-1">
          {modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => updateSettings({ mode: mode.id })}
              className={`flex-1 border px-3 py-2 text-sm transition ${
                settings.mode === mode.id
                  ? 'border-rose-500 bg-rose-950 text-white'
                  : 'border-white/12 text-white/62 hover:bg-white/8'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => updateSettings({ color })}
              className={`h-7 w-7 border-2 transition hover:scale-110 ${
                settings.color === color ? 'border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              title={`Usar cor ${color}`}
              aria-label={`Usar cor ${color}`}
            />
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="text-xs text-white/64">
            {copy.brush}
            <input
              type="range"
              min="1"
              max="8"
              value={settings.brushSize}
              onChange={(event) => updateSettings({ brushSize: Number(event.target.value) })}
              className="mt-2 w-full accent-rose-500"
            />
          </label>
          <label className="text-xs text-white/64">
            {copy.elements}
            <input
              type="range"
              min="25"
              max="160"
              value={settings.density}
              onChange={(event) => updateSettings({ density: Number(event.target.value) })}
              className="mt-2 w-full accent-rose-500"
            />
          </label>
          <label className="text-xs text-white/64">
            {copy.speed}
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={settings.speed}
              onChange={(event) => updateSettings({ speed: Number(event.target.value) })}
              className="mt-2 w-full accent-rose-500"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => updateSettings({ drawing: !settings.drawing })}
          className={`mt-4 flex w-full items-center justify-center gap-2 border px-4 py-2 text-sm font-semibold transition ${
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
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        <article className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.04]">
          <div className="p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-rose-400">{copy.experiments[1].eyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold">{copy.experiments[1].title}</h2>
            <p className="mt-3 text-white/60">{copy.experiments[1].description}</p>
          </div>
          <div className="h-[32rem] border-t border-white/10"><SignalSculptureExperiment /></div>
        </article>

        <article className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.04]">
          <div className="p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-violet-400">{copy.experiments[2].eyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold">{copy.experiments[2].title}</h2>
            <p className="mt-3 text-white/60">{copy.experiments[2].description}</p>
          </div>
          <div className="h-[32rem] border-t border-white/10"><PulseGridExperiment /></div>
        </article>
      </section>

      <ArchitectureLab copy={copy} />
      </div>
    </div>
    </AuroraPageReveal>
  )
}
