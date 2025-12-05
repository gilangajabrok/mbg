'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Upload, Eye, Edit2, Trash2 } from 'lucide-react'
import { dummyStudents } from '@/lib/mbg-dummy-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGrade, setFilterGrade] = useState('all')

  const filteredStudents = dummyStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrade = filterGrade === 'all' || student.grade.startsWith(filterGrade)
    return matchesSearch && matchesGrade
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Students Management</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage student profiles and meal eligibility</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-slate-800/50"
            />
          </div>
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20"
          >
            <option value="all">All Grades</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            <option value="4">Grade 4</option>
            <option value="5">Grade 5</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import CSV
          </Button>
          <Button className="gap-2 bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 dark:border-slate-700/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">School</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Grade</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Meals Received</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Allergies</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <motion.tr
                  key={student.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  className="border-b border-white/10 dark:border-slate-700/10 hover:bg-white/50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{student.school}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{student.grade}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      student.status === 'active'
                        ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                        : 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
                    }`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{student.mealsReceived}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{student.allergies}</td>
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
