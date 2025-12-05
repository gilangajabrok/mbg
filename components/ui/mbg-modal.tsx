'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { mbgMotion } from '@/lib/mbg-motion'
import { ReactNode } from 'react'

interface MBGModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export function MBGModal({ open, onOpenChange, title, children, footer }: MBGModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            {...mbgMotion.modalPopSpring}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-slate-700/10">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
              <button
                onClick={() => onOpenChange(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="border-t border-white/10 dark:border-slate-700/10 p-6 bg-white/5 dark:bg-slate-900/5">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
