'use client'

import { motion } from 'framer-motion'

interface SkeletonCardProps {
  count?: number
}

export function SkeletonCard({ count = 1 }: SkeletonCardProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg border border-white/10"
        >
          <div className="space-y-3">
            <motion.div
              className="h-4 bg-white/10 rounded w-1/3"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="h-8 bg-white/10 rounded w-2/3"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
            />
            <div className="space-y-2 pt-2">
              <motion.div
                className="h-3 bg-white/10 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="h-3 bg-white/10 rounded w-5/6"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
