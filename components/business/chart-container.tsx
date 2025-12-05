'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CardContainer } from '@/components/ui/card-container'

interface ChartContainerProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function ChartContainer({ title, subtitle, children }: ChartContainerProps) {
  return (
    <CardContainer interactive>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.div>
    </CardContainer>
  )
}
