'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, ReactNode } from 'react'
import { Search, X } from 'lucide-react'
import { useSound } from '@/hooks/use-sound'

export interface CommandItem {
  id: string
  label: string
  icon?: ReactNode
  action: () => void
  group?: string
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  items: CommandItem[]
}

export function CommandPalette({ isOpen, onClose, items }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const { play } = useSound()

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIdx(prev => (prev + 1) % filteredItems.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIdx(prev => (prev - 1 + filteredItems.length) % filteredItems.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        play('chime')
        filteredItems[selectedIdx]?.action()
        onClose()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, filteredItems, selectedIdx, onClose, play])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 flex items-start justify-center pt-20 z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-md bg-background border border-white/10 rounded-lg shadow-xl overflow-hidden pointer-events-auto"
            >
              <div className="p-3 border-b border-white/10 flex items-center gap-2">
                <Search className="w-4 h-4 text-foreground/50" />
                <input
                  autoFocus
                  placeholder="Type a command..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setSelectedIdx(0)
                  }}
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                />
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, idx) => (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        play('tap')
                        item.action()
                        onClose()
                      }}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                      className={`w-full px-3 py-2 flex items-center gap-3 text-left text-sm transition-colors ${
                        idx === selectedIdx
                          ? 'bg-white/10 text-foreground'
                          : 'text-foreground/70 hover:text-foreground'
                      }`}
                    >
                      {item.icon && <div className="text-foreground/50">{item.icon}</div>}
                      <span>{item.label}</span>
                    </motion.button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm text-foreground/50">No commands found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
