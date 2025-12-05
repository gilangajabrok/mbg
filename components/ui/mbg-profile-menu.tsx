'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Shield, CreditCard, Keyboard, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { mbgMotion } from '@/lib/mbg-motion'
import { useMBGSound } from '@/hooks/use-mbg-sound'
import { MBGLogoutModal } from './mbg-logout-modal'
import { useClickOutside } from '@/hooks/use-click-outside'

const PROFILE_MENU_ITEMS = [
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Shield, label: 'Account Settings', href: '/settings' },
  { icon: CreditCard, label: 'Billing & Subscription', href: '/billing' },
  { icon: Keyboard, label: 'Keyboard Shortcuts', action: 'shortcuts' },
]

interface MBGProfileMenuProps {
  onClose?: () => void
}

export function MBGProfileMenu({ onClose }: MBGProfileMenuProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { playSound } = useMBGSound()
  const router = useRouter()
  const ref = useClickOutside(() => onClose?.())

  const handleNavigate = (href: string) => {
    playSound('buttonPress')
    router.push(href)
    onClose?.()
  }

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -8 }}
        transition={{ duration: 0.2 }}
        className="w-56 bg-gradient-to-b from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-white/10 dark:border-slate-700/10">
          <p className="font-semibold text-slate-900 dark:text-white">Admin User</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">admin@example.com</p>
        </div>

        <nav className="p-2 space-y-1">
          {PROFILE_MENU_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.label}
                type="button"
                onClick={() => item.href && handleNavigate(item.href)}
                whileHover={{ x: 4 }}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors text-left"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            )
          })}
        </nav>

        <div className="border-t border-white/10 dark:border-slate-700/10 p-2">
          <motion.button
            type="button"
            whileHover={{ x: 4 }}
            onClick={() => {
              playSound('buttonPress')
              setShowLogoutModal(true)
            }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.div>

      <MBGLogoutModal open={showLogoutModal} onOpenChange={setShowLogoutModal} />
    </>
  )
}
