'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mb-6 text-muted-foreground/40"
      >
        {icon}
      </motion.div>
      
      <h3 className="text-lg font-semibold text-foreground/90 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-foreground/60 mb-6 max-w-xs">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}
