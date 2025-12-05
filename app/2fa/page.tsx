'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function TwoFactorAuthPage() {
  const [step, setStep] = useState(1)
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)
  const qrCode = 'https://dummyimage.com/300x300/3b82f6/ffffff?text=QR+Code'
  const secret = 'JBSWY3DPEBLW64TMMQ======'

  const copySecret = () => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Setup 2FA</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Add an extra layer of security to your account</p>
      </motion.div>

      {/* Step Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4 mb-8"
      >
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1">
            <div className={`h-2 rounded-full transition-colors ${
              s <= step ? 'bg-blue-500' : 'bg-white/20 dark:bg-slate-700/20'
            }`} />
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 text-center">
              {s === 1 ? 'Scan QR' : s === 2 ? 'Enter Code' : 'Confirm'}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-8"
      >
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Step 1: Scan QR Code</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Use an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator to scan this QR code.
              </p>
            </div>

            <div className="flex justify-center">
              <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="w-64 h-64 rounded-lg border-2 border-white/20 dark:border-slate-700/20" />
            </div>

            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Or enter this code manually:</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-white/50 dark:bg-slate-700/50 rounded-lg p-3 font-mono text-sm text-slate-900 dark:text-white break-all">
                  {secret}
                </div>
                <button
                  onClick={copySecret}
                  className="p-3 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button onClick={() => setStep(2)} className="w-full bg-blue-500 hover:bg-blue-600">
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Step 2: Verify Code</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Enter the 6-digit code from your authenticator app to verify setup.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Verification Code
              </label>
              <Input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest bg-white/50 dark:bg-slate-700/50"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={code.length !== 6} className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50">
                Verify & Enable
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">2FA Enabled!</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Your account is now protected with two-factor authentication.
              </p>
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
              Done
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
