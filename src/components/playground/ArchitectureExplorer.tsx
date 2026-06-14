import { useState } from 'react'
import { motion } from 'motion/react'
import {
  ChevronRightIcon,
  CircleStackIcon,
  CloudIcon,
  CodeBracketSquareIcon,
  DocumentTextIcon,
  FolderIcon,
  FolderOpenIcon,
  ServerStackIcon,
} from '@heroicons/react/24/outline'
import { ProjectArchitecture } from '@/api/projects/useProjectGroups'
import { SiteContent } from '@/api/site/useSiteContent'

function ArchitectureFolder({ folder, accent, index }: { folder: string; accent: string; index: number }) {
  const [isOpen, setIsOpen] = useState(index < 2)
  const parts = folder.split('/').filter(Boolean)
  const folderName = parts[0] ?? folder
  const children = parts.slice(1)
  const Icon = isOpen ? FolderOpenIcon : FolderIcon

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: 0.18 + index * 0.05 }}
      className="overflow-hidden border border-white/10 bg-white/[0.035]"
    >
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/[0.06]"
        aria-expanded={isOpen}
      >
        <ChevronRightIcon className={`h-4 w-4 shrink-0 text-white/35 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        <Icon className="h-5 w-5 shrink-0" style={{ color: accent }} />
        <span className="min-w-0 flex-1 break-all font-mono text-sm text-white/78">{folderName}</span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="space-y-2 border-t border-white/8 px-5 py-3">
          {(children.length ? children : ['index']).map((child, childIndex) => (
            <motion.div
              key={`${child}-${childIndex}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: childIndex * 0.04 }}
              className="flex items-center gap-2 pl-6 font-mono text-xs text-white/55"
            >
              <DocumentTextIcon className="h-4 w-4 shrink-0 text-white/28" />
              <span className="break-all">{child}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ArchitectureExplorer({ architecture: selected, copy }: { architecture: ProjectArchitecture; copy: SiteContent['architecture'] }) {
  const layerMeta = [
    { key: 'clients' as const, title: copy.layerTitles[0], icon: CodeBracketSquareIcon },
    { key: 'services' as const, title: copy.layerTitles[1], icon: ServerStackIcon },
    { key: 'platform' as const, title: copy.layerTitles[2], icon: CloudIcon },
  ]
  return (
    <section className="relative border-t border-white/10 bg-[#050106] px-4 pb-24 pt-16 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-rose-400">{copy.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-bold md:text-6xl">{copy.title}</h2>
          <p className="mt-5 text-lg leading-8 text-white/62">
            {copy.description}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
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
                {copy.flowLabel}
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
                <h4 className="text-xl font-bold">{copy.foldersTitle}</h4>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {selected.folders.map((folder, index) => (
                  <ArchitectureFolder key={folder} folder={folder} accent={selected.accent} index={index} />
                ))}
              </div>
            </div>
        </motion.div>
      </div>
    </section>
  )
}
