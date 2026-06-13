import { useEffect, useState } from 'react'

export function useStoredTheme() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)

    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
    localStorage.setItem('theme', shouldBeDark ? 'dark' : 'light')
  }, [])

  const toggleTheme = () => {
    setIsDark((current) => {
      const next = !current
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  return {
    theme: isDark ? ('dark' as const) : ('light' as const),
    isDark,
    toggleTheme,
  }
}
