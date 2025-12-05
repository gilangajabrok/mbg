"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SettingsIcon, Bell, Lock, Globe, CreditCard, Shield, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useSound } from "@/hooks/use-sound"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    delivery: true,
    announcements: false,
    meals: true,
  })
  const [language, setLanguage] = useState("en")
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const { playSound } = useSound()

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
    playSound("click")
  }

  const handleSaveSettings = () => {
    playSound("success")
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm">
          <SettingsIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-balance">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-blue-200/50 bg-gradient-to-br from-white/80 to-blue-50/30 backdrop-blur-sm dark:border-blue-900/30 dark:from-gray-900/80 dark:to-blue-950/20">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold">Notifications</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notif">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    id="email-notif"
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationToggle("email")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notif">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get real-time alerts</p>
                  </div>
                  <Switch
                    id="push-notif"
                    checked={notifications.push}
                    onCheckedChange={() => handleNotificationToggle("push")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="delivery-notif">Delivery Updates</Label>
                    <p className="text-sm text-muted-foreground">Track delivery status</p>
                  </div>
                  <Switch
                    id="delivery-notif"
                    checked={notifications.delivery}
                    onCheckedChange={() => handleNotificationToggle("delivery")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="announcement-notif">Announcements</Label>
                    <p className="text-sm text-muted-foreground">Important school updates</p>
                  </div>
                  <Switch
                    id="announcement-notif"
                    checked={notifications.announcements}
                    onCheckedChange={() => handleNotificationToggle("announcements")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="meals-notif">Meal Reminders</Label>
                    <p className="text-sm text-muted-foreground">Daily meal notifications</p>
                  </div>
                  <Switch
                    id="meals-notif"
                    checked={notifications.meals}
                    onCheckedChange={() => handleNotificationToggle("meals")}
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Language & Region */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-green-200/50 bg-gradient-to-br from-white/80 to-green-50/30 backdrop-blur-sm dark:border-green-900/30 dark:from-gray-900/80 dark:to-green-950/20">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold">Language & Region</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="cst">
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateformat">Date Format</Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger id="dateformat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-red-200/50 bg-gradient-to-br from-white/80 to-red-50/30 backdrop-blur-sm dark:border-red-900/30 dark:from-gray-900/80 dark:to-red-950/20">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-semibold">Security</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                  onClick={() => {
                    playSound("success")
                    toast({
                      title: "Password Updated",
                      description: "Your password has been changed successfully.",
                    })
                  }}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Payment Methods */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-purple-200/50 bg-gradient-to-br from-white/80 to-purple-50/30 backdrop-blur-sm dark:border-purple-900/30 dark:from-gray-900/80 dark:to-purple-950/20">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold">Payment Methods</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-purple-200 bg-white/50 p-4 dark:border-purple-800 dark:bg-purple-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10">
                      <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Add New Payment Method
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <Button
          size="lg"
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
        >
          Save All Settings
        </Button>
      </motion.div>
    </div>
  )
}
