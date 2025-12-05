'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, LayoutDashboard, Users, Bot, Settings, LogOut, BarChart3, FileText } from 'lucide-react'
import { useSound } from '@/lib/sound-provider'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Content', href: '/content', icon: FileText },
  { label: 'AI Assistant', href: '/ai', icon: Bot },
]

const bottomItems = [
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Logout', href: '#', icon: LogOut, isButton: true },
]

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { playSound } = useSound()

  const handleNavClick = () => {
    playSound('click')
  }

  const handleToggle = () => {
    playSound('whoosh')
    onToggle()
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-sidebar border-r border-sidebar-border flex flex-col relative z-40"
    >
      {/* Logo and Branding */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key="logo-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-semibold text-sidebar-foreground text-sm"
            >
              Admin Engine
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-1.5 hover:bg-sidebar-accent rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronRight 
            size={18} 
            className={cn(
              "text-sidebar-foreground transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </motion.button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                onClick={handleNavClick}
                whileHover={{ x: 4 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-200',
                  isActive 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                <Icon size={20} className="flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border px-2 py-4 space-y-1">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <motion.div
              key={item.href}
              onClick={handleNavClick}
              whileHover={{ x: 4 }}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-200',
                isActive 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              <AnimatePresence mode="wait">
                {isOpen && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </motion.aside>
  )
}
