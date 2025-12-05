'use client'

import { motion } from 'framer-motion'

export function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full"
      />
    </motion.div>
  )
}
