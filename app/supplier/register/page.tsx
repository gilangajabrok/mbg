'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, Building, User, Phone } from 'lucide-react'
import { useMBGSound } from '@/hooks/use-mbg-sound'
import Link from 'next/link'

export default function SupplierRegisterPage() {
  const [step, setStep] = useState(1)
  const [companyName, setCompanyName] = useState('')
  const [directorName, setDirectorName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { playSound } = useMBGSound()

  const handleNext = () => {
    playSound('success')
    setStep(step + 1)
  }

  const handleRegister = () => {
    playSound('success')
    // Would redirect to verification page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">MBG</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Supplier Registration</p>
            <div className="mt-4 flex justify-center gap-2">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className={`h-1 w-8 rounded-full transition-all ${
                    s <= step ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Company Info */}
          {step === 1 && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleNext()
              }}
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    onClick={() => playSound('click')}
                    placeholder="Your Company Name"
                    className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Director Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={directorName}
                    onChange={(e) => setDirectorName(e.target.value)}
                    onClick={() => playSound('click')}
                    placeholder="Director's Full Name"
                    className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg mt-6"
              >
                Next
              </motion.button>
            </motion.form>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleNext()
              }}
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onClick={() => playSound('click')}
                    placeholder="supplier@company.id"
                    className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onClick={() => playSound('click')}
                    placeholder="+62-21-XXXX-XXXX"
                    className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    playSound('click')
                    setStep(1)
                  }}
                  className="flex-1 px-6 py-3 bg-slate-500/20 hover:bg-slate-500/30 text-slate-700 dark:text-slate-400 rounded-lg font-semibold transition-all"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg"
                >
                  Next
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleRegister()
              }}
            >
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

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onClick={() => playSound('click')}
                    placeholder="••••••••"
                    className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    playSound('click')
                    setStep(2)
                  }}
                  className="flex-1 px-6 py-3 bg-slate-500/20 hover:bg-slate-500/30 text-slate-700 dark:text-slate-400 rounded-lg font-semibold transition-all"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg"
                >
                  Register
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Links */}
          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600 dark:text-slate-400">Already have an account? </span>
            <Link href="/supplier/login" className="text-green-600 dark:text-green-400 hover:underline font-semibold">
              Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
