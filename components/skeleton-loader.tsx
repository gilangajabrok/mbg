'use client'

import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/animations'

interface SkeletonLoaderProps {
  count?: number
  type?: 'card' | 'table' | 'chart'
  className?: string
}

export function SkeletonLoader({ 
  count = 1, 
  type = 'card',
  className = '' 
}: SkeletonLoaderProps) {
  const getSkeletonContent = () => {
    switch (type) {
      case 'card':
        return (
          <motion.div
            animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="space-y-4"
          >
            <div className="h-12 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse" />
            <div className="h-8 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse w-2/3" />
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded animate-pulse w-5/6" />
            </div>
          </motion.div>
        )
      case 'table':
        return (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                className="h-12 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {getSkeletonContent()}
        </div>
      ))}
    </div>
  )
}
