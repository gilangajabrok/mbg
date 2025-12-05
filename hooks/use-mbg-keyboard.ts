import { useEffect } from 'react'

export function useMBGKeyboard(onShortcut: (key: string) => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'b') {
          e.preventDefault()
          onShortcut('sidebar-toggle')
        } else if (e.key === 'k') {
          e.preventDefault()
          onShortcut('search-open')
        } else if (e.key === ',') {
          e.preventDefault()
          onShortcut('settings-open')
        }
      }
      if (e.key === 'Escape') {
        onShortcut('escape')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onShortcut])
}
