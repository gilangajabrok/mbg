'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { User, Lock, HelpCircle, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useMBGSound } from '@/hooks/use-mbg-sound'
import Link from 'next/link'

export function SupplierProfileMenu() {
  const [open, setOpen] = useState(false)
  const { playSound } = useMBGSound()

  const handleLogout = () => {
    playSound('warning')
    // Would open logout modal
  }

  const menuItems = [
    { icon: User, label: 'Profile', href: '/supplier/profile', color: 'text-blue-600 dark:text-blue-400' },
    { icon: Lock, label: 'Security & 2FA', href: '/supplier/security', color: 'text-purple-600 dark:text-purple-400' },
    { icon: HelpCircle, label: 'Help & Support', href: '/supplier/support', color: 'text-green-600 dark:text-green-400' },
  ]

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playSound('click')
          setOpen(!open)
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          FV
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg border border-white/20 dark:border-slate-700/20 shadow-lg overflow-hidden z-50"
          >
            <div className="p-4 border-b border-white/10 dark:border-slate-700/10">
              <p className="font-semibold text-slate-900 dark:text-white text-sm">Fresh Valley Farm</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Supplier Account</p>
            </div>

            <div className="p-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      playSound('navOpen')
                      setOpen(false)
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors text-sm"
                  >
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className="p-2 border-t border-white/10 dark:border-slate-700/10">
              <motion.button
                whileHover={{ x: 4 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-sm text-red-600 dark:text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
