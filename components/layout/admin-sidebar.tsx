"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  School,
  Package,
  Users,
  UserCog,
  Calendar,
  ClipboardCheck,

  DollarSign,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  Building2,
  GraduationCap,
  ShoppingBag,
  Megaphone
} from "lucide-react"
import { useSound } from "@/lib/sound-provider"

const adminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: School, label: "Schools", href: "/admin/schools" },
  { icon: GraduationCap, label: "Students", href: "/admin/students" },
  { icon: Calendar, label: "Meal Plans", href: "/admin/meal-plans" },
  { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
  { icon: Package, label: "Distribution", href: "/admin/distribution" },
  { icon: Users, label: "Suppliers", href: "/admin/suppliers" },
  { icon: UserCog, label: "Parents", href: "/admin/parents" },
  { icon: Megaphone, label: "Announcements", href: "/admin/announcements" },
  { icon: Calendar, label: "Meal Plans", href: "/admin/meals" },
  { icon: ClipboardCheck, label: "Quality Control", href: "/admin/quality" },

  { icon: DollarSign, label: "Financial", href: "/admin/finance" },
  { icon: FileText, label: "Documents", href: "/admin/documents" },
  { icon: BarChart3, label: "Reports", href: "/admin/reports" },
  { icon: Shield, label: "Great System", href: "/great/dashboard" },
  { icon: Building2, label: "Organization", href: "/admin/organization-settings" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { playSound } = useSound()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // Basic decode to check role (in production use proper jwt library or context)
    const token = localStorage.getItem("accessToken")
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUserRole(payload.role)
      } catch (e) {
        console.error("Failed to decode token", e)
      }
    }
  }, [])

  const filteredMenuItems = adminMenuItems.filter(item => {
    if (item.label === "Great System") {
      return userRole === "GREAT_ADMIN"
    }
    return true
  })

  const handleLogout = () => {
    playSound("click")
    // Logout logic here
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={`h-screen sticky top-0 flex-shrink-0 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-br from-blue-50/80 via-white/50 to-indigo-50/80 dark:from-blue-950/30 dark:via-gray-900/50 dark:to-indigo-950/30 backdrop-blur-xl border-r border-border/50`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between border-b border-border/50">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                M
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">MBG Admin</h1>
                <p className="text-xs text-muted-foreground">Management Panel</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            playSound("click")
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
        {filteredMenuItems.map((item, index) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <motion.div
              key={item.href}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={item.href} onClick={() => playSound("click")}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-2 px-3 py-3 rounded-xl transition-all cursor-pointer
                    ${isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium text-sm whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border/50">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-medium text-sm whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  )
}
