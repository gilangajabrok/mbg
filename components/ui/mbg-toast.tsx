'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { mbgMotion } from '@/lib/mbg-motion'

interface MBGToastProps {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  onClose: () => void
}

export function MBGToast({ id, type, title, message, onClose }: MBGToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  }

  return (
    <motion.div
      {...mbgMotion.toastSlideIn}
      className="bg-gradient-to-r from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-lg border border-white/20 dark:border-slate-700/20 shadow-xl p-4 flex gap-4 max-w-md"
    >
      {icons[type]}
      <div className="flex-1">
        <p className="font-semibold text-slate-900 dark:text-white text-sm">{title}</p>
        <p className="text-xs text-slate-600 dark:text-slate-300">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
