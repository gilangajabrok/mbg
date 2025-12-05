"use client"

import { motion } from "framer-motion"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { AuthLayout } from "@/components/layout/auth-layout"
import { useSound } from "@/hooks/use-sound"

type ForgotPasswordStep = "email" | "verify" | "reset" | "success"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<ForgotPasswordStep>("email")
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { play } = useSound()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    play("tap")
    setIsLoading(true)
    // Simulate sending verification email
    setTimeout(() => {
      setIsLoading(false)
      play("success")
      setStep("verify")
    }, 1500)
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    play("tap")
    setIsLoading(true)
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false)
      play("success")
      setStep("reset")
    }, 1500)
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      play("error")
      return
    }
    play("tap")
    setIsLoading(true)
    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false)
      play("success")
      setStep("success")
    }, 1500)
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Recover your MBG account access"
    >
      {/* Step 1: Email Entry */}
      {step === "email" && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onSubmit={handleEmailSubmit}
          className="space-y-5"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
              Enter your email address and we'll send you a verification code to reset your password.
            </p>
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

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending code...
              </span>
            ) : (
              "Send Verification Code"
            )}
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </motion.div>
        </motion.form>
      )}

      {/* Step 2: Verification Code */}
      {step === "verify" && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onSubmit={handleVerificationSubmit}
          className="space-y-5"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
              We've sent a verification code to <strong>{email}</strong>. Enter it below.
            </p>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-center text-2xl tracking-widest font-mono"
              required
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || verificationCode.length < 6}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              "Verify Code"
            )}
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center text-xs text-slate-600 dark:text-slate-400"
          >
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={() => play("tap")}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Resend
            </button>
          </motion.div>
        </motion.form>
      )}

      {/* Step 3: Reset Password */}
      {step === "reset" && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onSubmit={handleResetSubmit}
          className="space-y-5"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
              Enter your new password below.
            </p>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Create a strong password"
              className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              required
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={
              isLoading || newPassword !== confirmPassword || !newPassword
            }
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </motion.form>
      )}

      {/* Step 4: Success */}
      {step === "success" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-5"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all hover:scale-105"
            >
              Return to Login
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AuthLayout>
  )
}
