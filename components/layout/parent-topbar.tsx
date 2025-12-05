'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSound } from '@/lib/sound-provider'
import { cn } from '@/lib/utils'
import { dummyParent } from '@/lib/data/parent-dummy-data'

export function ParentTopbar() {
  const { theme, setTheme } = useTheme()
  const { playSound } = useSound()
  const [searchFocus, setSearchFocus] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [language, setLanguage] = useState('EN')

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      className="sticky top-0 left-0 right-0 h-16 bg-gradient-to-r from-white/90 to-pink-50/50 dark:from-slate-900/90 dark:to-pink-950/20 backdrop-blur-xl border-b border-pink-100/20 dark:border-pink-900/20 px-6 flex items-center justify-between z-40"
    >
      {/* Search Bar */}
      <motion.div
        animate={{ width: searchFocus ? 320 : 240 }}
        className="relative flex-1 max-w-md"
      >
        <input
          type="text"
          placeholder="Search meals, announcements..."
          onFocus={() => {
            setSearchFocus(true)
            playSound('hover')
          }}
          onBlur={() => setSearchFocus(false)}
          className={cn(
            'w-full px-4 py-2 pl-10 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-pink-200/50 dark:border-pink-900/30',
            'placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white text-sm',
            'focus:outline-none focus:bg-white/80 dark:focus:bg-slate-800/80 focus:border-pink-400/50',
            'transition-all duration-200'
          )}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
      </motion.div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 ml-6">
        {/* Language Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setLanguage(language === 'EN' ? 'ID' : 'EN')
            playSound('hover')
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-sm"
        >
          <Globe className="w-4 h-4" />
          <span className="font-medium">{language}</span>
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setNotificationsOpen(!notificationsOpen)
              playSound('hover')
            }}
            className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 relative"
          >
            <Bell className="w-5 h-5" />
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"
            />
          </motion.button>
          
          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-pink-100/20 dark:border-pink-900/20 overflow-hidden"
              >
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto p-2">
                  <div className="p-3 hover:bg-pink-50/50 dark:hover:bg-pink-950/20 rounded-lg cursor-pointer">
                    <p className="text-sm font-medium">Lunch delivered to Emma</p>
                    <p className="text-xs text-muted-foreground mt-1">5 minutes ago</p>
                  </div>
                  <div className="p-3 hover:bg-pink-50/50 dark:hover:bg-pink-950/20 rounded-lg cursor-pointer">
                    <p className="text-sm font-medium">New announcement from school</p>
                    <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                  </div>
                  <div className="p-3 hover:bg-pink-50/50 dark:hover:bg-pink-950/20 rounded-lg cursor-pointer">
                    <p className="text-sm font-medium">Weekly nutrition report available</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark')
            playSound('hover')
          }}
          className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        {/* Profile Avatar & Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setProfileOpen(!profileOpen)
              playSound('hover')
            }}
            className="flex items-center gap-3 p-1 pr-4 rounded-full bg-gradient-to-r from-pink-500/10 to-pink-400/5 hover:from-pink-500/20 hover:to-pink-400/10 transition-all"
          >
            <img
              src={dummyParent.avatar || "/placeholder.svg"}
              alt={dummyParent.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="text-left hidden lg:block">
              <p className="text-sm font-medium text-foreground">{dummyParent.name}</p>
              <p className="text-xs text-muted-foreground">Parent</p>
            </div>
          </motion.button>
          
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-pink-100/20 dark:border-pink-900/20 overflow-hidden"
              >
                <div className="p-4 border-b border-border">
                  <p className="font-semibold">{dummyParent.name}</p>
                  <p className="text-xs text-muted-foreground">{dummyParent.email}</p>
                </div>
                <div className="p-2">
                  <button className="w-full text-left p-3 hover:bg-pink-50/50 dark:hover:bg-pink-950/20 rounded-lg text-sm">
                    Profile
                  </button>
                  <button className="w-full text-left p-3 hover:bg-pink-50/50 dark:hover:bg-pink-950/20 rounded-lg text-sm">
                    Preferences
                  </button>
                  <button className="w-full text-left p-3 hover:bg-pink-50/50 dark:hover:bg-pink-950/20 rounded-lg text-sm">
                    Help
                  </button>
                  <div className="border-t border-border my-2" />
                  <button className="w-full text-left p-3 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-sm text-red-600">
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}
