'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock } from 'lucide-react'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion-variants'

interface ActivityItem {
  id: number
  user: string
  action: string
  timestamp: string
}

interface ActivityFeedProps {
  items: ActivityItem[]
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={staggerItemVariants}
            whileHover={{ x: 4 }}
            className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{item.user}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.action}</p>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground flex-shrink-0">
                <Clock size={14} />
                <span className="text-xs">{item.timestamp}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
