import { type NextAuthOptions, type User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google"
import AzureADProvider from "next-auth/providers/azure-ad"
import CredentialsProvider from "next-auth/providers/credentials"

type BackendLoginResponse = {
  success: boolean
  data?: {
    user?: {
      id: string
      email: string
      full_name?: string
      role?: string
    }
    access_token?: string
    refresh_token?: string
    expires_in?: number
    token_type?: string
  }
  error?: {
    message?: string
  }
}

const backendBaseUrl =
  process.env.NEXTAUTH_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

const credentialProvider = CredentialsProvider({
  name: "Email & Password",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error("Email and password are required")
    }

    const response = await fetch(`${backendBaseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    })

    const payload = (await response.json()) as BackendLoginResponse

    if (!response.ok || !payload?.data?.access_token || !payload.data.user?.id) {
      const message = payload?.error?.message || "Invalid email or password"
      throw new Error(message)
    }

    const user = payload.data.user

    return {
      id: user.id,
      email: user.email,
      name: user.full_name || user.email,
      role: user.role,
      accessToken: payload.data.access_token,
      refreshToken: payload.data.refresh_token,
      expiresIn: payload.data.expires_in,
      tokenType: payload.data.token_type || "Bearer",
    } as User & Record<string, unknown>
  },
})

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV !== "production",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),

    AzureADProvider({
      id: "microsoft",
      clientId: process.env.MICROSOFT_CLIENT_ID || "",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
      tenantId: process.env.MICROSOFT_TENANT_ID || "common",
      allowDangerousEmailAccountLinking: true,
    }),

    credentialProvider,
  ],

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = (user as Record<string, unknown>).role
        token.accessToken = (user as Record<string, unknown>).accessToken
        token.refreshToken = (user as Record<string, unknown>).refreshToken
        token.expiresIn = (user as Record<string, unknown>).expiresIn
        token.tokenType = (user as Record<string, unknown>).tokenType
      }
      return token as JWT
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        ;(session.user as Record<string, unknown>).role = token.role
      }
      ;(session as Record<string, unknown>).accessToken = token.accessToken
      ;(session as Record<string, unknown>).refreshToken = token.refreshToken
      ;(session as Record<string, unknown>).tokenType = token.tokenType
      return session
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },
}
