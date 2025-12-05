'use client'

import { motion } from 'framer-motion'
import { mbgMotion } from '@/lib/mbg-motion'
import { ReactNode } from 'react'

interface MBGStatCardProps {
  title: string
  value: string
  change: string
  icon: ReactNode
  trend?: 'up' | 'down'
}

export function MBGStatCard({ title, value, change, icon, trend }: MBGStatCardProps) {
  return (
    <motion.div
      {...mbgMotion.cardFloatHover}
      className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className="text-blue-500">{icon}</div>
      </div>
      <p className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </p>
    </motion.div>
  )
}
