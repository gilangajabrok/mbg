'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSound } from '@/hooks/use-sound'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const { play } = useSound()

  useEffect(() => {
    toasts.forEach(toast => {
      const duration = toast.duration || 4000
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, duration)
      return () => clearTimeout(timer)
    })
  }, [toasts, onRemove])

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <div className="fixed top-4 right-4 space-y-3 z-50 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto"
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-background border border-white/10 rounded-lg shadow-lg backdrop-blur-sm">
              {getIcon(toast.type)}
              <p className="text-sm text-foreground/90">{toast.message}</p>
              <button
                onClick={() => {
                  play('tap')
                  onRemove(toast.id)
                }}
                className="ml-2 text-foreground/50 hover:text-foreground/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
