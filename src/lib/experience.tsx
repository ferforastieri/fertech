import { createContext, useContext } from 'react'

export type ExperienceMode = 'classic' | 'aurora'

export const EXPERIENCE_STORAGE_KEY = 'fertech-experience-mode'

type ExperienceContextValue = {
  mode: ExperienceMode
  basePath: string
}

const ExperienceContext = createContext<ExperienceContextValue>({
  mode: 'classic',
  basePath: '',
})

export function ExperienceProvider({
  mode,
  children,
}: {
  mode: ExperienceMode
  children: React.ReactNode
}) {
  return (
    <ExperienceContext.Provider value={{ mode, basePath: mode === 'classic' ? '/classic' : '/aurora' }}>
      {children}
    </ExperienceContext.Provider>
  )
}

export function useExperiencePath() {
  const { basePath } = useContext(ExperienceContext)

  return (path: string) => {
    if (/^https?:\/\//.test(path)) {
      return path
    }

    if (path === '/') {
      return basePath || '/'
    }

    return `${basePath}${path}`
  }
}

export function saveExperienceMode(mode: ExperienceMode) {
  localStorage.setItem(EXPERIENCE_STORAGE_KEY, mode)
}
