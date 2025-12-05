'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Bell, Menu, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme-provider'
import { useSound } from '@/lib/sound-provider'
import { cn } from '@/lib/utils'

interface TopbarProps {
  onSidebarToggle: () => void
}

export function Topbar({ onSidebarToggle }: TopbarProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const { playSound } = useSound()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)

  const handleThemeToggle = () => {
    playSound('click')
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const handleSearch = () => {
    playSound('click')
    setSearchOpen(!searchOpen)
  }

  return (
    <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={onSidebarToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-muted rounded-lg transition-colors hidden md:flex"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} className="text-foreground" />
        </motion.button>

        {/* Search Bar */}
        <motion.div
          initial={{ width: 200 }}
          animate={{ width: searchOpen ? 300 : 200 }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Search (Ctrl+K)..."
            className={cn(
              "w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm",
              "focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            )}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </motion.div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <motion.div className="relative">
          <motion.button
            onClick={() => {
              playSound('click')
              setNotificationOpen(!notificationOpen)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-muted rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-foreground" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"
            />
          </motion.button>

          {/* Notification Dropdown */}
          {notificationOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
            >
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-sm">Notifications</h3>
              </div>
              <div className="divide-y divide-border max-h-96 overflow-y-auto">
                {[
                  { id: 1, title: 'New user signup', time: '5 min ago' },
                  { id: 2, title: 'System update completed', time: '1 hour ago' },
                  { id: 3, title: 'New feedback received', time: '2 hours ago' },
                ].map(notif => (
                  <motion.div
                    key={notif.id}
                    whileHover={{ backgroundColor: 'var(--muted)' }}
                    className="p-3 cursor-pointer transition-colors"
                  >
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Theme Toggle */}
        <motion.button
          onClick={handleThemeToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? (
            <Sun size={20} className="text-foreground" />
          ) : (
            <Moon size={20} className="text-foreground" />
          )}
        </motion.button>

        {/* User Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/50 cursor-pointer flex items-center justify-center text-white font-semibold text-sm"
        >
          AB
        </motion.div>
      </div>
    </div>
  )
}
