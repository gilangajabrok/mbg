"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Truck,
  Heart,
  Megaphone,
  MessageCircle,
  HeadphonesIcon,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { useSound } from "@/hooks/use-sound"
import { cn } from "@/lib/utils"

export interface SidebarParentProps {
  className?: string
}

const parentMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/parent/dashboard" },
  { icon: Users, label: "Children", href: "/parent/children" },
  { icon: UtensilsCrossed, label: "Meal Plan", href: "/parent/meal-plan" },
  { icon: Truck, label: "Delivery", href: "/parent/delivery" },
  { icon: Heart, label: "Nutrition", href: "/parent/nutrition" },
  { icon: Megaphone, label: "Announcements", href: "/parent/announcements" },
  { icon: MessageCircle, label: "Feedback", href: "/parent/feedback" },
  { icon: HeadphonesIcon, label: "Support", href: "/parent/support" },
  { icon: FileText, label: "Documents", href: "/parent/documents" },
]

const settingsItems = [{ icon: Settings, label: "Settings", href: "/parent/settings" }]

export const SidebarParent: React.FC<SidebarParentProps> = ({ className }) => {
  const pathname = usePathname()
  const { play } = useSound()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    play("tap")
    // Logout logic here
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={cn(
        "h-screen sticky top-0 flex-shrink-0 flex flex-col",
        isCollapsed ? "w-20" : "w-64",
        "bg-gradient-to-br from-pink-50/80 via-white/50 to-rose-50/80",
        "dark:from-pink-950/30 dark:via-gray-900/50 dark:to-rose-950/30",
        "backdrop-blur-xl border-r border-border/50",
        className,
      )}
    >
      {/* Logo & Toggle */}
      <div className="p-6 flex items-center justify-between border-b border-border/50">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
                <Heart className="w-5 h-5" fill="white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">MBG Parent</h1>
                <p className="text-xs text-muted-foreground">Portal Orang Tua</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            play("tap")
            setIsCollapsed(!isCollapsed)
          }}
          className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          )}
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        {parentMenuItems.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <motion.div
              key={item.href}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={item.href} onClick={() => play("tap")}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer relative",
                    isActive
                      ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium text-sm whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* Active indicator */}
                  {isActive && !isCollapsed && (
                    <motion.div
                      layoutId="parentActiveTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"
                    />
                  )}
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Settings Section */}
      <div className="p-4 border-t border-border/50 space-y-1">
        {settingsItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href} onClick={() => play("tap")}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer",
                  isActive
                    ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium text-sm whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )
        })}

        {/* Logout Button */}
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-medium text-sm whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Footer - Version */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border/50">
          <p className="text-xs text-center text-muted-foreground">MBG Parent v3.0</p>
        </div>
      )}
    </motion.aside>
  )
}
