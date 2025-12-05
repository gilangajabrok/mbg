'use client'

import { motion } from 'framer-motion'
import { Download, TrendingUp, Users, DollarSign, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MBGChartPlaceholder } from '@/components/ui/mbg-chart-placeholder'
import { dummyReports } from '@/lib/mbg-dummy-data'

export default function ReportsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">System-wide performance metrics and insights</p>
        </div>
        <Button className="gap-2 bg-blue-500 hover:bg-blue-600">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* KPI Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { icon: Users, label: 'Total Students', value: dummyReports.totalStudents, color: 'blue' },
          { icon: DollarSign, label: 'Avg Meal Cost', value: `₹${dummyReports.avgMealCost}`, color: 'green' },
          { icon: CheckCircle, label: 'Success Rate', value: `${dummyReports.successRate}%`, color: 'purple' },
          { icon: TrendingUp, label: 'Distribution Rate', value: `${dummyReports.distributionRate}%`, color: 'yellow' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{kpi.label}</h3>
                <div className={`p-2 rounded-lg ${
                  kpi.color === 'blue' ? 'bg-blue-500/20' :
                  kpi.color === 'green' ? 'bg-green-500/20' :
                  kpi.color === 'purple' ? 'bg-purple-500/20' :
                  'bg-yellow-500/20'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <MBGChartPlaceholder title="Monthly Distribution Trend" height="h-80" />
        <MBGChartPlaceholder title="Supplier Performance" height="h-80" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <MBGChartPlaceholder title="School-wise Distribution" height="h-80" />
      </motion.div>
    </motion.div>
  )
}
