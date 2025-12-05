'use client'

import { motion } from 'framer-motion'
import { Search, Bell, Globe, Moon, Sun, Settings } from 'lucide-react'
import { useState } from 'react'
import { SupplierProfileMenu } from '@/components/ui/supplier-profile-menu'
import { useMBGSound } from '@/hooks/use-mbg-sound'
import { useTheme } from 'next-themes'

export function SupplierTopbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { playSound } = useMBGSound()

  const toggleTheme = () => {
    playSound('click')
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      className="sticky top-0 left-0 right-0 h-16 bg-gradient-to-r from-white/90 to-white/80 dark:from-slate-900/90 dark:to-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/20 flex items-center justify-between px-6 z-40"
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders, products..."
            onClick={() => playSound('click')}
            className="w-full bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => playSound('click')}
          className="relative p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </motion.button>

        {/* Language Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => playSound('click')}
          className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
        >
          <Globe className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-slate-600" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </motion.button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/20 dark:bg-slate-700/20" />

        {/* Profile Menu */}
        <SupplierProfileMenu />
      </div>
    </motion.header>
  )
}
