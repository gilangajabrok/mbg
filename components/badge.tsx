'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  animated?: boolean
}

export function Badge({ children, variant = 'default', animated = false }: BadgeProps) {
  const variantClasses = {
    default: 'bg-muted text-foreground',
    success: 'bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    warning: 'bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    error: 'bg-red-100/50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    info: 'bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  }

  return (
    <motion.span
      whileHover={animated ? { scale: 1.05 } : {}}
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </motion.span>
  )
}
