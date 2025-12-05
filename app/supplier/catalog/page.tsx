'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { dummySupplierProducts } from '@/lib/mbg-dummy-data'
import { Plus, Edit, Trash2, Image } from 'lucide-react'
import { useMBGSound } from '@/hooks/use-mbg-sound'

export default function SupplierCatalogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const { playSound } = useMBGSound()

  const categories = ['all', ...new Set(dummySupplierProducts.map(p => p.category))]

  const filteredProducts = dummySupplierProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Meal Supply Catalog</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your product inventory</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playSound('success')
            setShowAddModal(true)
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Search Products</label>
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => playSound('click')}
              className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              onClick={() => playSound('click')}
              className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 overflow-hidden hover:shadow-lg transition-all"
          >
            {/* Product Image */}
            <div className="w-full h-40 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white truncate">{product.name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{product.category}</p>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Price:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Rp {product.price.toLocaleString()}/{product.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Stock:</span>
                  <span className={product.stock < product.price / 1000 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                    {product.stock} {product.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Nutrition:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-xs">{product.nutrition}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-white/10 dark:border-slate-700/10">
                <button
                  onClick={() => playSound('click')}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 dark:text-blue-400 text-sm font-semibold transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => playSound('warning')}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-400 text-sm font-semibold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
