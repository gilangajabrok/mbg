"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Shield, Globe, Save } from "lucide-react"
import { useSound } from "@/lib/sound-provider"

export default function AdminSettingsPage() {
  const { playSound } = useSound()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    qualityAlerts: true,
    deliveryUpdates: true,
    twoFactorAuth: false,
    sessionTimeout: "30",
    language: "en",
  })

  const handleSave = () => {
    playSound("success")
    // Save settings logic
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure system preferences and notifications</p>
        </div>

        {/* Notifications */}
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <p className="text-sm text-muted-foreground">Manage notification preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: "emailNotifications", label: "Email Notifications", desc: "Receive notifications via email" },
              { key: "smsNotifications", label: "SMS Notifications", desc: "Receive notifications via SMS" },
              { key: "weeklyReports", label: "Weekly Reports", desc: "Get weekly summary reports" },
              { key: "qualityAlerts", label: "Quality Alerts", desc: "Get alerts for quality issues" },
              { key: "deliveryUpdates", label: "Delivery Updates", desc: "Track delivery status updates" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <button
                  onClick={() => {
                    playSound("click")
                    setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })
                  }}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings[item.key as keyof typeof settings] ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings[item.key as keyof typeof settings] ? 24 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Security</h3>
              <p className="text-sm text-muted-foreground">Manage security settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <button
                onClick={() => {
                  playSound("click")
                  setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.twoFactorAuth ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <motion.div
                  animate={{ x: settings.twoFactorAuth ? 24 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="font-medium text-foreground mb-2">Session Timeout</p>
              <select
                value={settings.sessionTimeout}
                onChange={(e) => {
                  playSound("click")
                  setSettings({ ...settings, sessionTimeout: e.target.value })
                }}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Language & Region</h3>
              <p className="text-sm text-muted-foreground">Set your preferred language</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/30">
            <p className="font-medium text-foreground mb-2">Language</p>
            <select
              value={settings.language}
              onChange={(e) => {
                playSound("click")
                setSettings({ ...settings, language: e.target.value })
              }}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="id">Bahasa Indonesia</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </motion.button>
        </div>
      </motion.div>
  )
}
