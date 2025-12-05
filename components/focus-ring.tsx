'use client'

import { motion } from 'framer-motion'

interface FocusRingProps {
  children: React.ReactNode
  className?: string
}

export function FocusRing({ children, className = '' }: FocusRingProps) {
  return (
    <motion.div
      whileFocus={{ outline: '2px solid var(--ring)' }}
      className={`transition-all ${className}`}
      tabIndex={0}
    >
      {children}
    </motion.div>
  )
}
