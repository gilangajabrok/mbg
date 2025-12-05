'use client'

import { motion } from 'framer-motion'
import { mbgMotion } from '@/lib/mbg-motion'

interface MBGChartPlaceholderProps {
  title: string
  height?: string
}

export function MBGChartPlaceholder({ title, height = 'h-80' }: MBGChartPlaceholderProps) {
  return (
    <motion.div
      {...mbgMotion.panelReveal}
      className={`bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6 ${height}`}
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>
      <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-400/5 dark:to-blue-500/5 rounded-lg flex items-center justify-center">
        <p className="text-slate-400 dark:text-slate-500 text-sm">Chart placeholder</p>
      </div>
    </motion.div>
  )
}
