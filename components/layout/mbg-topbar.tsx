'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Bell, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { mbgMotion } from '@/lib/mbg-motion'
import { useMBGSound } from '@/hooks/use-mbg-sound'
import { MBGProfileMenu } from '@/components/ui/mbg-profile-menu'
import { MBGNotificationPanel } from '@/components/ui/mbg-notification-panel'
import { useClickOutside } from '@/hooks/use-click-outside'
import { cn } from '@/lib/utils'

export function MBGTopbar() {
  const { theme, setTheme } = useTheme()
  const { playSound } = useMBGSound()
  const [searchFocus, setSearchFocus] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const notificationRef = useClickOutside(() => setNotificationsOpen(false))

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      className="fixed top-0 right-0 left-64 h-16 bg-gradient-to-r from-white/90 to-white/80 dark:from-slate-900/90 dark:to-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/20 px-6 flex items-center justify-between z-40"
    >
      {/* Search Bar */}
      <motion.div
        animate={{ width: searchFocus ? 320 : 240 }}
        className="relative flex-1 max-w-md"
      >
        <input
          type="text"
          placeholder="Search... (Ctrl+K)"
          onFocus={() => {
            setSearchFocus(true)
            playSound('buttonPress')
          }}
          onBlur={() => setSearchFocus(false)}
          className={cn(
            'w-full px-4 py-2 pl-10 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20',
            'placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white',
            'focus:outline-none focus:bg-white/80 dark:focus:bg-slate-800/80 focus:border-blue-500/50',
            'transition-all duration-200'
          )}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
      </motion.div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 ml-6">
        {/* Quick Create Button */}
        <motion.button
          {...mbgMotion.buttonPressDepress}
          onClick={() => playSound('buttonPress')}
          className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 transition-colors"
          title="Quick create (Ctrl++)"
        >
          <Plus className="w-5 h-5" />
        </motion.button>

        {/* Notifications */}
        <div ref={notificationRef} className="relative">
          <motion.button
            {...mbgMotion.buttonPressDepress}
            onClick={() => {
              setNotificationsOpen(!notificationsOpen)
              playSound('buttonPress')
            }}
            className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 relative"
          >
            <Bell className="w-5 h-5" />
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
            />
          </motion.button>
          <MBGNotificationPanel open={notificationsOpen} onOpenChange={setNotificationsOpen} />
        </div>

        {/* Theme Toggle */}
        <motion.button
          {...mbgMotion.buttonPressDepress}
          onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark')
            playSound('toggleChange')
          }}
          className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        {/* Profile Avatar & Menu */}
        <div className="relative">
          <motion.button
            {...mbgMotion.buttonPressDepress}
            onClick={() => {
              setProfileOpen(!profileOpen)
              playSound('buttonPress')
            }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm hover:shadow-lg transition-shadow"
          >
            A
          </motion.button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div className="absolute top-full right-0 mt-2 z-50">
                <MBGProfileMenu onClose={() => setProfileOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}
