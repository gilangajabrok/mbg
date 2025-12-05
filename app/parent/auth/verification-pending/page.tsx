'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSound } from '@/lib/sound-provider'
import { Clock, Mail, CheckCircle2, Heart } from 'lucide-react'

export default function VerificationPendingPage() {
  const { playSound } = useSound()

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
        className="w-full max-w-lg relative z-10"
      >
        {/* Glass Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-800/50 p-8 md:p-12 text-center">
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 rounded-3xl mb-6 shadow-2xl shadow-amber-500/30"
          >
            <Clock className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-foreground mb-3"
          >
            Account Under Review
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg leading-relaxed mb-8"
          >
            Thank you for registering! Your account is currently being verified by our team to ensure the safety of all children in the MBG program.
          </motion.p>

          {/* Status Steps */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 text-left space-y-4"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Account Created</p>
                <p className="text-xs text-muted-foreground">Your registration has been received</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Document Verification</p>
                <p className="text-xs text-muted-foreground">Our team is reviewing your information</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Email Confirmation</p>
                <p className="text-xs text-muted-foreground">You'll receive an email once approved</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <p className="text-sm text-muted-foreground">
              Verification typically takes 24-48 hours. Check your email for updates.
            </p>
            
            <Link href="/parent/auth/login">
              <Button
                variant="outline"
                className="border-pink-200 dark:border-pink-900/30 hover:bg-pink-50 dark:hover:bg-pink-950/20"
                onMouseEnter={() => playSound('hover')}
              >
                Back to Login
              </Button>
            </Link>
          </motion.div>

          {/* Support Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 pt-6 border-t border-border"
          >
            <p className="text-xs text-muted-foreground">
              Need help?{' '}
              <a href="mailto:support@mbg.gov.id" className="text-pink-600 dark:text-pink-400 hover:underline">
                Contact Support
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
