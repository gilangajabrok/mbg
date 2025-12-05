'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { dummySupplierOrders } from '@/lib/mbg-dummy-data'
import { ChevronRight, MapPin, Package, Calendar } from 'lucide-react'
import { useMBGSound } from '@/hooks/use-mbg-sound'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  preparing: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  delivered: 'bg-green-500/20 text-green-700 dark:text-green-400',
  delayed: 'bg-red-500/20 text-red-700 dark:text-red-400',
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function SupplierOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { playSound } = useMBGSound()

  const filteredOrders = dummySupplierOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.school.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Orders</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage and track all meal orders</p>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Search Orders</label>
            <input
              type="text"
              placeholder="Search by order ID or school..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => playSound('click')}
              className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              onClick={() => playSound('click')}
              className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="delivered">Delivered</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order, idx) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => {
              playSound('click')
              setSelectedOrder(selectedOrder === order.id ? null : order.id)
            }}
            className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-4 hover:border-white/40 dark:hover:border-slate-700/40 cursor-pointer transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{order.id}</h3>
                  <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', STATUS_COLORS[order.status])}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>{order.school}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Package className="w-4 h-4" />
                    <span>{order.items} items</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{order.date}</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    <span>Quality: {order.quality}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className={cn('w-5 h-5 text-slate-400 transition-transform', selectedOrder === order.id && 'rotate-90')} />
            </div>

            {/* Expanded Detail */}
            {selectedOrder === order.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/10 dark:border-slate-700/10 space-y-3"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">Due Date</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{order.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">Contact Person</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{order.contact}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">Items Count</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{order.items} meals</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">Quality Score</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{order.quality}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => playSound('success')} className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-semibold transition-colors">
                    Mark Delivered
                  </button>
                  <button onClick={() => playSound('click')} className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-semibold transition-colors">
                    Upload Proof
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
