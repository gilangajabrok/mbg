"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSound } from "@/lib/sound-provider"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export default function SupplierLoginPage() {
  const router = useRouter()
  const { playSound } = useSound()
  const { theme, setTheme } = useTheme()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    playSound("click")
    setLoading(true)

    // Simulate login
    setTimeout(() => {
      playSound("success")
      router.push("/supplier/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playSound("click")
          setTheme(theme === "dark" ? "light" : "dark")
        }}
        className="fixed top-6 right-6 p-3 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all z-50"
      >
        {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-emerald-600" />}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-3xl font-bold shadow-2xl shadow-green-500/30 mb-4"
          >
            S
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Supplier Portal</h1>
          <p className="text-muted-foreground">Sign in to manage your orders</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl p-8"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="supplier@berkahcatering.co.id"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-background transition-all"
                  onFocus={() => playSound("hover")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-background transition-all"
                  onFocus={() => playSound("hover")}
                />
                <button
                  type="button"
                  onClick={() => {
                    playSound("click")
                    setShowPassword(!showPassword)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => {
                    playSound("click")
                    setRememberMe(e.target.checked)
                  }}
                  className="w-4 h-4 rounded border-border/50 text-green-600 focus:ring-2 focus:ring-green-500"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link
                href="/supplier/auth/forgot-password"
                className="text-sm text-green-600 dark:text-green-400 hover:underline"
                onClick={() => playSound("click")}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-center text-sm text-muted-foreground">
              Need a supplier account?{" "}
              <Link
                href="/supplier/auth/register"
                className="text-green-600 dark:text-green-400 hover:underline font-medium"
              >
                Register here
              </Link>
            </p>
            <p className="text-xs text-center text-muted-foreground mt-3">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-green-600 dark:text-green-400 hover:underline">
                Terms & Conditions
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
