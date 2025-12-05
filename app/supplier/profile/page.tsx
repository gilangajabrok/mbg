'use client'

import { motion } from 'framer-motion'
import { dummySupplierProfile } from '@/lib/mbg-dummy-data'
import { Mail, Phone, MapPin, Calendar, TrendingUp } from 'lucide-react'
import { useMBGSound } from '@/hooks/use-mbg-sound'

export default function SupplierProfilePage() {
  const { playSound } = useMBGSound()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Company Profile</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your company information</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => playSound('click')}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg"
        >
          Edit Profile
        </motion.button>
      </div>

      {/* Company Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-8"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{dummySupplierProfile.companyName}</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Active since {dummySupplierProfile.since}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-yellow-500">{dummySupplierProfile.rating}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Overall Rating</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-slate-700/30">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Email</p>
              <p className="font-semibold text-slate-900 dark:text-white">{dummySupplierProfile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-slate-700/30">
            <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Phone</p>
              <p className="font-semibold text-slate-900 dark:text-white">{dummySupplierProfile.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-slate-700/30 md:col-span-2">
            <MapPin className="w-5 h-5 text-red-600 dark:text-red-400 mt-1" />
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Address</p>
              <p className="font-semibold text-slate-900 dark:text-white">{dummySupplierProfile.address}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-6"
        >
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{dummySupplierProfile.totalOrders.toLocaleString()}</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">+12 this week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-6"
        >
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Deliveries</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{dummySupplierProfile.totalDeliveries.toLocaleString()}</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">+5 this week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-6"
        >
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Success Rate</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{dummySupplierProfile.successRate}%</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">+2.1% last month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-6"
        >
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Rating</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{dummySupplierProfile.rating}/5</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">⭐ Excellent</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
