"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Edit, Camera, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useSound } from "@/hooks/use-sound"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Oak Street, Springfield, IL 62701",
    emergencyContact: "John Johnson",
    emergencyPhone: "+1 (555) 987-6543",
  })
  const [editedProfile, setEditedProfile] = useState(profile)
  const { toast } = useToast()
  const { playSound } = useSound()

  const handleEdit = () => {
    setIsEditing(true)
    setEditedProfile(profile)
    playSound("click")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedProfile(profile)
    playSound("click")
  }

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
    playSound("success")
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm">
            <User className="h-6 w-6 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-balance">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information</p>
          </div>
        </div>
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Photo Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-pink-200/50 bg-gradient-to-br from-white/80 to-pink-50/30 backdrop-blur-sm dark:border-pink-900/30 dark:from-gray-900/80 dark:to-pink-950/20">
            <div className="p-6 space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg dark:border-gray-800">
                    <AvatarImage src="/professional-woman-portrait.png" />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-pink-600 text-2xl text-white">
                      SJ
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg hover:from-pink-600 hover:to-pink-700"
                    >
                      <Camera className="h-5 w-5" />
                    </Button>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">Parent Account</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-pink-200/50 dark:border-pink-900/30">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  <span className="text-muted-foreground">Email Verified</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  <span className="text-muted-foreground">Phone Verified</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  <span className="text-muted-foreground">Member Since Sep 2024</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Personal Information */}
          <Card className="border-blue-200/50 bg-gradient-to-br from-white/80 to-blue-50/30 backdrop-blur-sm dark:border-blue-900/30 dark:from-gray-900/80 dark:to-blue-950/20">
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50 dark:bg-gray-900" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50 dark:bg-gray-900" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50 dark:bg-gray-900" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Home Address</Label>
                  <Input
                    id="address"
                    value={editedProfile.address}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50 dark:bg-gray-900" : ""}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-orange-200/50 bg-gradient-to-br from-white/80 to-orange-50/30 backdrop-blur-sm dark:border-orange-900/30 dark:from-gray-900/80 dark:to-orange-950/20">
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergency-contact">Contact Name</Label>
                  <Input
                    id="emergency-contact"
                    value={editedProfile.emergencyContact}
                    onChange={(e) => setEditedProfile({ ...editedProfile, emergencyContact: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50 dark:bg-gray-900" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency-phone">Contact Phone</Label>
                  <Input
                    id="emergency-phone"
                    type="tel"
                    value={editedProfile.emergencyPhone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, emergencyPhone: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50 dark:bg-gray-900" : ""}
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
