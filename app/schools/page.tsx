'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Eye, Edit2, Trash2 } from 'lucide-react'
import { dummySchools } from '@/lib/mbg-dummy-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SchoolsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredSchools = dummySchools.filter((school) => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || school.status === filterStatus
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Schools Management</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage and monitor all registered schools</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-slate-800/50"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20 text-slate-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <Button className="gap-2 bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4" />
          Add School
        </Button>
      </div>

      {/* Schools Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 dark:border-slate-700/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">School Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">District</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Students</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Last Audit</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map((school) => (
                <motion.tr
                  key={school.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  className="border-b border-white/10 dark:border-slate-700/10 hover:bg-white/50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{school.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{school.district}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{school.students}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      school.status === 'active'
                        ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                        : 'bg-red-500/20 text-red-700 dark:text-red-400'
                    }`}>
                      {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{school.lastAudit}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-600 dark:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
