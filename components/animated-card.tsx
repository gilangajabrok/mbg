'use client'

import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/animations'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  animated?: boolean
}

export function AnimatedCard({ 
  children, 
  className = '', 
  animated = true 
}: AnimatedCardProps) {
  return (
    <motion.div
      {...(animated ? motionPresets.cardHover : {})}
    >
      <Card className={className}>
        {children}
      </Card>
    </motion.div>
  )
}
