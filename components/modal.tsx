'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'
import { X } from 'lucide-react'
import { useSound } from '@/hooks/use-sound'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const { play } = useSound()

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }

  const handleClose = () => {
    play('tap')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className={`${sizeClasses[size]} bg-background border border-white/10 rounded-lg shadow-xl pointer-events-auto`}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground/60" />
                </button>
              </div>
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
