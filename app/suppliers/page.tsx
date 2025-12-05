'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Star, Check, Clock, Eye, Edit2, Trash2 } from 'lucide-react'
import { dummySuppliers } from '@/lib/mbg-dummy-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredSuppliers = dummySuppliers.filter((supplier) => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || supplier.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <Check className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Suppliers</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage and verify meal suppliers</p>
        </div>
        <Button className="gap-2 bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4" />
          Add Supplier
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/50 dark:bg-slate-800/50"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20"
        >
          <option value="all">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Suppliers Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredSuppliers.map((supplier) => (
          <motion.div
            key={supplier.id}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{supplier.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{supplier.category}</p>
              </div>
              {getStatusIcon(supplier.status)}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{supplier.score}/5.0</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{supplier.email}</p>
              <div className="text-sm">
                <span className="text-slate-600 dark:text-slate-400">Meals supplied: </span>
                <span className="font-semibold text-slate-900 dark:text-white">{supplier.mealsSupplied}</span>
              </div>
            </div>

            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
              supplier.status === 'verified'
                ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
            }`}>
              {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
            </span>

            <div className="flex gap-2 pt-4 border-t border-white/10 dark:border-slate-700/10">
              <button className="flex-1 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm">View</span>
              </button>
              <button className="flex-1 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
                <Edit2 className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
