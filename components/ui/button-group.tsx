'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ButtonGroupButton {
  id: string
  label: string
  icon?: React.ReactNode
}

interface ButtonGroupProps {
  buttons: ButtonGroupButton[]
  onSelect: (id: string) => void
  selected: string
}

// Main export
export function ButtonGroup({ buttons, onSelect, selected }: ButtonGroupProps) {
  return (
    <div className="inline-flex gap-1 p-1 bg-muted rounded-lg">
      {buttons.map(btn => (
        <motion.button
          key={btn.id}
          onClick={() => onSelect(btn.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2',
            selected === btn.id
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {btn.icon && <span className="flex-shrink-0">{btn.icon}</span>}
          {btn.label}
        </motion.button>
      ))}
    </div>
  )
}

// Utility exports for composition
export function ButtonGroupText({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>
}

export function ButtonGroupSeparator() {
  return <div className="w-px h-6 bg-border" />
}
