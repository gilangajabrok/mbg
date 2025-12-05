'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Download, Share2, Settings } from 'lucide-react'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion-variants'
import { useSound } from '@/lib/sound-provider'

interface QuickActionProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  variant?: 'default' | 'primary' | 'destructive'
}

const variantStyles = {
  default: 'bg-muted hover:bg-muted/80 text-foreground',
  primary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
  destructive: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
}

export function QuickActions() {
  const { playSound } = useSound()

  const actions: QuickActionProps[] = [
    { icon: <Plus size={20} />, label: 'Add New', onClick: () => {}, variant: 'primary' },
    { icon: <Download size={20} />, label: 'Export', onClick: () => {} },
    { icon: <Share2 size={20} />, label: 'Share', onClick: () => {} },
    { icon: <Settings size={20} />, label: 'Settings', onClick: () => {} },
  ]

  const handleAction = (action: QuickActionProps) => {
    playSound('click')
    action.onClick()
  }

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {actions.map((action, idx) => (
        <motion.button
          key={idx}
          variants={staggerItemVariants}
          onClick={() => handleAction(action)}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          className={`flex flex-col items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${variantStyles[action.variant || 'default']}`}
        >
          {action.icon}
          <span className="text-xs">{action.label}</span>
        </motion.button>
      ))}
    </motion.div>
  )
}
