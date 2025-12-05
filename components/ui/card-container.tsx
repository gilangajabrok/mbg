'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardContainerProps {
  children: React.ReactNode
  className?: string
  interactive?: boolean
}

export function CardContainer({ children, className, interactive = false }: CardContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={interactive ? { y: -4 } : undefined}
      className={cn(
        'rounded-xl bg-card border border-border p-6',
        'transition-shadow duration-200',
        interactive && 'cursor-pointer hover:shadow-lg',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
