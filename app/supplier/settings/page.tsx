'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette, Bell, Lock, Building } from 'lucide-react'
import { useMBGSound } from '@/hooks/use-mbg-sound'
import { useTheme } from 'next-themes'

export default function SupplierSettingsPage() {
  const { theme, setTheme } = useTheme()
  const [density, setDensity] = useState('comfortable')
  const { playSound } = useMBGSound()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your preferences and account settings</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20 p-1 rounded-lg">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
        </TabsList>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          <div className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Theme Preferences</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">Theme Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: '☀️' },
                    { value: 'dark', label: 'Dark', icon: '🌙' },
                    { value: 'system', label: 'System', icon: '⚙️' },
                  ].map(mode => (
                    <button
                      key={mode.value}
                      onClick={() => {
                        playSound('click')
                        setTheme(mode.value)
                      }}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        theme === mode.value
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-white/20 dark:border-slate-700/20 bg-white/50 dark:bg-slate-700/50 hover:border-white/40 dark:hover:border-slate-700/40'
                      }`}
                    >
                      <span className="text-2xl">{mode.icon}</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">Density</label>
                <select
                  value={density}
                  onChange={(e) => {
                    playSound('click')
                    setDensity(e.target.value)
                  }}
                  className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                >
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                  <option value="spacious">Spacious</option>
                </select>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Notification Preferences</h3>

            <div className="space-y-4">
              {[
                { label: 'Order Updates', description: 'Get notified about new orders' },
                { label: 'Delivery Alerts', description: 'Receive delivery status updates' },
                { label: 'Performance Reports', description: 'Weekly performance summaries' },
                { label: 'System Maintenance', description: 'Scheduled maintenance notifications' },
              ].map((notification, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-700/30">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{notification.label}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{notification.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    onClick={() => playSound('click')}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Security Settings</h3>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-700/30 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Add an extra layer of security</p>
                </div>
                <button
                  onClick={() => playSound('success')}
                  className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-semibold transition-colors"
                >
                  Enable
                </button>
              </div>

              <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-700/30 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Change Password</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Update your account password</p>
                </div>
                <button
                  onClick={() => playSound('click')}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-semibold transition-colors"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <div className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Company Profile</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
                <input
                  type="text"
                  defaultValue="Fresh Valley Farm"
                  onClick={() => playSound('click')}
                  className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Contact Email</label>
                <input
                  type="email"
                  defaultValue="contact@freshvalley.id"
                  onClick={() => playSound('click')}
                  className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playSound('success')}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg"
              >
                Save Changes
              </motion.button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
