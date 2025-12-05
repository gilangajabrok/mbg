'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Package, CheckCircle, Truck, Calendar, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useMBGSound } from '@/hooks/use-mbg-sound'
import { useToast } from '@/lib/toast-provider'

interface ChildDelivery {
  childId: string
  childName: string
  item: string
  quantity: number
  unit: string
  status: 'pending' | 'in-transit' | 'delivered'
  deliveryDate: string
  deliveryProgress: number
  notes?: string
}

const mockChildDeliveries: ChildDelivery[] = [
  {
    childId: 'CHILD-001',
    childName: 'Emma Johnson',
    item: 'Organic Vegetables Mix',
    quantity: 1,
    unit: 'serving',
    status: 'delivered',
    deliveryDate: '2025-11-28',
    deliveryProgress: 100,
    notes: 'Delivered safely',
  },
  {
    childId: 'CHILD-002',
    childName: 'Liam Johnson',
    item: 'Low-Fat Milk & Bread',
    quantity: 2,
    unit: 'serving',
    status: 'in-transit',
    deliveryDate: '2025-11-29',
    deliveryProgress: 65,
    notes: 'Out for delivery',
  },
  {
    childId: 'CHILD-003',
    childName: 'Sophia Wang',
    item: 'Brown Rice & Chicken',
    quantity: 1.5,
    unit: 'serving',
    status: 'pending',
    deliveryDate: '2025-11-30',
    deliveryProgress: 0,
    notes: 'Preparing for delivery',
  },
  {
    childId: 'CHILD-004',
    childName: 'Noah Lee',
    item: 'Fresh Fruits & Yogurt',
    quantity: 1,
    unit: 'serving',
    status: 'delivered',
    deliveryDate: '2025-11-27',
    deliveryProgress: 100,
    notes: 'Received with thanks',
  },
  {
    childId: 'CHILD-005',
    childName: 'Olivia Martinez',
    item: 'Vegetables & Grains',
    quantity: 2,
    unit: 'serving',
    status: 'in-transit',
    deliveryDate: '2025-11-29',
    deliveryProgress: 45,
    notes: 'On route',
  },
]

const statusColors: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  pending: {
    bg: 'bg-amber-500/20 dark:bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-300',
    icon: <Calendar className="w-4 h-4" />,
    label: 'Pending',
  },
  'in-transit': {
    bg: 'bg-blue-500/20 dark:bg-blue-500/10',
    text: 'text-blue-700 dark:text-blue-300',
    icon: <Truck className="w-4 h-4" />,
    label: 'In Transit',
  },
  delivered: {
    bg: 'bg-green-500/20 dark:bg-green-500/10',
    text: 'text-green-700 dark:text-green-300',
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'Delivered',
  },
}

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

export default function ParentDeliveryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deliveries, setDeliveries] = useState<ChildDelivery[]>(mockChildDeliveries)
  const [selectedDelivery, setSelectedDelivery] = useState<ChildDelivery | null>(null)
  const { playSound } = useMBGSound()
  const { toast } = useToast()

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch =
      delivery.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.item.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const deliveryStats = {
    total: deliveries.length,
    delivered: deliveries.filter(d => d.status === 'delivered').length,
    inTransit: deliveries.filter(d => d.status === 'in-transit').length,
    pending: deliveries.filter(d => d.status === 'pending').length,
  }

  const getProgressLabel = (progress: number) => {
    if (progress === 0) return 'Preparing'
    if (progress < 50) return 'Packing'
    if (progress < 100) return 'Delivery in progress'
    return 'Delivered'
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
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Meal Deliveries
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track meal deliveries for your children
          </p>
        </div>
      </motion.div>

      {/* Delivery Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Deliveries',
            value: deliveryStats.total,
            color: 'from-slate-500 to-slate-600',
          },
          {
            label: 'Delivered',
            value: deliveryStats.delivered,
            color: 'from-green-500 to-emerald-500',
          },
          {
            label: 'In Transit',
            value: deliveryStats.inTransit,
            color: 'from-blue-500 to-cyan-500',
          },
          {
            label: 'Pending',
            value: deliveryStats.pending,
            color: 'from-amber-500 to-orange-500',
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 dark:bg-opacity-5 border border-white/20 dark:border-slate-700/20 backdrop-blur-sm`}
          >
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Search by Child or Item
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Enter child name or item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/20"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="in-transit">In Transit</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Sort By
            </label>
            <select className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Latest First</option>
              <option>Oldest First</option>
              <option>Status</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Delivery Cards */}
      <motion.div variants={itemVariants} className="space-y-4">
        {filteredDeliveries.length > 0 ? (
          filteredDeliveries.map((delivery, idx) => (
            <motion.div
              key={delivery.childId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedDelivery(delivery)}
              className="p-6 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all cursor-pointer"
            >
              <div className="space-y-4">
                {/* Child Name and Status */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{delivery.childName}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{delivery.item}</p>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${statusColors[delivery.status].bg} ${statusColors[delivery.status].text}`}>
                    {statusColors[delivery.status].icon}
                    {statusColors[delivery.status].label}
                  </div>
                </div>

                {/* Delivery Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 mb-1">Quantity</p>
                    <p className="font-medium text-slate-900 dark:text-white">{delivery.quantity} {delivery.unit}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 mb-1">Expected Date</p>
                    <p className="font-medium text-slate-900 dark:text-white">{delivery.deliveryDate}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 mb-1">Progress</p>
                    <p className="font-medium text-slate-900 dark:text-white">{delivery.deliveryProgress}%</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 mb-1">Status</p>
                    <p className="font-medium text-slate-900 dark:text-white">{getProgressLabel(delivery.deliveryProgress)}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Delivery Progress</span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{delivery.deliveryProgress}% complete</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${delivery.deliveryProgress}%` }}
                      transition={{ duration: 1, delay: idx * 0.05 }}
                      className={`h-full rounded-full transition-all ${
                        delivery.deliveryProgress === 100
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : delivery.deliveryProgress > 50
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
            <Package className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">No deliveries found</p>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      {selectedDelivery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDelivery(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full border border-white/20 dark:border-slate-700/20 overflow-hidden shadow-2xl"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{selectedDelivery.childName}</h2>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${statusColors[selectedDelivery.status].bg} ${statusColors[selectedDelivery.status].text}`}>
                  {statusColors[selectedDelivery.status].icon}
                  {statusColors[selectedDelivery.status].label}
                </div>
              </div>

              {/* Item */}
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Meal Item</p>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedDelivery.item}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Quantity</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{selectedDelivery.quantity} {selectedDelivery.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Expected Date</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{selectedDelivery.deliveryDate}</p>
                </div>
              </div>

              {/* Progress Section */}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Delivery Progress</p>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedDelivery.deliveryProgress}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full rounded-full ${
                        selectedDelivery.deliveryProgress === 100
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : selectedDelivery.deliveryProgress > 50
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-600 dark:text-slate-400">{getProgressLabel(selectedDelivery.deliveryProgress)}</p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{selectedDelivery.deliveryProgress}%</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedDelivery.notes && (
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Delivery Notes</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedDelivery.notes}</p>
                </div>
              )}

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDelivery(null)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Results Info */}
      <motion.div variants={itemVariants} className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
        <p>Showing {filteredDeliveries.length} of {deliveries.length} deliveries</p>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </motion.div>
    </motion.div>
  )
}
