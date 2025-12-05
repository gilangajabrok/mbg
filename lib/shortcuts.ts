// Keyboard shortcuts manager for enterprise UI
export const shortcuts = {
  'toggle-sidebar': 'Ctrl+B',
  'open-search': 'Ctrl+K',
  'next-page': 'Ctrl+N',
  'prev-page': 'Ctrl+P',
  'settings': 'Ctrl+,',
  'theme-toggle': 'Ctrl+Shift+T',
} as const

export function useKeyboardShortcuts(callbacks: Record<string, () => void>) {
  const handleKeyDown = (e: KeyboardEvent) => {
    const isMeta = e.ctrlKey || e.metaKey
    const isShift = e.shiftKey

    if (isMeta && e.key === 'b') {
      e.preventDefault()
      callbacks['toggle-sidebar']?.()
    } else if (isMeta && e.key === 'k') {
      e.preventDefault()
      callbacks['open-search']?.()
    } else if (isMeta && e.key === 'n') {
      e.preventDefault()
      callbacks['next-page']?.()
    } else if (isMeta && e.key === 'p') {
      e.preventDefault()
      callbacks['prev-page']?.()
    } else if (isMeta && e.key === ',') {
      e.preventDefault()
      callbacks['settings']?.()
    } else if (isMeta && isShift && e.key === 't') {
      e.preventDefault()
      callbacks['theme-toggle']?.()
    }
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [callbacks])
}

import React from 'react'
