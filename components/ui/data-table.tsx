'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: keyof T
  label: string
  render?: (value: any) => React.ReactNode
}

interface DataTableProps<T extends { id: string | number }> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(0)
  const itemsPerPage = 10

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data
    
    return [...data].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  const paginatedData = sortedData.slice(page * itemsPerPage, (page + 1) * itemsPerPage)
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(col.key)}
                  className="px-6 py-3 text-left text-sm font-semibold text-foreground cursor-pointer hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {sortKey === col.key && (
                      <motion.div initial={{ rotate: 0 }} animate={{ rotate: sortDir === 'asc' ? 0 : 180 }}>
                        {sortDir === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </motion.div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence mode="wait">
              {paginatedData.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ backgroundColor: 'var(--muted)' }}
                  onClick={() => onRowClick?.(row)}
                  className={cn('transition-colors', onRowClick && 'cursor-pointer')}
                >
                  {columns.map(col => (
                    <td key={String(col.key)} className="px-6 py-4 text-sm text-foreground">
                      {col.render ? col.render(row[col.key]) : String(row[col.key])}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-2 hover:bg-muted rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="p-2 hover:bg-muted rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  )
}
