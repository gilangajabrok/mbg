'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingCart, Package, Truck, Box, FileText, TrendingUp, MessageSquare, Settings, ChevronRight } from 'lucide-react'
import { mbgMotion } from '@/lib/mbg-motion'
import { useMBGSound } from '@/hooks/use-mbg-sound'
import { cn } from '@/lib/utils'

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/supplier/dashboard' },
  { label: 'Orders', icon: ShoppingCart, href: '/supplier/orders' },
  { label: 'Meal Catalog', icon: Package, href: '/supplier/catalog' },
  { label: 'Delivery Schedules', icon: Truck, href: '/supplier/delivery' },
  { label: 'Inventory', icon: Box, href: '/supplier/inventory' },
  { label: 'Documents', icon: FileText, href: '/supplier/documents' },
  { label: 'Performance', icon: TrendingUp, href: '/supplier/performance' },
  { label: 'Support', icon: MessageSquare, href: '/supplier/support' },
]

const SETTINGS_ITEMS = [
  { label: 'Settings', icon: Settings, href: '/supplier/settings' },
]

export function SupplierSidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname()
  const { playSound } = useMBGSound()

  return (
    <motion.aside
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      className={cn(
        'h-screen sticky top-0 bg-gradient-to-b from-white/90 to-white/80 dark:from-slate-900/90 dark:to-slate-900/80',
        'backdrop-blur-xl border-r border-white/20 dark:border-slate-700/20',
        'flex flex-col pt-20 px-4 py-6 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn('mb-8 px-2', collapsed && 'hidden')}>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">MBG SUPPLIER</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Makan Bergizi Gratis</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <motion.div key={item.href} {...mbgMotion.sidebarHover}>
              <Link
                href={item.href}
                onClick={() => playSound('navOpen')}
                className={cn(
                  'flex items-center gap-2 px-3 py-3 rounded-lg transition-all duration-200 relative group',
                  isActive
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="font-medium text-sm flex-1">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-r"
                      />
                    )}
                  </>
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Settings Section */}
      <div className="border-t border-white/10 dark:border-slate-700/10 pt-4 space-y-1">
        {SETTINGS_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <motion.div key={item.href} {...mbgMotion.sidebarHover}>
              <Link
                href={item.href}
                onClick={() => playSound('navOpen')}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
                )}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.aside>
  )
}
