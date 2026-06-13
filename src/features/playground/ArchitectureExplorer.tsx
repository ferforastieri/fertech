import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  CircleStackIcon,
  CloudIcon,
  CodeBracketSquareIcon,
  FolderIcon,
  ServerStackIcon,
} from '@heroicons/react/24/outline'
import { projectArchitectures } from './architectureData'

const layerMeta = [
  { key: 'clients' as const, title: 'Experiências', icon: CodeBracketSquareIcon },
  { key: 'services' as const, title: 'Serviços', icon: ServerStackIcon },
  { key: 'platform' as const, title: 'Dados & Infra', icon: CloudIcon },
]

export function ArchitectureExplorer() {
  const [selectedId, setSelectedId] = useState(projectArchitectures[0].id)
  const selected = projectArchitectures.find((project) => project.id === selectedId) ?? projectArchitectures[0]

  return (
    <section className="relative bg-[#050106] px-4 pb-32 pt-24 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-rose-400">Arquiteturas reais</p>
          <h2 className="mt-4 text-4xl font-bold md:text-6xl">Sistemas que ajudei a construir.</h2>
          <p className="mt-5 text-lg leading-8 text-white/62">
            Uma leitura visual das camadas, tecnologias e organização dos projetos Smart.
          </p>
        </div>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-3">
          {projectArchitectures.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelectedId(project.id)}
              className={`shrink-0 border px-4 py-3 text-sm font-semibold transition ${
                selected.id === project.id
                  ? 'border-white/50 bg-white text-black'
                  : 'border-white/12 bg-white/[0.04] text-white/65 hover:border-white/30 hover:text-white'
              }`}
            >
              {project.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(10px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <div className="flex flex-col gap-3 border-b border-white/12 pb-7 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-3xl font-bold" style={{ color: selected.accent }}>
                  {selected.name}
                </h3>
                <p className="mt-3 max-w-4xl leading-7 text-white/62">{selected.summary}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm text-white/48">
                <CircleStackIcon className="h-5 w-5" />
                Fluxo vivo entre camadas
              </span>
            </div>

            <div className="relative mt-8 grid gap-8 lg:grid-cols-3">
              <div className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-8 hidden h-px overflow-hidden bg-white/10 lg:block">
                <motion.span
                  className="block h-full w-1/3"
                  style={{ background: `linear-gradient(90deg, transparent, ${selected.accent}, transparent)` }}
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              {layerMeta.map((layer, layerIndex) => {
                const Icon = layer.icon
                return (
                  <div key={layer.key} className="relative">
                    <div className="mb-5 flex items-center gap-3">
                      <span
                        className="grid h-10 w-10 place-items-center border"
                        style={{ borderColor: `${selected.accent}88`, color: selected.accent }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <span className="text-xs text-white/35">0{layerIndex + 1}</span>
                        <h4 className="font-semibold">{layer.title}</h4>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selected.layers[layer.key].map((node, nodeIndex) => (
                        <motion.article
                          key={node.name}
                          initial={{ opacity: 0, x: layerIndex === 0 ? -20 : layerIndex === 2 ? 20 : 0, scale: 0.97 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ delay: nodeIndex * 0.08 + layerIndex * 0.08, duration: 0.45 }}
                          className="relative overflow-hidden border border-white/12 bg-white/[0.045] p-5"
                        >
                          <motion.span
                            className="absolute left-0 top-0 h-full w-0.5"
                            style={{ backgroundColor: selected.accent }}
                            animate={{ opacity: [0.25, 1, 0.25] }}
                            transition={{ duration: 1.8 + nodeIndex * 0.3, repeat: Infinity }}
                          />
                          <h5 className="font-bold text-white">{node.name}</h5>
                          <p className="mt-2 text-sm leading-6 text-white/55">{node.description}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {node.technologies.map((technology) => (
                              <span
                                key={technology}
                                className="border px-2 py-1 text-xs"
                                style={{ borderColor: `${selected.accent}45`, color: selected.accent }}
                              >
                                {technology}
                              </span>
                            ))}
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-10 border-t border-white/12 pt-8">
              <div className="mb-5 flex items-center gap-3">
                <FolderIcon className="h-6 w-6" style={{ color: selected.accent }} />
                <h4 className="text-xl font-bold">Organização do código</h4>
              </div>
              <div className="grid gap-x-8 gap-y-3 font-mono text-sm md:grid-cols-2">
                {selected.folders.map((folder, index) => (
                  <motion.div
                    key={folder}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 + index * 0.07 }}
                    className="flex min-w-0 items-start gap-3 border-b border-white/8 pb-3 text-white/65"
                  >
                    <span style={{ color: selected.accent }}>├─</span>
                    <span className="break-all">{folder}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
