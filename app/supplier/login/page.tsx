'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useMBGSound } from '@/hooks/use-mbg-sound'
import Link from 'next/link'

export default function SupplierLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { playSound } = useMBGSound()

  const handleLogin = () => {
    playSound('success')
    // Would redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-8 shadow-xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">MBG</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Supplier Portal</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault()
            handleLogin()
          }}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onClick={() => playSound('click')}
                  placeholder="supplier@freshvalley.id"
                  className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onClick={() => playSound('click')}
                  placeholder="••••••••"
                  className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg pl-12 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    playSound('click')
                    setShowPassword(!showPassword)
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all shadow-lg mt-6"
            >
              Login
            </motion.button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-3 text-center text-sm">
            <Link href="/supplier/forgot-password" className="text-green-600 dark:text-green-400 hover:underline">
              Forgot Password?
            </Link>
            <div>
              <span className="text-slate-600 dark:text-slate-400">Don't have an account? </span>
              <Link href="/supplier/register" className="text-green-600 dark:text-green-400 hover:underline font-semibold">
                Register
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
