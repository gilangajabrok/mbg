"use client"

import { motion } from "framer-motion"
import { Heart, Shield, Package, Crown } from "lucide-react"
import Link from "next/link"
import { useSound } from "@/hooks/use-sound"

export default function LandingPage() {
  const { play } = useSound()

  const portals = [
    {
      title: "Super Admin",
      description: "Full system oversight, audit logs, user management, and platform analytics",
      icon: Crown,
      href: "/great/dashboard",
      gradient: "from-amber-500/20 via-yellow-500/20 to-orange-500/20",
      iconColor: "text-amber-500",
      hoverGradient: "hover:from-amber-500/30 hover:via-yellow-500/30 hover:to-orange-500/30",
    },
    {
      title: "Admin Panel",
      description: "Manage schools, suppliers, distribution, and monitor the entire MBG platform",
      icon: Shield,
      href: "/admin/auth/login",
      gradient: "from-blue-500/20 via-indigo-500/20 to-purple-500/20",
      iconColor: "text-blue-500",
      hoverGradient: "hover:from-blue-500/30 hover:via-indigo-500/30 hover:to-purple-500/30",
    },
    {
      title: "Supplier Portal",
      description: "Handle orders, manage inventory, track deliveries, and quality control",
      icon: Package,
      href: "/supplier/auth/login",
      gradient: "from-emerald-500/20 via-green-500/20 to-teal-500/20",
      iconColor: "text-emerald-500",
      hoverGradient: "hover:from-emerald-500/30 hover:via-green-500/30 hover:to-teal-500/30",
    },
    {
      title: "Parent Portal",
      description: "Access your children's meal plans, nutrition tracking, and delivery updates",
      icon: Heart,
      href: "/parent/auth/login",
      gradient: "from-pink-500/20 via-rose-500/20 to-purple-500/20",
      iconColor: "text-pink-500",
      hoverGradient: "hover:from-pink-500/30 hover:via-rose-500/30 hover:to-purple-500/30",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            MBG Platform
          </motion.h1>
          <motion.p
            className="text-xl text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Select your portal to continue
          </motion.p>
        </motion.div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
            >
              <Link
                href={portal.href}
                onClick={() => play("tap")}
                className={`block group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br ${portal.gradient} ${portal.hoverGradient} border border-white/20 dark:border-white/10 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105`}
              >
                <div className="p-8">
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm flex items-center justify-center mb-6 ${portal.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <portal.icon className="w-8 h-8" />
                  </motion.div>

                  {/* Content */}
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{portal.title}</h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{portal.description}</p>

                  {/* Hover Arrow */}
                  <motion.div
                    className="mt-6 flex items-center text-sm font-medium text-slate-700 dark:text-slate-300"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    Access Portal
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>

                {/* Decorative gradient orb */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/30 to-transparent dark:from-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400"
        >
          <p>Enterprise-grade platform for meal distribution management</p>
        </motion.div>
      </div>
    </div>
  )
}
