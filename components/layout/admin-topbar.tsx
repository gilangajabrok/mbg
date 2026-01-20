"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Bell, Globe, Sun, Moon, User, Settings, HelpCircle, LogOut, ChevronDown } from "lucide-react"
import { useSound } from "@/lib/sound-provider"
import { useTheme } from "next-themes"
import { TenantSwitcher } from "@/components/layout/tenant-switcher"

export default function AdminTopbar() {
  const { playSound } = useSound()
  const { theme, setTheme } = useTheme()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, title: "New supplier registration", time: "5 min ago", unread: true },
    { id: 2, title: "Quality report submitted", time: "1 hour ago", unread: true },
    { id: 3, title: "Delivery completed", time: "2 hours ago", unread: false },
  ]

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="h-full px-6 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search schools, suppliers, meals..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all"
              onFocus={() => playSound("hover")}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Tenant Switcher */}
          <TenantSwitcher />

          {/* Language Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playSound("click")}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors relative"
          >
            <Globe className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              playSound("click")
              setTheme(theme === "dark" ? "light" : "dark")
            }}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playSound("click")
                setShowNotifications(!showNotifications)
              }}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-80 bg-background/95 backdrop-blur-xl rounded-xl border border-border/50 shadow-xl overflow-hidden"
              >
                <div className="p-4 border-b border-border/50">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 hover:bg-muted/30 transition-colors cursor-pointer border-b border-border/30 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        {notification.unread && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                playSound("click")
                setShowProfileMenu(!showProfileMenu)
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                A
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-xs text-muted-foreground">Super Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.button>

            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-56 bg-background/95 backdrop-blur-xl rounded-xl border border-border/50 shadow-xl overflow-hidden"
              >
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm">
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    <span>Help</span>
                  </button>
                  <div className="my-1 border-t border-border/50"></div>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-sm text-red-600 dark:text-red-400">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
