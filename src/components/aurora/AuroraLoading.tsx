import { motion } from 'motion/react'

const orbitDots = Array.from({ length: 10 })
const scanLines = Array.from({ length: 5 })
const signalBars = Array.from({ length: 7 })

export function AuroraLoading({
  label,
  exiting = false,
}: {
  label: string
  exiting?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04, filter: 'blur(14px)' }}
      animate={exiting
        ? { opacity: 0, scale: 0.96, filter: 'blur(18px)' }
        : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: exiting ? 0.42 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-30 flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#040001]/88 px-4 py-20 text-white backdrop-blur-2xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(159,18,57,0.24),transparent_28%),radial-gradient(circle_at_78%_70%,rgba(190,18,60,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_34%,rgba(159,18,57,0.08))]" />
      <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:42px_42px]" />
      <motion.div
        aria-hidden="true"
        className="absolute h-[34rem] w-[34rem] rounded-full border border-rose-500/10 bg-rose-950/10 blur-sm"
        animate={{ rotate: 360, scale: [1, 1.04, 1] }}
        transition={{ rotate: { duration: 18, repeat: Infinity, ease: 'linear' }, scale: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' } }}
      />
      <motion.div
        initial={{ y: 24 }}
        animate={{ y: exiting ? -18 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl overflow-hidden rounded-[2.25rem] border border-white/10 bg-black/52 p-5 shadow-2xl shadow-rose-950/45 backdrop-blur-2xl sm:p-7"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(244,63,94,0.2),transparent_28%),radial-gradient(circle_at_80%_56%,rgba(127,29,29,0.24),transparent_30%)]" />
        <motion.span
          aria-hidden="true"
          className="absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-rose-400/10 to-transparent"
          animate={{ x: ['0%', '320%'] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative mx-auto grid h-64 w-64 place-items-center sm:h-72 sm:w-72">
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-rose-500/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute inset-6 rounded-full border border-dashed border-white/12"
              animate={{ rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute inset-12 rounded-full border border-rose-300/15"
              animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.9, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {orbitDots.map((_, index) => {
              const angle = (index / orbitDots.length) * Math.PI * 2
              const x = Math.cos(angle) * 126
              const y = Math.sin(angle) * 126

              return (
                <motion.span
                  key={index}
                  aria-hidden="true"
                  className="absolute h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.95)]"
                  style={{ x, y }}
                  animate={{ opacity: [0.25, 1, 0.25], scale: [0.7, 1.25, 0.7] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.12, ease: 'easeInOut' }}
                />
              )
            })}

            <motion.div
              className="relative grid h-28 w-28 place-items-center rounded-[2rem] border border-rose-400/30 bg-rose-950/30 shadow-[0_0_54px_rgba(159,18,57,0.55)] backdrop-blur"
              animate={{ y: [-4, 5, -4], rotate: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="absolute inset-3 rounded-[1.4rem] border border-white/10" />
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-300 via-rose-500 to-rose-950 shadow-[0_0_30px_rgba(251,113,133,0.8)]" />
              <motion.div
                aria-hidden="true"
                className="absolute -right-10 top-1/2 h-px w-20 bg-gradient-to-r from-rose-300 to-transparent"
                animate={{ opacity: [0.1, 0.9, 0.1], scaleX: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>

          <div className="relative">
            <div className="mb-7">
              <p className="text-sm uppercase tracking-[0.34em] text-rose-400">{label}</p>
              <div className="mt-4 h-px overflow-hidden rounded-full bg-white/10">
                <span className="block h-full w-1/2 animate-[aurora-nav-flight_1.15s_linear_infinite] bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
              </div>
            </div>

            <div className="space-y-3">
              {scanLines.map((_, index) => (
                <div key={index} className="grid grid-cols-[5rem_1fr] items-center gap-3">
                  <div className="h-2 overflow-hidden rounded-full bg-white/8">
                    <motion.span
                      className="block h-full rounded-full bg-rose-500/70"
                      animate={{ x: ['-100%', '120%'] }}
                      transition={{ duration: 1.2 + index * 0.12, repeat: Infinity, delay: index * 0.08, ease: 'easeInOut' }}
                    />
                  </div>
                  <div className="h-px overflow-hidden bg-white/10">
                    <motion.span
                      className="block h-full w-1/3 bg-gradient-to-r from-transparent via-rose-300 to-transparent"
                      animate={{ x: ['-120%', '320%'] }}
                      transition={{ duration: 1.55 + index * 0.1, repeat: Infinity, delay: index * 0.09, ease: 'linear' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-end gap-2">
              {signalBars.map((_, index) => (
                <motion.span
                  key={index}
                  aria-hidden="true"
                  className="w-full rounded-full bg-gradient-to-t from-rose-950 via-rose-600 to-rose-200 shadow-[0_0_14px_rgba(244,63,94,0.4)]"
                  style={{ height: 12 + index * 4 }}
                  animate={{ scaleY: [0.45, 1, 0.55], opacity: [0.35, 0.9, 0.45] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: index * 0.08, ease: 'easeInOut' }}
                />
              ))}
            </div>

            <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/8">
              <motion.span
                className="block h-full rounded-full bg-gradient-to-r from-rose-950 via-rose-500 to-rose-100"
                animate={{ x: ['-55%', '120%'] }}
                transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: '58%' }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
