"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Database,
  BarChart3,
  Activity,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { useSound } from "@/hooks/use-sound"

const menuItems = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    href: "/great/dashboard",
  },
  {
    title: "Audit & Monitoring",
    icon: Activity,
    href: "/great/dashboard/audit",
  },
  {
    title: "User & Role Management",
    icon: Users,
    href: "/great/dashboard/users",
  },
  {
    title: "Database & System",
    icon: Database,
    href: "/great/dashboard/database",
  },
  {
    title: "Reports & Analytics",
    icon: BarChart3,
    href: "/great/dashboard/reports",
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { play } = useSound()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: collapsed ? "80px" : "280px",
      }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 border-r border-white/10 flex flex-col h-screen sticky top-0"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">Super Admin</h2>
                <p className="text-white/50 text-xs">System Control</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            play("click")
            setCollapsed(!collapsed)
          }}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4 text-white" /> : <ChevronLeft className="w-4 h-4 text-white" />}
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href} onClick={() => play("tap")}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-400/20 to-orange-500/20 text-amber-400 border border-amber-400/30"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-amber-400" : ""}`} />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => play("click")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  )
}
