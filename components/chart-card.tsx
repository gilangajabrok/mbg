'use client'

import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { AnimatedCard } from '@/components/animated-card'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  action?: ReactNode
}

export function ChartCard({ title, subtitle, children, action }: ChartCardProps) {
  return (
    <AnimatedCard className="p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground/90">{title}</h3>
            {subtitle && (
              <p className="text-xs font-medium text-foreground/50 uppercase tracking-wide mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatedCard>
  )
}
