'use client'

import { Card } from '@/components/ui/card'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useSound } from '@/hooks/use-sound'

interface CardStatProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: { value: number; label: string }
}

export default function CardStat({ title, value, icon, trend }: CardStatProps) {
  const { play } = useSound()

  return (
    <motion.div
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      onMouseEnter={() => play('tap')}
    >
      <Card className="p-6 shadow-sm border border-white/10 dark:border-white/5 hover:border-white/20 dark:hover:border-white/10 transition-colors">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start justify-between gap-4"
        >
          <div className="flex-1 space-y-3">
            {/* Label: small uppercase, reduced opacity */}
            <p className="text-xs font-medium text-foreground/50 uppercase tracking-wide">{title}</p>
            {/* Value: larger semibold, main focus */}
            <motion.p 
              className="text-3xl font-semibold text-foreground/90"
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {value}
            </motion.p>
            {/* Trend indicator */}
            {trend && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400"
              >
                <span>↑ {trend.value}%</span>
                <span className="text-foreground/50">{trend.label}</span>
              </motion.div>
            )}
          </div>
          {/* Icon: 20px, reduced opacity for subtle presence */}
          {icon && (
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-white/2 flex items-center justify-center text-foreground/60 flex-shrink-0 border border-white/10"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: Math.random() }}
            >
              {icon}
            </motion.div>
          )}
        </motion.div>
      </Card>
    </motion.div>
  )
}
