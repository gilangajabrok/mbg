'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useSound } from '@/lib/sound-provider'
import { Eye, EyeOff, Mail, Lock, Heart } from 'lucide-react'

export default function ParentLoginPage() {
  const router = useRouter()
  const { playSound } = useSound()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    playSound('press')
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      playSound('success')
      router.push('/parent/dashboard')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-pink-950/20 dark:via-slate-900 dark:to-blue-950/20 flex items-center justify-center p-4">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-pink-200/20 dark:bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glass Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-800/50 p-8 md:p-10">
          {/* Logo & Header */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 dark:from-pink-500 dark:to-pink-700 rounded-2xl mb-4 shadow-lg">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 dark:from-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
              MBG Parent Portal
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Sign in to manage your children's meals
            </p>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="sarah.anderson@email.com"
                  defaultValue="sarah.anderson@email.com"
                  className="pl-10 h-12 bg-white/50 dark:bg-slate-800/50 border-pink-200 dark:border-pink-900/30 focus:border-pink-400 dark:focus:border-pink-600"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  defaultValue="password123"
                  className="pl-10 pr-10 h-12 bg-white/50 dark:bg-slate-800/50 border-pink-200 dark:border-pink-900/30 focus:border-pink-400 dark:focus:border-pink-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    playSound('hover')
                    setShowPassword(!showPassword)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </label>
              </div>
              <Link
                href="/parent/auth/forgot-password"
                className="text-sm text-pink-600 dark:text-pink-400 hover:underline"
                onMouseEnter={() => playSound('hover')}
              >
                Forgot password?
              </Link>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 dark:from-pink-600 dark:to-pink-700 dark:hover:from-pink-700 dark:hover:to-pink-800 text-white font-medium shadow-lg shadow-pink-500/30"
                disabled={loading}
                onMouseEnter={() => playSound('hover')}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/80 dark:bg-slate-900/80 px-2 text-muted-foreground">
                New to MBG?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <Link href="/parent/auth/register">
              <Button
                variant="outline"
                className="w-full h-12 border-pink-200 dark:border-pink-900/30 hover:bg-pink-50 dark:hover:bg-pink-950/20"
                onMouseEnter={() => playSound('hover')}
              >
                Create Parent Account
              </Button>
            </Link>
          </motion.div>

          {/* Footer Note */}
          <p className="text-xs text-center text-muted-foreground mt-6">
            By signing in, you agree to MBG's Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Version Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          MBG Parent Portal v3.0 • Makan Bergizi Gratis
        </motion.p>
      </motion.div>
    </div>
  )
}
