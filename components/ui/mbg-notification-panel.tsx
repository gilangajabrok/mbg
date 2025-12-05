'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, Trash2 } from 'lucide-react'
import { mbgMotion } from '@/lib/mbg-motion'
import { useMBGSound } from '@/hooks/use-mbg-sound'
import { useClickOutside } from '@/hooks/use-click-outside'

interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface MBGNotificationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Invoice Paid',
    message: 'Invoice #INV-1024 paid successfully',
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
  },
  {
    id: '2',
    title: 'New User Signup',
    message: 'New user alex@example.com signed up',
    timestamp: new Date(Date.now() - 15 * 60000),
    read: false,
  },
  {
    id: '3',
    title: 'Project Milestone',
    message: 'Project "Q4 Dashboard" reached 50% completion',
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: true,
  },
  {
    id: '4',
    title: 'System Update',
    message: 'System maintenance completed',
    timestamp: new Date(Date.now() - 24 * 3600000),
    read: true,
  },
]

export function MBGNotificationPanel({ open, onOpenChange }: MBGNotificationPanelProps) {
  const ref = useClickOutside(() => onOpenChange(false))
  const { playSound } = useMBGSound()
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div ref={ref} className="relative">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-0 w-80 bg-gradient-to-b from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="border-b border-white/10 dark:border-slate-700/10 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {unreadCount} unread
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playSound('buttonPress')
                  }}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Mark all as read
                </motion.button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto space-y-1 p-2">
              {MOCK_NOTIFICATIONS.length > 0 ? (
                MOCK_NOTIFICATIONS.map((notification) => (
                  <motion.div
                    key={notification.id}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      !notification.read
                        ? 'bg-blue-500/10 dark:bg-blue-500/10'
                        : 'hover:bg-white/5 dark:hover:bg-slate-700/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-slate-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.read && (
                        <motion.div
                          layoutId="unread-indicator"
                          className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1"
                        />
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No notifications
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 dark:border-slate-700/10 p-3 text-center">
              <motion.a
                whileHover={{ scale: 1.02 }}
                href="#"
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View all notifications
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
