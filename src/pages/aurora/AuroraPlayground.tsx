import { useState } from 'react'
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
import { ArchitectureExplorer } from '@/features/playground/ArchitectureExplorer'

const colors = ['#ff315f', '#ff8a00', '#ffe600', '#32f5a5', '#22d3ee', '#7c5cff', '#ff4fd8']

const modes: { id: PlaygroundMode; label: string }[] = [
  { id: 'orbit', label: 'Órbita' },
  { id: 'wave', label: 'Ondas' },
  { id: 'chaos', label: 'Caos' },
]

const initialSettings: PlaygroundSettings = {
  color: colors[0],
  brushSize: 3,
  density: 90,
  speed: 1,
  mode: 'orbit',
  drawing: true,
  paused: false,
}

export default function AuroraPlayground() {
  const [settings, setSettings] = useState(initialSettings)
  const [clearToken, setClearToken] = useState(0)

  const updateSettings = (next: Partial<PlaygroundSettings>) => {
    setSettings((current) => ({ ...current, ...next }))
  }

  const randomize = () => {
    updateSettings({
      color: colors[Math.floor(Math.random() * colors.length)],
      mode: modes[Math.floor(Math.random() * modes.length)].id,
      density: 45 + Math.floor(Math.random() * 110),
      speed: Number((0.45 + Math.random() * 1.8).toFixed(2)),
    })
  }

  return (
    <div className="bg-[#020003]">
      <section className="relative h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          <WebGLPlayground settings={settings} clearToken={clearToken} />
        </div>

        <header className="pointer-events-none absolute left-4 right-4 top-20 z-10 md:left-8 md:top-24">
          <p className="text-sm uppercase tracking-[0.28em] text-rose-400">Laboratório WebGL</p>
          <h1 className="mt-2 text-4xl font-bold text-white md:text-6xl">Desenhe no espaço.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/64 md:text-base">
            Arraste sobre a cena, combine cores e transforme o movimento.
          </p>
        </header>

        <aside
          data-playground-controls
          className="absolute bottom-24 left-3 right-3 z-20 border border-white/14 bg-black/78 p-4 text-white shadow-2xl backdrop-blur-xl md:bottom-8 md:left-8 md:right-auto md:w-[25rem]"
        >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-rose-400" />
            <span className="font-semibold">Controles</span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => updateSettings({ paused: !settings.paused })}
              className="grid h-9 w-9 place-items-center border border-white/12 text-white/80 transition hover:bg-white/10 hover:text-white"
              title={settings.paused ? 'Continuar animação' : 'Pausar animação'}
              aria-label={settings.paused ? 'Continuar animação' : 'Pausar animação'}
            >
              {settings.paused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={randomize}
              className="grid h-9 w-9 place-items-center border border-white/12 text-white/80 transition hover:bg-white/10 hover:text-white"
              title="Criar combinação aleatória"
              aria-label="Criar combinação aleatória"
            >
              <ArrowPathIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setClearToken((current) => current + 1)}
              className="grid h-9 w-9 place-items-center border border-white/12 text-white/80 transition hover:bg-white/10 hover:text-white"
              title="Limpar desenho"
              aria-label="Limpar desenho"
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
            Pincel
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
            Elementos
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
            Velocidade
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
          {settings.drawing ? 'Desenho ativado' : 'Ativar desenho'}
        </button>
        </aside>
      </section>

      <ArchitectureExplorer />
    </div>
  )
}
