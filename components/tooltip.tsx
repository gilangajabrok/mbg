'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, ReactNode } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: '-top-10 left-1/2 -translate-x-1/2',
    bottom: 'top-10 left-1/2 -translate-x-1/2',
    left: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full',
    right: 'right-0 top-1/2 -translate-y-1/2 translate-x-full',
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${positionClasses[side]} px-2 py-1 bg-foreground text-background text-xs font-medium rounded whitespace-nowrap pointer-events-none z-50`}
          >
            {content}
            {side === 'top' && (
              <motion.div
                className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
