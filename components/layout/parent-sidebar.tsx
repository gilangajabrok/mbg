'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, UtensilsCrossed, Truck, Heart, Megaphone, MessageCircle, HeadphonesIcon, FileText, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSound } from '@/lib/sound-provider'

const PARENT_MENU_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/parent/dashboard' },
  { label: 'Children', icon: Users, href: '/parent/children' },
  { label: 'Meal Plan', icon: UtensilsCrossed, href: '/parent/meal-plan' },
  { label: 'Delivery', icon: Truck, href: '/parent/delivery' },
  { label: 'Nutrition', icon: Heart, href: '/parent/nutrition' },
  { label: 'Announcements', icon: Megaphone, href: '/parent/announcements' },
  { label: 'Feedback', icon: MessageCircle, href: '/parent/feedback' },
  { label: 'Support', icon: HeadphonesIcon, href: '/parent/support' },
  { label: 'Documents', icon: FileText, href: '/parent/documents' },
]

const SETTINGS_ITEMS = [
  { label: 'Settings', icon: Settings, href: '/parent/settings' },
]

export function ParentSidebar() {
  const pathname = usePathname()
  const { playSound } = useSound()

  return (
    <motion.aside
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      className="h-screen sticky top-0 w-64 bg-gradient-to-b from-white/90 to-pink-50/50 dark:from-slate-900/90 dark:to-pink-950/20 backdrop-blur-xl border-r border-pink-100/20 dark:border-pink-900/20 flex flex-col pt-20 px-4 py-6"
    >
      {/* Logo */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">MBG PARENT</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Portal Orang Tua</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {PARENT_MENU_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <motion.div
              key={item.href}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                onClick={() => playSound('hover')}
                onMouseEnter={() => playSound('hover')}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 relative group',
                  isActive
                    ? 'bg-gradient-to-r from-pink-500/20 to-pink-400/10 text-pink-600 dark:text-pink-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="parentActiveIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500 rounded-r"
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Settings Section */}
      <div className="border-t border-pink-100/30 dark:border-pink-900/30 pt-4 space-y-1">
        {SETTINGS_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.href}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                onClick={() => playSound('hover')}
                onMouseEnter={() => playSound('hover')}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-pink-500/20 to-pink-400/10 text-pink-600 dark:text-pink-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 px-2">
        <p className="text-xs text-center text-muted-foreground">
          MBG Parent v3.0
        </p>
      </div>
    </motion.aside>
  )
}
