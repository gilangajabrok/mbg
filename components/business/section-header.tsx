'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between mb-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground text-sm mt-2">{subtitle}</p>
        )}
      </div>
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}
