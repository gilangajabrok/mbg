'use client'

import { motion } from 'framer-motion'
import { dummySupplierSchedule } from '@/lib/mbg-dummy-data'
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'
import { useMBGSound } from '@/hooks/use-mbg-sound'

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  'in-transit': 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
  delayed: 'bg-red-500/20 text-red-700 dark:text-red-400',
  completed: 'bg-green-500/20 text-green-700 dark:text-green-400',
}

const STATUS_ICONS: Record<string, any> = {
  scheduled: Calendar,
  'in-transit': TrendingUp,
  delayed: AlertCircle,
  completed: CheckCircle,
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DeliverySchedulesPage() {
  const { playSound } = useMBGSound()

  // Group by date
  const scheduleByDate = dummySupplierSchedule.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = []
    acc[item.date].push(item)
    return acc
  }, {} as Record<string, typeof dummySupplierSchedule>)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Delivery Schedules</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Track and manage your delivery routes</p>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.entries(scheduleByDate).map(([date, items], dateIdx) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dateIdx * 0.1 }}
          >
            {/* Date Header */}
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{new Date(date).toLocaleDateString('id-ID', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent dark:from-slate-700/20" />
            </div>

            {/* Delivery Items */}
            <div className="space-y-3">
              {items.map((delivery, idx) => {
                const StatusIcon = STATUS_ICONS[delivery.status]
                return (
                  <motion.div
                    key={delivery.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: dateIdx * 0.1 + idx * 0.05 }}
                    className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-4 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <StatusIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          <h4 className="font-semibold text-slate-900 dark:text-white">{delivery.school}</h4>
                          <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', STATUS_COLORS[delivery.status])}>
                            {delivery.status === 'in-transit' ? 'In Transit' : delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>{delivery.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <MapPin className="w-4 h-4" />
                            <span>{delivery.items} meals</span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => playSound('success')}
                        className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-semibold transition-colors"
                      >
                        {delivery.status === 'completed' ? 'View Proof' : 'Update Status'}
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
