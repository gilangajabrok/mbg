'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'
import { useMBGSound } from '@/hooks/use-mbg-sound'
import Link from 'next/link'

export default function SupplierForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { playSound } = useMBGSound()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    playSound('success')
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-8 shadow-xl">
          {!submitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reset Password</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Enter your email to receive a password reset link</p>
              </div>

              {/* Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onClick={() => playSound('click')}
                      placeholder="supplier@company.id"
                      className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg mt-6"
                >
                  Send Reset Link
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center text-sm">
                <Link href="/supplier/login" className="text-green-600 dark:text-green-400 hover:underline">
                  Back to Login
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex justify-center mb-6"
                >
                  <div className="p-4 bg-green-500/20 rounded-full">
                    <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                  </div>
                </motion.div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check Your Email</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  We've sent a password reset link to <span className="font-semibold">{email}</span>
                </p>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-left mb-6">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    If you don't see the email, check your spam folder or try resending the link.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playSound('click')
                    setSubmitted(false)
                    setEmail('')
                  }}
                  className="w-full px-6 py-3 bg-slate-500/20 hover:bg-slate-500/30 text-slate-700 dark:text-slate-400 rounded-lg font-semibold transition-all"
                >
                  Try Another Email
                </motion.button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
