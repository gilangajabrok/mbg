'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X } from 'lucide-react'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion-variants'

interface Notification {
  id: number
  title: string
  description: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
}

const typeStyles = {
  info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300',
  error: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300',
}

interface NotificationListProps {
  items: Notification[]
}

export function NotificationList({ items }: NotificationListProps) {
  const [notifications, setNotifications] = useState(items)

  const dismiss = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      <AnimatePresence>
        {notifications.map(notif => (
          <motion.div
            key={notif.id}
            variants={staggerItemVariants}
            exit={{ opacity: 0, x: 100 }}
            className={`p-4 rounded-lg border flex items-start gap-3 ${typeStyles[notif.type]}`}
          >
            <Bell size={18} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-sm">{notif.title}</p>
              <p className="text-xs mt-1 opacity-80">{notif.description}</p>
            </div>
            <motion.button
              onClick={() => dismiss(notif.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-lg flex-shrink-0 hover:opacity-70"
            >
              <X size={18} />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
