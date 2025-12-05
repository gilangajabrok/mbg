'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Lock, Shield, Key } from 'lucide-react'
import { useMBGSound } from '@/hooks/use-mbg-sound'

export default function SupplierSecurityPage() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const { playSound } = useMBGSound()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Security & 2FA</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your account security settings</p>
      </div>

      {/* Two-Factor Authentication */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-8"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Add an extra layer of security to your account</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${twoFAEnabled ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-500/20 text-red-700 dark:text-red-400'}`}>
              {twoFAEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        {!twoFAEnabled ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Two-Factor Authentication adds an extra layer of security. You'll need to enter a code from your authenticator app when logging in.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playSound('success')
                setTwoFAEnabled(true)
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold transition-all shadow-lg"
            >
              Enable 2FA
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-700 dark:text-green-400 font-semibold">
                ✓ Two-Factor Authentication is active on your account
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playSound('warning')
                setTwoFAEnabled(false)
              }}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold transition-all shadow-lg"
            >
              Disable 2FA
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Password Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-8"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Change Password</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Update your account password regularly</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
            <input
              type="password"
              onClick={() => playSound('click')}
              className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
            <input
              type="password"
              onClick={() => playSound('click')}
              className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
            <input
              type="password"
              onClick={() => playSound('click')}
              className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playSound('success')}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold transition-all shadow-lg"
          >
            Update Password
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
