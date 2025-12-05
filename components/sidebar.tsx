'use client'

import Link from 'next/link'
import { LayoutDashboard, Users, Bot, ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSound } from '@/hooks/use-sound'

export default function Sidebar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(true)
  const { play } = useSound()

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin', label: 'Admin', icon: Users },
    { href: '/ai', label: 'AI', icon: Bot },
  ]

  const handleToggle = () => {
    play('whoosh')
    setIsExpanded(!isExpanded)
  }

  return (
    <motion.aside 
      className="bg-sidebar border-r border-sidebar-border flex flex-col"
      animate={{ width: isExpanded ? 256 : 80 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo section */}
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        <motion.h1 
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-lg font-semibold text-sidebar-foreground"
        >
          Admin
        </motion.h1>
        <motion.button
          onClick={handleToggle}
          whileTap={{ scale: 0.95 }}
          className="p-1 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <motion.div animate={{ rotate: isExpanded ? 0 : 180 }}>
            <ChevronRight className="w-4 h-4 text-sidebar-foreground/60" />
          </motion.div>
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link, index) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={link.href}
                onClick={() => play('tap')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                </motion.div>
                <motion.span
                  animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-sm overflow-hidden whitespace-nowrap"
                >
                  {link.label}
                </motion.span>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Footer */}
      <motion.div 
        animate={{ opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/50 text-center"
      >
        v2.0.0
      </motion.div>
    </motion.aside>
  )
}
