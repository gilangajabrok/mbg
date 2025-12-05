'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { motionPresets } from '@/lib/animations'

interface StatGridItem {
  label: string
  value: string | number
  change?: { value: number; positive: boolean }
  icon?: ReactNode
}

interface StatsGridProps {
  items: StatGridItem[]
}

export function StatsGrid({ items }: StatsGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={motionPresets.staggerContainer}
      initial="initial"
      animate="animate"
    >
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          variants={motionPresets.pageEnter}
          className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground/50 uppercase tracking-wide mb-2">
                {item.label}
              </p>
              <p className="text-xl font-semibold text-foreground/90">{item.value}</p>
              {item.change && (
                <p className={`text-xs mt-2 font-medium ${
                  item.change.positive 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {item.change.positive ? '↑' : '↓'} {item.change.value}%
                </p>
              )}
            </div>
            {item.icon && (
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-foreground/40"
              >
                {item.icon}
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
