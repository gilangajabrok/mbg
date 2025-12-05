'use client'

import { motion } from 'framer-motion'
import { dummySupplierPerformance } from '@/lib/mbg-dummy-data'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { MBGChartPlaceholder } from '@/components/ui/mbg-chart-placeholder'

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function PerformancePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Performance Metrics</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Track your supplier performance and KPIs</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dummySupplierPerformance.map((metric, idx) => {
          const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Minus
          return (
            <motion.div
              key={metric.metric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Target: {metric.target}</p>
                  <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">{metric.metric}</h3>
                </div>
                <TrendIcon className={cn('w-5 h-5', metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : metric.trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400')} />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {metric.value}{metric.metric.includes('Rate') || metric.metric.includes('Performance') ? '%' : ''}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MBGChartPlaceholder title="Delivery Success Rate Trend" height="h-80" />
        <MBGChartPlaceholder title="Quality Score Over Time" height="h-80" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MBGChartPlaceholder title="On-Time Performance" height="h-64" />
        <MBGChartPlaceholder title="Customer Satisfaction" height="h-64" />
      </div>
    </motion.div>
  )
}
