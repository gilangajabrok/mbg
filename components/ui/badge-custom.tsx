'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}

const variants = {
  default: 'bg-primary/10 text-primary border border-primary/20',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800',
  error: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  info: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
}

export function BadgeCustom({ children, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full font-medium',
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        variants[variant]
      )}
    >
      {children}
    </motion.span>
  )
}
