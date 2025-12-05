'use client'

import { motion } from 'framer-motion'
import { dummySupplierInventory } from '@/lib/mbg-dummy-data'
import { AlertTriangle, Download, Plus } from 'lucide-react'
import { useMBGSound } from '@/hooks/use-mbg-sound'

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function InventoryPage() {
  const { playSound } = useMBGSound()

  const lowStockItems = dummySupplierInventory.filter(item => item.stock < item.reorderLevel * 1.5)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Inventory Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Track stock levels and manage supplies</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => playSound('success')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg"
        >
          <Download className="w-5 h-5" />
          Import CSV
        </motion.button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 dark:border-yellow-500/20 rounded-xl p-4 flex items-start gap-4"
        >
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-400">{lowStockItems.length} Items Low in Stock</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">These items are approaching their reorder level. Consider restocking soon.</p>
          </div>
        </motion.div>
      )}

      {/* Inventory Table */}
      <div className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 dark:border-slate-700/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Stock Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Reorder Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Last Restocked</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 dark:divide-slate-700/10">
              {dummySupplierInventory.map((item, idx) => {
                const isLow = item.stock < item.reorderLevel * 1.5
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-white/50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{item.product}</td>
                    <td className="px-6 py-4">
                      <span className={cn('font-semibold', isLow ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400')}>
                        {item.stock} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.reorderLevel} {item.unit}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.lastRestocked}</td>
                    <td className="px-6 py-4">
                      <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', isLow ? 'bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-green-500/20 text-green-700 dark:text-green-400')}>
                        {isLow ? 'Low Stock' : 'Adequate'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => playSound('click')}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 dark:text-blue-400 text-sm font-semibold transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Restock
                      </button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
