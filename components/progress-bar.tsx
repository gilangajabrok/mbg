'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number // 0-100
  label?: string
  animated?: boolean
  color?: 'primary' | 'success' | 'warning' | 'error'
}

export function ProgressBar({ value, label, animated = true, color = 'primary' }: ProgressBarProps) {
  const colorClasses = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  }

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground/90">{label}</p>
          <p className="text-xs text-foreground/60">{value}%</p>
        </div>
      )}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={animated ? { width: 0 } : { width: `${value}%` }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${colorClasses[color]}`}
        />
      </div>
    </div>
  )
}
