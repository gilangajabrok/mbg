'use client'

import { motion } from 'framer-motion'

interface StatCardCompactProps {
  label: string
  value: string
  sublabel?: string
}

export function StatCardCompact({ label, value, sublabel }: StatCardCompactProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
    >
      <p className="text-xs font-medium text-foreground/50 uppercase tracking-wide mb-2">
        {label}
      </p>
      <div className="flex items-end justify-between gap-2">
        <p className="text-xl font-semibold text-foreground/90">{value}</p>
        {sublabel && (
          <p className="text-xs text-foreground/40">{sublabel}</p>
        )}
      </div>
    </motion.div>
  )
}
