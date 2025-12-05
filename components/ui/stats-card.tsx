'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon?: React.ReactNode
}

export function StatsCard({ label, value, change, trend, icon }: StatsCardProps) {
  const trendColor = trend === 'up' ? 'text-emerald-600' : 'text-red-600'
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative p-6 rounded-xl bg-card border border-border overflow-hidden group"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          {icon && <div className="text-primary/40">{icon}</div>}
        </div>
        
        <p className="text-3xl font-bold text-foreground mb-3">{value}</p>
        
        <div className="flex items-center gap-2">
          <TrendIcon size={18} className={cn('flex-shrink-0', trendColor)} />
          <span className={cn('text-sm font-medium', trendColor)}>
            {change}
          </span>
          <span className="text-xs text-muted-foreground">this month</span>
        </div>
      </div>
    </motion.div>
  )
}
