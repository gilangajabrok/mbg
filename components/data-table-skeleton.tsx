'use client'

import { motion } from 'framer-motion'

interface DataTableSkeletonProps {
  rows?: number
  columns?: number
}

export function DataTableSkeleton({ rows = 5, columns = 4 }: DataTableSkeletonProps) {
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-4">
                <motion.div
                  className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded w-20"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b border-white/10 hover:bg-white/5">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="px-6 py-4">
                  <motion.div
                    className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: (rowIdx * columns + colIdx) * 0.05 
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
