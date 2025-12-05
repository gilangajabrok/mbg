"use client"

import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { AuthLayout } from "@/components/layout/auth-layout"
import { useSound } from "@/hooks/use-sound"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const { play } = useSound()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Calculate password strength
    if (name === "password") {
      let strength = 0
      if (value.length >= 8) strength++
      if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++
      if (/\d/.test(value)) strength++
      if (/[^a-zA-Z\d]/.test(value)) strength++
      setPasswordStrength(strength)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreeTerms) {
      play("error")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      play("error")
      return
    }

    play("tap")
    setIsLoading(true)
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false)
      play("success")
    }, 1500)
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "bg-red-500"
      case 2:
        return "bg-yellow-500"
      case 3:
        return "bg-blue-500"
      case 4:
        return "bg-green-500"
      default:
        return "bg-slate-300"
    }
  }

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "Weak"
      case 2:
        return "Fair"
      case 3:
        return "Good"
      case 4:
        return "Strong"
      default:
        return ""
    }
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join MBG Platform"
    >
      {/* Register Form */}
      <form onSubmit={handleRegister} className="space-y-4">
        {/* Name Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              required
            />
          </div>
        </motion.div>

        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
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
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
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

          {/* Password Strength Indicator */}
          {formData.password && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getPasswordStrengthColor()}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {getPasswordStrengthLabel()}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Use 8+ characters, mix of letters, numbers & symbols
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Confirm Password Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-enter your password"
              className="w-full pl-10 pr-12 py-2.5 bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-2 text-xs font-medium"
            >
              {formData.password === formData.confirmPassword ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">Passwords match</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-600 dark:text-red-400">Passwords don't match</span>
                </>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Terms & Conditions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <label className="flex items-start gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 dark:border-slate-600/20 bg-white/50 dark:bg-slate-700/50 cursor-pointer mt-0.5"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              I agree to the{" "}
              <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
        </motion.div>

        {/* Register Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={
            isLoading ||
            !agreeTerms ||
            formData.password !== formData.confirmPassword
          }
          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            "Create Account"
          )}
        </motion.button>
      </form>

      {/* Sign In Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6"
      >
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Sign in
        </Link>
      </motion.p>
    </AuthLayout>
  )
}
