'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) {
      setThemeState(stored)
    }

    const updateResolvedTheme = () => {
      const current = stored || 'system'
      if (current === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setResolvedTheme(isDark ? 'dark' : 'light')
      } else {
        setResolvedTheme(current)
      }
    }

    updateResolvedTheme()
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateResolvedTheme)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)

    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', isDark)
      setResolvedTheme(isDark ? 'dark' : 'light')
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
      setResolvedTheme(newTheme)
    }
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
