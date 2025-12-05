'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Building2, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/lib/toast-provider'
import { useMBGSound } from '@/hooks/use-mbg-sound'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  role: 'admin' | 'parent' | 'supplier'
  schoolName?: string
  organizationName?: string
  address: string
}

interface FormErrors {
  [key: string]: string
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'parent',
    schoolName: '',
    organizationName: '',
    address: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [step, setStep] = useState(1)
  const router = useRouter()
  const { toast } = useToast()
  const { playSound } = useMBGSound()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
    return phoneRegex.test(phone)
  }

  const validateStep1 = () => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: FormErrors = {}

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    if (formData.role === 'admin' && !formData.schoolName?.trim()) {
      newErrors.schoolName = 'School name is required'
    }
    if (formData.role === 'supplier' && !formData.organizationName?.trim()) {
      newErrors.organizationName = 'Organization name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      playSound('success')
      setStep(2)
    } else {
      playSound('error')
    }
  }

  const handlePrevStep = () => {
    playSound('buttonPress')
    setStep(1)
    setErrors({})
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep2()) {
      playSound('error')
      return
    }

    playSound('buttonPress')
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      playSound('success')
      toast('Registration successful!', 'success')
      
      // Redirect based on role
      setTimeout(() => {
        if (formData.role === 'parent') {
          router.push('/parent/dashboard')
        } else if (formData.role === 'supplier') {
          router.push('/supplier/dashboard')
        } else {
          router.push('/admin')
        }
      }, 1000)
    } catch (error) {
      playSound('error')
      toast('Registration failed. Please try again.', 'error')
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Join MBG
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Create your account to manage meals and nutrition
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <motion.div
              animate={{
                backgroundColor: step >= 1 ? '#3B82F6' : '#E2E8F0',
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-colors"
            >
              {step > 1 ? <CheckCircle className="w-6 h-6" /> : '1'}
            </motion.div>
            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
            <motion.div
              animate={{
                backgroundColor: step >= 2 ? '#3B82F6' : '#E2E8F0',
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-colors"
            >
              2
            </motion.div>
          </div>

          <form onSubmit={handleRegister}>
            {step === 1 ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                  Personal Information
                </h2>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/20 ${
                          errors.firstName ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    {errors.firstName && (
                      <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                        <AlertCircle className="w-3 h-3" />
                        {errors.firstName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/20 ${
                          errors.lastName ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    {errors.lastName && (
                      <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                        <AlertCircle className="w-3 h-3" />
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/20 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/20 ${
                        errors.phone ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </div>
                  )}
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                    Account Type *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'parent', label: 'Parent', icon: User },
                      { value: 'admin', label: 'Admin', icon: Building2 },
                      { value: 'supplier', label: 'Supplier', icon: Building2 },
                    ].map(({ value, label, icon: Icon }) => (
                      <motion.button
                        key={value}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleInputChange('role', value)}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          formData.role === value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                            : 'border-white/20 dark:border-slate-700/20 bg-white/30 dark:bg-slate-800/30 hover:border-blue-300 dark:hover:border-blue-400/30'
                        }`}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2 text-slate-700 dark:text-slate-200" />
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{label}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Next Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Continue
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                  Security & Details
                </h2>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`pl-10 pr-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/20 ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </div>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Minimum 8 characters recommended
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`pl-10 pr-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/20 ${
                        errors.confirmPassword ? 'border-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* Address Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="123 Main Street, City, State"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/20 ${
                        errors.address ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.address && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-3 h-3" />
                      {errors.address}
                    </div>
                  )}
                </div>

                {/* School Name (Admin only) */}
                {formData.role === 'admin' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      School Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="e.g., Lincoln High School"
                        value={formData.schoolName || ''}
                        onChange={(e) => handleInputChange('schoolName', e.target.value)}
                        className={`pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/20 ${
                          errors.schoolName ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    {errors.schoolName && (
                      <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                        <AlertCircle className="w-3 h-3" />
                        {errors.schoolName}
                      </div>
                    )}
                  </div>
                )}

                {/* Organization Name (Supplier only) */}
                {formData.role === 'supplier' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Organization Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="e.g., Fresh Foods Inc."
                        value={formData.organizationName || ''}
                        onChange={(e) => handleInputChange('organizationName', e.target.value)}
                        className={`pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/20 ${
                          errors.organizationName ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    {errors.organizationName && (
                      <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                        <AlertCircle className="w-3 h-3" />
                        {errors.organizationName}
                      </div>
                    )}
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                  <input type="checkbox" className="mt-1 rounded" defaultChecked />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    I agree to the{' '}
                    <Link href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                      Privacy Policy
                    </Link>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-semibold py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-white/10 dark:border-slate-700/10 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold">
              Sign in here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
