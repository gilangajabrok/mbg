'use client'

import { motion } from 'framer-motion'
import { useSound } from '@/hooks/use-sound'
import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface DataTableProps {
  data: Array<{
    id: number
    name: string
    email: string
    status: string
  }>
}

export default function DataTable({ data }: DataTableProps) {
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'status'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const { play } = useSound()

  const handleSort = (column: 'name' | 'email' | 'status') => {
    play('tap')
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  return (
    <motion.div 
      className="overflow-x-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 dark:border-white/5">
            {(['Name', 'Email', 'Status'] as const).map((header, idx) => {
              const columnKey = header.toLowerCase() as 'name' | 'email' | 'status'
              const isActive = sortBy === columnKey
              return (
                <motion.th
                  key={header}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="px-4 py-3 text-left"
                >
                  <button
                    onClick={() => handleSort(columnKey)}
                    className="flex items-center gap-2 text-xs font-medium text-foreground/50 uppercase tracking-wide hover:text-foreground/70 transition-colors"
                  >
                    {header}
                    <motion.div animate={{ opacity: isActive ? 1 : 0.3 }}>
                      {sortOrder === 'asc' ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </motion.div>
                  </button>
                </motion.th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="border-b border-white/10 dark:border-white/5 hover:bg-white/5 dark:hover:bg-white/5 transition-colors group"
            >
              <td className="px-4 py-4 text-sm font-normal text-foreground/90">{row.name}</td>
              <td className="px-4 py-4 text-sm font-normal text-foreground/70">{row.email}</td>
              <td className="px-4 py-4 text-sm">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    row.status === 'Active'
                      ? 'bg-green-100/50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100/50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                  }`}
                >
                  {row.status}
                </motion.span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}
