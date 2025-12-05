"use client"

import { SessionProvider, useSession } from "next-auth/react"
import { ReactNode, useEffect } from "react"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <SessionTokenSync />
      {children}
    </SessionProvider>
  )
}

// Keep API client and NextAuth tokens in sync so all roles share one sign-in
function SessionTokenSync() {
  const { data: session } = useSession()

  useEffect(() => {
    if (typeof window === "undefined") return

    const accessToken = (session as Record<string, any> | null)?.accessToken
    const refreshToken = (session as Record<string, any> | null)?.refreshToken

    if (accessToken) {
      localStorage.setItem("mbg_access_token", accessToken as string)
    } else {
      localStorage.removeItem("mbg_access_token")
    }

    if (refreshToken) {
      localStorage.setItem("mbg_refresh_token", refreshToken as string)
    } else {
      localStorage.removeItem("mbg_refresh_token")
    }
  }, [session])

  return null
}
