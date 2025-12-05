'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { mbgMotion } from '@/lib/mbg-motion'
import { useMBGSound } from '@/hooks/use-mbg-sound'

interface MBGLogoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MBGLogoutModal({ open, onOpenChange }: MBGLogoutModalProps) {
  const { playSound } = useMBGSound()

  const handleLogout = () => {
    playSound('success')
    // Simulate logout
    setTimeout(() => {
      onOpenChange(false)
    }, 300)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            {...mbgMotion.modalPopSpring}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-2xl p-6 z-50"
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Are you sure you want to log out?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              You will be redirected to the login page.
            </p>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playSound('buttonPress')
                  onOpenChange(false)
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors font-medium"
              >
                Cancel
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playSound('success')
                  handleLogout()
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors font-medium"
              >
                Logout
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
