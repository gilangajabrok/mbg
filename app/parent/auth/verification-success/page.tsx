'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSound } from '@/lib/sound-provider'
import { CheckCircle2, Sparkles, Heart } from 'lucide-react'

export default function VerificationSuccessPage() {
  const router = useRouter()
  const { playSound } = useSound()

  useEffect(() => {
    playSound('success')
  }, [playSound])

  const handleContinue = () => {
    playSound('press')
    router.push('/parent/dashboard')
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
        
        {/* Floating Sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * -200],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeOut',
            }}
            style={{
              left: `${30 + Math.random() * 40}%`,
              top: `${40 + Math.random() * 20}%`,
            }}
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Glass Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-800/50 p-8 md:p-12 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-3xl mb-6 shadow-2xl shadow-green-500/30 relative"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
            
            {/* Pulse Rings */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-green-400/30"
              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-3xl bg-green-400/30"
              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-3"
          >
            Welcome to MBG!
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg leading-relaxed mb-8"
          >
            Your account has been successfully verified. You can now start managing your children's nutritious meals and track their health journey.
          </motion.p>

          {/* Feature Highlights */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-pink-50 to-blue-50 dark:from-pink-950/20 dark:to-blue-950/20 rounded-2xl p-6 mb-8 space-y-3 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-pink-500" />
              </div>
              <p className="text-sm font-medium">View daily meal plans for all your children</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-sm font-medium">Track nutrition and delivery status in real-time</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-sm font-medium">Receive important announcements instantly</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={handleContinue}
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium shadow-lg shadow-pink-500/30"
              onMouseEnter={() => playSound('hover')}
            >
              Go to Dashboard
            </Button>
          </motion.div>

          {/* Welcome Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-muted-foreground mt-6"
          >
            Thank you for being part of the MBG family!
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
