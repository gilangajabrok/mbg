'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/lib/toast-provider'
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  }

  const colorMap = {
    success: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800',
    error: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
  }

  const textMap = {
    success: 'text-emerald-700 dark:text-emerald-300',
    error: 'text-red-700 dark:text-red-300',
    info: 'text-blue-700 dark:text-blue-300',
    warning: 'text-yellow-700 dark:text-yellow-300',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          const Icon = iconMap[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, x: 100 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 20, x: 100 }}
              className={cn(
                'pointer-events-auto rounded-lg border p-4 max-w-sm',
                colorMap[toast.type]
              )}
            >
              <div className="flex gap-3 items-start">
                <Icon size={20} className={textMap[toast.type]} />
                <div className="flex-1">
                  <p className={cn('font-medium text-sm', textMap[toast.type])}>
                    {toast.title}
                  </p>
                  {toast.description && (
                    <p className={cn('text-sm mt-1', textMap[toast.type])}>
                      {toast.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className={cn('text-lg', textMap[toast.type])}
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
