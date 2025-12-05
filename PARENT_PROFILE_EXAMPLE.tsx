/**
 * Example: Parent Profile Page - Migrated to use Backend API
 * 
 * This is a reference implementation showing how to convert a mock-data component
 * to use the live User Profile API.
 * 
 * Original: app/parent/profile/page.tsx
 * This example can be copied directly or used as reference for other pages.
 */

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Edit, Camera, Save, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useSound } from "@/hooks/use-sound"
import { useUserProfile } from "@/hooks/use-user-profile"
import { PageLoader } from "@/components/page-loader"

export default function ProfilePage() {
  const { profile, loading, error, updateProfile } = useUserProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile || {})
  const { toast } = useToast()
  const { playSound } = useSound()

  // Update local edit state when profile loads
  useState(() => {
    if (profile) {
      setEditedProfile(profile)
    }
  }, [profile])

  const handleEdit = () => {
    setIsEditing(true)
    setEditedProfile(profile || {})
    playSound("click")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedProfile(profile || {})
    playSound("click")
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      playSound("click")

      // Validate input
      if (!editedProfile.full_name?.trim()) {
        toast({
          title: "Validation Error",
          description: "Full name is required",
          variant: "destructive",
        })
        return
      }

      if (editedProfile.phone && editedProfile.phone.length > 20) {
        toast({
          title: "Validation Error",
          description: "Phone number must be 20 characters or less",
          variant: "destructive",
        })
        return
      }

      // Call API to update profile
      const result = await updateProfile({
        full_name: editedProfile.full_name,
        phone: editedProfile.phone,
        address: editedProfile.address,
        avatar_url: editedProfile.avatar_url,
      })

      if (result) {
        setIsEditing(false)
        playSound("success")
        toast({
          title: "Profile Updated",
          description: "Your profile information has been successfully updated.",
        })
      } else {
        throw new Error("Failed to save profile")
      }
    } catch (err) {
      playSound("error")
      toast({
        title: "Save Failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Loading state
  if (loading) {
    return <PageLoader />
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4 p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Failed to Load Profile</h3>
              <p className="text-sm text-red-700 mt-1">{error.message}</p>
              {error.traceId && (
                <p className="text-xs text-red-600 mt-2 font-mono">Trace ID: {error.traceId}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No profile state
  if (!profile) {
    return (
      <div className="space-y-4 p-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-900">
            No profile found. Please contact support if this persists.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Deactivation Warning */}
      {!profile.is_active && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Account Deactivated</h3>
              <p className="text-sm text-red-700 mt-1">
                Your account is currently deactivated. Please contact support to reactivate it.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6"
      >
        <Card className="p-6">
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                  <AvatarFallback>
                    {profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground">{profile.full_name}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Member since {new Date(profile.created_at).toLocaleDateString()}
                </p>
                {!isEditing && (
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="mt-4 gap-2"
                    disabled={!profile.is_active}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-4 border-t pt-6">
              {isEditing ? (
                <>
                  {/* Editing Form */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={editedProfile.full_name || ""}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, full_name: e.target.value })
                        }
                        placeholder="Enter full name"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editedProfile.phone || ""}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, phone: e.target.value })
                        }
                        placeholder="Enter phone number"
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Max 20 characters</p>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={editedProfile.address || ""}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, address: e.target.value })
                        }
                        placeholder="Enter address"
                        className="mt-2"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        disabled={isSaving}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Display Mode */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        Phone
                      </div>
                      <p className="mt-2 text-foreground">
                        {profile.phone || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <User className="h-4 w-4" />
                        Address
                      </div>
                      <p className="mt-2 text-foreground">
                        {profile.address || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Display (if any) */}
                  {profile.metadata && Object.keys(profile.metadata).length > 0 && (
                    <div className="rounded-lg bg-muted p-4 mt-4">
                      <h3 className="text-sm font-semibold mb-3">Additional Information</h3>
                      <div className="space-y-2 text-sm">
                        {Object.entries(profile.metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
                    <p>
                      Created:{" "}
                      {new Date(profile.created_at).toLocaleString()}
                    </p>
                    <p>
                      Last Updated:{" "}
                      {new Date(profile.updated_at).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
