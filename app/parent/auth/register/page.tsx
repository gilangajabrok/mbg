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
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Heart, ArrowLeft } from 'lucide-react'

export default function ParentRegisterPage() {
  const router = useRouter()
  const { playSound } = useSound()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    playSound('press')
    setStep(2)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    playSound('press')
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      playSound('success')
      router.push('/parent/auth/verification-pending')
    }, 2000)
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
            className="text-center mb-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 dark:from-pink-500 dark:to-pink-700 rounded-2xl mb-4 shadow-lg">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 dark:from-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-muted-foreground mt-2">
              Join MBG to manage your children's nutrition
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`h-1.5 w-16 rounded-full transition-colors ${step >= 1 ? 'bg-pink-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            <div className={`h-1.5 w-16 rounded-full transition-colors ${step >= 2 ? 'bg-pink-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          </div>

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <motion.form
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onSubmit={handleNextStep}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Sarah Anderson"
                    className="pl-10 h-12 bg-white/50 dark:bg-slate-800/50 border-pink-200 dark:border-pink-900/30"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="sarah.anderson@email.com"
                    className="pl-10 h-12 bg-white/50 dark:bg-slate-800/50 border-pink-200 dark:border-pink-900/30"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+62 812-3456-7890"
                    className="pl-10 h-12 bg-white/50 dark:bg-slate-800/50 border-pink-200 dark:border-pink-900/30"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="Jl. Melati No. 123, Jakarta"
                    className="pl-10 h-12 bg-white/50 dark:bg-slate-800/50 border-pink-200 dark:border-pink-900/30"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium shadow-lg shadow-pink-500/30 mt-6"
                onMouseEnter={() => playSound('hover')}
              >
                Continue
              </Button>
            </motion.form>
          )}

          {/* Step 2: Security */}
          {step === 2 && (
            <motion.form
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep(1)}
                className="mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 bg-white/50 dark:bg-slate-800/50 border-pink-200 dark:border-pink-900/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 bg-white/50 dark:bg-slate-800/50 border-pink-200 dark:border-pink-900/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox id="terms" required />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the{' '}
                  <Link href="#" className="text-pink-600 dark:text-pink-400 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-pink-600 dark:text-pink-400 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium shadow-lg shadow-pink-500/30 mt-6"
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
                  'Create Account'
                )}
              </Button>
            </motion.form>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/parent/auth/login"
              className="text-pink-600 dark:text-pink-400 hover:underline font-medium"
              onMouseEnter={() => playSound('hover')}
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
