"use client"

import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/layout/auth-layout"
import { useSound } from "@/hooks/use-sound"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { play } = useSound()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    play("tap")
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      })

      if (result?.error) {
        setError(result.error)
        play("error")
      } else if (result?.ok) {
        play("success")
        router.push("/")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      play("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "microsoft") => {
    play("tap")
    setIsLoading(true)
    try {
      await signIn(provider, { redirect: true, callbackUrl: "/" })
    } catch (error) {
      play("error")
      setError(`Failed to sign in with ${provider}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your MBG account"
    >
      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              required
            />
          </div>
        </motion.div>

        {/* Password Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-12 py-2.5 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Remember & Forgot Password */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-between text-sm"
        >
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-white/20 dark:border-slate-600/20 bg-white/50 dark:bg-slate-700/50 cursor-pointer"
            />
            <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              Remember me
            </span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </motion.div>

        {/* Login Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex items-center gap-3 my-6"
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-600" />
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-600" />
      </motion.div>

      {/* Social Login */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="space-y-3"
      >
        {/* Google Button */}
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/20 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-medium text-slate-900 dark:text-white"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Microsoft Button */}
        <button
          type="button"
          onClick={() => handleSocialLogin("microsoft")}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/20 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-medium text-slate-900 dark:text-white"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#00A4EF" d="M11.4 24H0V12.6h11.4V24z" />
            <path fill="#7FBA00" d="M24 24H12.6V12.6H24V24z" />
            <path fill="#00A4EF" d="M11.4 11.4H0V0h11.4v11.4z" />
            <path fill="#FFB900" d="M24 11.4H12.6V0H24v11.4z" />
          </svg>
          Continue with Microsoft
        </button>
      </motion.div>

      {/* Sign Up Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6"
      >
        Don't have an account?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Create one
        </Link>
      </motion.p>
    </AuthLayout>
  )
}
