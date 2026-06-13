export function AuroraLoading({ label = 'Carregando' }: { label?: string }) {
  return (
    <div className="mx-auto flex min-h-[58vh] max-w-6xl items-center justify-center px-4 pb-24 pt-10 text-[rgb(var(--aurora-text))] md:pt-32">
      <div className="relative h-72 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-[rgb(var(--aurora-border))] bg-[rgb(var(--aurora-panel))] p-6 shadow-2xl shadow-rose-950/35 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(159,18,57,0.28),transparent_28%),radial-gradient(circle_at_72%_62%,rgba(127,29,29,0.22),transparent_30%)]" />
        <div className="absolute left-8 top-8 h-28 w-20 animate-[pulse_1.2s_ease-in-out_infinite] rounded-xl border border-rose-500/45 bg-black/30 shadow-[0_0_34px_rgba(159,18,57,0.45)]">
          <span className="absolute left-3 top-4 h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_16px_rgba(251,113,133,0.85)]" />
          <span className="absolute left-3 top-9 h-2 w-2 rounded-full bg-rose-700" />
          <span className="absolute bottom-4 left-3 right-3 h-1 rounded-full bg-rose-500/45" />
        </div>
        <div className="absolute left-36 right-20 top-16 h-px overflow-hidden bg-rose-950/70">
          <span className="block h-full w-1/3 animate-[aurora-nav-flight_1.15s_linear_infinite] bg-gradient-to-r from-transparent via-rose-400 to-transparent" />
        </div>
        <div className="absolute bottom-12 right-14 h-12 w-20 animate-[aurora-float_1.4s_ease-in-out_infinite]">
          <div className="absolute left-1/2 top-1/2 h-5 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rose-300/70 bg-rose-950/70 shadow-[0_0_24px_rgba(251,113,133,0.75)]" />
          <div className="absolute left-1 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[12px] border-r-[28px] border-y-transparent border-r-rose-500" />
          <div className="absolute -right-8 top-1/2 h-1 w-10 -translate-y-1/2 animate-pulse rounded-full bg-rose-400 shadow-[0_0_16px_rgba(251,113,133,0.9)]" />
        </div>
        <div className="absolute inset-x-8 bottom-8">
          <p className="text-sm uppercase tracking-[0.32em] text-rose-500">{label}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/35">
            <span className="block h-full w-1/2 animate-[aurora-nav-flight_1s_linear_infinite] rounded-full bg-gradient-to-r from-rose-950 via-rose-500 to-rose-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
