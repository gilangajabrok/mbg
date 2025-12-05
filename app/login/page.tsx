"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setIsLoading(true)
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">MBG Admin Portal</h1>
            <p className="text-slate-600 dark:text-slate-400">Makan Bergizi Gratis - School Meal Distribution</p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleLogin()
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="admin@mbg.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 pt-6 border-t border-white/10 dark:border-slate-700/10 text-center text-xs text-slate-500 dark:text-slate-400">
            Demo: Use any email and password to proceed
          </div>
        </div>
      </motion.div>
    </div>
  )
}
