'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Skeleton } from './skeleton'

export function CardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-xl border border-border"
    >
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-10 w-32 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </motion.div>
  )
}

export function TableSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 rounded-lg border border-border">
          <Skeleton className="h-4 w-12 flex-shrink-0" />
          <Skeleton className="h-4 w-48 flex-1" />
          <Skeleton className="h-4 w-32 flex-1" />
          <Skeleton className="h-4 w-24 flex-shrink-0" />
        </div>
      ))}
    </motion.div>
  )
}
