'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Truck, TrendingUp, AlertCircle } from 'lucide-react'
import { MBGStatCard } from '@/components/ui/mbg-stat-card'
import { MBGChartPlaceholder } from '@/components/ui/mbg-chart-placeholder'
import { dummySupplierOrders, dummySupplierProfile, dummySupplierPerformance } from '@/lib/mbg-dummy-data'
import Link from 'next/link'

const SUPPLIER_STATS = [
  { 
    title: 'Active Orders', 
    value: '12', 
    change: '+3 today', 
    icon: <ShoppingCart className="w-6 h-6" />, 
    trend: 'up' as const 
  },
  { 
    title: 'Deliveries Today', 
    value: '5', 
    change: '2 completed', 
    icon: <Truck className="w-6 h-6" />, 
    trend: 'up' as const 
  },
  { 
    title: 'Success Rate', 
    value: '96.5%', 
    change: '+2.1%', 
    icon: <TrendingUp className="w-6 h-6" />, 
    trend: 'up' as const 
  },
  { 
    title: 'Quality Score', 
    value: '4.7/5', 
    change: '+0.2', 
    icon: <AlertCircle className="w-6 h-6" />, 
    trend: 'up' as const 
  },
]

const ALERTS = [
  { type: 'warning', message: '2 orders require immediate attention', action: 'Review' },
  { type: 'info', message: 'New school assignment available', action: 'View' },
  { type: 'error', message: '1 delivery delayed by 30 minutes', action: 'Contact' },
]

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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function SupplierDashboard() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Supplier Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Welcome back, Fresh Valley Farm</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {SUPPLIER_STATS.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <MBGStatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts & Alerts */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <MBGChartPlaceholder title="Weekly Meal Supply Volume" height="h-80" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">System Alerts</h3>
            <div className="space-y-3">
              {ALERTS.map((alert, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-slate-700/30 hover:bg-white/70 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', 
                    alert.type === 'error' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  )} />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{alert.message}</p>
                    <button className="text-xs text-green-600 dark:text-green-400 font-medium mt-1 hover:underline">
                      {alert.action}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Delivery Performance */}
      <motion.div variants={itemVariants}>
        <MBGChartPlaceholder title="Delivery Timeliness Trend" height="h-64" />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/supplier/catalog" className="p-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors">
              <h4 className="font-semibold text-slate-900 dark:text-white">Add Product</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Expand meal catalog</p>
            </Link>
            <Link href="/supplier/documents" className="p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
              <h4 className="font-semibold text-slate-900 dark:text-white">Upload Document</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Submit verification files</p>
            </Link>
            <Link href="/supplier/inventory" className="p-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
              <h4 className="font-semibold text-slate-900 dark:text-white">Update Inventory</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Check stock levels</p>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
