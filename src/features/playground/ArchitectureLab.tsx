import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowRightIcon,
  ChevronRightIcon,
  CircleStackIcon,
  CodeBracketIcon,
  CubeTransparentIcon,
  DocumentTextIcon,
  FolderIcon,
  FolderOpenIcon,
  ServerStackIcon,
} from '@heroicons/react/24/outline'
import { PlaygroundPattern, PlaygroundTreeNode, SiteContent } from '@/api/site/useSiteContent'

function TreeNode({ node, depth = 0 }: { node: PlaygroundTreeNode; depth?: number }) {
  const [isOpen, setIsOpen] = useState(depth === 0)
  const hasChildren = Boolean(node.children?.length)
  const Icon = hasChildren ? (isOpen ? FolderOpenIcon : FolderIcon) : DocumentTextIcon

  return (
    <div>
      <motion.button
        type="button"
        onClick={() => hasChildren && setIsOpen((value) => !value)}
        whileHover={{ x: 4 }}
        className="group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.06]"
        style={{ paddingLeft: `${depth * 1.25 + 0.75}rem` }}
        aria-expanded={hasChildren ? isOpen : undefined}
      >
        <ChevronRightIcon
          className={`mt-1 h-4 w-4 shrink-0 text-white/35 transition-transform ${hasChildren && isOpen ? 'rotate-90' : ''} ${!hasChildren ? 'opacity-0' : ''}`}
        />
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${hasChildren ? 'text-rose-400' : 'text-violet-300'}`} />
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-sm font-semibold text-white">{node.name}</span>
          <span className="mt-1 block text-sm leading-5 text-white/48">{node.description}</span>
          {node.technologies && (
            <span className="mt-2 flex flex-wrap gap-1.5">
              {node.technologies.map((technology) => (
                <span key={technology} className="rounded-full border border-rose-400/20 bg-rose-400/5 px-2 py-0.5 text-[11px] text-rose-200">
                  {technology}
                </span>
              ))}
            </span>
          )}
        </span>
      </motion.button>

      <AnimatePresence initial={false}>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="relative">
              <motion.span
                className="absolute bottom-2 top-0 w-px bg-gradient-to-b from-rose-400/60 to-transparent"
                style={{ left: `${depth * 1.25 + 1.7}rem` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.35 }}
              />
              {node.children?.map((child) => <TreeNode key={child.name} node={child} depth={depth + 1} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ArchitectureLab({ copy }: { copy: SiteContent['playground'] }) {
  const architectureTree = copy.architecture.tree
  const patterns: PlaygroundPattern[] = copy.architecture.patterns
  const [selectedPatternId, setSelectedPatternId] = useState(patterns[0].id)
  const selectedPattern = patterns.find((pattern) => pattern.id === selectedPatternId) ?? patterns[0]

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/12 bg-[#050106]">
      <div className="border-b border-white/10 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">{copy.experiments[3].eyebrow}</p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">{copy.experiments[3].title}</h2>
        <p className="mt-3 max-w-3xl text-white/60">
          {copy.experiments[3].description}
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border-b border-white/10 p-4 md:p-6 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex items-center justify-between px-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/72">
              <CodeBracketIcon className="h-5 w-5 text-rose-400" />
              {copy.architecture.treeTitle}
            </span>
            <span className="font-mono text-xs text-white/30">{copy.architecture.rootLabel}</span>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/25 py-2">
            {architectureTree.map((node) => <TreeNode key={node.name} node={node} />)}
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/72">
            <CubeTransparentIcon className="h-5 w-5 text-violet-300" />
            {copy.architecture.patternsTitle}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {patterns.map((pattern) => (
              <button
                key={pattern.id}
                type="button"
                onClick={() => setSelectedPatternId(pattern.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  selectedPattern.id === pattern.id
                    ? 'border-violet-400/60 bg-violet-400/12 text-white'
                    : 'border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className="block text-[10px] uppercase tracking-[0.18em] text-violet-300/75">{pattern.category}</span>
                <span className="mt-1 block text-sm font-semibold">{pattern.name}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={selectedPattern.id}
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{ duration: 0.32 }}
              className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-400/30 bg-violet-400/10 text-violet-300">
                  <CircleStackIcon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-xl font-bold">{selectedPattern.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/52">{selectedPattern.description}</p>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-2">
                {selectedPattern.flow.map((step, index) => (
                  <div key={step} className="contents">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="rounded-lg border border-cyan-300/20 bg-cyan-300/5 px-3 py-2 font-mono text-xs text-cyan-100"
                    >
                      {step}
                    </motion.span>
                    {index < selectedPattern.flow.length - 1 && (
                      <motion.span
                        animate={{ x: [0, 4, 0], opacity: [0.35, 1, 0.35] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.16 }}
                      >
                        <ArrowRightIcon className="h-4 w-4 text-cyan-300" />
                      </motion.span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {selectedPattern.technologies.map((technology) => (
                  <span key={technology} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    {technology}
                  </span>
                ))}
              </div>
            </motion.article>
          </AnimatePresence>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/8 bg-black/20 p-4 text-sm text-white/45">
            <ServerStackIcon className="h-5 w-5 shrink-0 text-cyan-300" />
            {copy.architecture.footer}
          </div>
        </div>
      </div>
    </section>
  )
}
