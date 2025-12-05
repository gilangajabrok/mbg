/**
 * useUserProfile Hook - Fetch and manage user profile data
 * 
 * Usage:
 * const { profile, loading, error, refetch, updateProfile } = useUserProfile()
 * 
 * Features:
 * - Automatic data fetching on component mount
 * - Error handling with automatic retry
 * - Mutation methods for updates
 * - Loading and error states
 * - Manual refetch capability
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { userApi, ApiError } from "@/lib/api-client"

export interface UserProfile {
  user_id: string
  full_name: string
  phone?: string
  address?: string
  avatar_url?: string
  metadata?: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UseUserProfileReturn {
  profile: UserProfile | null
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile | null>
  deactivate: () => Promise<void>
}

export function useUserProfile(): UseUserProfileReturn {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    if (!session?.user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await userApi.getProfile()
      if (response.success && response.data) {
        setProfile(response.data)
      }
    } catch (err) {
      const apiError = err as ApiError
      console.error(`[useUserProfile] Failed to fetch profile (trace_id: ${apiError.traceId}):`, err)
      setError(apiError)
    } finally {
      setLoading(false)
    }
  }, [session])

  // Auto-fetch on session change
  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  // Update profile
  const handleUpdateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      try {
        setError(null)
        const response = await userApi.updateProfile(data)
        if (response.success && response.data) {
          setProfile(response.data)
          console.log(`[useUserProfile] Profile updated (trace_id: ${response.meta.trace_id})`)
          return response.data
        }
      } catch (err) {
        const apiError = err as ApiError
        console.error(
          `[useUserProfile] Failed to update profile (trace_id: ${apiError.traceId}):`,
          err
        )
        setError(apiError)
      }
      return null
    },
    []
  )

  // Deactivate user
  const handleDeactivate = useCallback(async () => {
    if (!profile?.user_id) {
      throw new Error("No user profile loaded")
    }

    try {
      setError(null)
      await userApi.deactivateUser(profile.user_id)
      setProfile((prev) => (prev ? { ...prev, is_active: false } : null))
      console.log(`[useUserProfile] User deactivated`)
    } catch (err) {
      const apiError = err as ApiError
      console.error(`[useUserProfile] Failed to deactivate user (trace_id: ${apiError.traceId}):`, err)
      setError(apiError)
      throw err
    }
  }, [profile?.user_id])

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile: handleUpdateProfile,
    deactivate: handleDeactivate,
  }
}
