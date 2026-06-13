import { useEffect, useRef, useState } from 'react'

type LoadingPhase = 'loading' | 'exiting' | 'done'

export function useAuroraLoadingTransition(isLoading: boolean) {
  const [phase, setPhase] = useState<LoadingPhase>(isLoading ? 'loading' : 'done')
  const wasLoading = useRef(isLoading)

  useEffect(() => {
    if (isLoading) {
      wasLoading.current = true
      setPhase('loading')
      return
    }

    if (!wasLoading.current) {
      setPhase('done')
      return
    }

    wasLoading.current = false
    setPhase('exiting')
    const timeout = window.setTimeout(() => setPhase('done'), 440)

    return () => window.clearTimeout(timeout)
  }, [isLoading])

  return {
    visible: phase !== 'done',
    exiting: phase === 'exiting',
  }
}
