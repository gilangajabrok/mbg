'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { StatsCard } from '@/components/ui/stats-card'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion-variants'

interface Stat {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon?: React.ReactNode
}

interface StatsGridProps {
  stats: Stat[]
  columns?: number
}

export function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`}
    >
      {stats.map((stat, idx) => (
        <motion.div key={idx} variants={staggerItemVariants}>
          <StatsCard {...stat} />
        </motion.div>
      ))}
    </motion.div>
  )
}
