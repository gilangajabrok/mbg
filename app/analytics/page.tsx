'use client'

import { motion } from 'framer-motion'
import { mbgMotion } from '@/lib/mbg-motion'
import { MBGChartPlaceholder } from '@/components/ui/mbg-chart-placeholder'

const KEY_METRICS = [
  { label: 'Avg. Bounce Rate', value: '32.4%' },
  { label: 'Avg. Session Time', value: '3m 42s' },
  { label: 'Total Conversions', value: '1,284' },
  { label: 'Conversion Rate', value: '2.8%' },
]

export default function AnalyticsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Detailed insights and performance metrics</p>
      </motion.div>

      {/* Traffic Sources */}
      <motion.div variants={itemVariants}>
        <MBGChartPlaceholder title="Traffic Sources" height="h-80" />
      </motion.div>

      {/* Two Column Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants}>
          <MBGChartPlaceholder title="Conversion by Product" height="h-80" />
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6 h-80">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Key Metrics</h3>
            <div className="space-y-3">
              {KEY_METRICS.map((metric) => (
                <motion.div
                  key={metric.label}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/30 dark:bg-slate-700/30 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{metric.label}</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{metric.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
