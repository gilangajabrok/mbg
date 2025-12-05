'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { mbgMotion } from '@/lib/mbg-motion'
import { useMBGSound } from '@/hooks/use-mbg-sound'

const PLANS = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for getting started',
    features: ['Up to 5 projects', '5GB storage', 'Basic support', 'Team collaboration'],
    current: false,
  },
  {
    name: 'Professional',
    price: '$79',
    period: '/month',
    description: 'Most popular for teams',
    features: ['Unlimited projects', '100GB storage', 'Priority support', 'Advanced analytics', 'API access'],
    current: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For large organizations',
    features: ['Everything in Pro', 'Unlimited storage', '24/7 support', 'Custom integrations', 'Dedicated account manager'],
    current: false,
  },
]

export default function BillingPage() {
  const { playSound } = useMBGSound()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Billing & Subscription</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your plan and billing information</p>
      </motion.div>

      {/* Current Plan */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 dark:from-blue-500/10 dark:to-blue-600/10 rounded-2xl border border-blue-500/30 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Current Plan: Professional</h3>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Your subscription renews on April 15, 2024</p>
          <motion.button
            {...mbgMotion.buttonPressDepress}
            onClick={() => playSound('buttonPress')}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
          >
            Manage Subscription
          </motion.button>
        </div>
      </motion.div>

      {/* Pricing Plans */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {PLANS.map((plan) => (
          <motion.div key={plan.name} variants={itemVariants} {...mbgMotion.cardFloatHover}>
            <div className={`bg-gradient-to-br rounded-2xl border p-6 transition-all ${
              plan.current
                ? 'from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 border-blue-500/50 ring-2 ring-blue-500/20'
                : 'from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 border-white/20 dark:border-slate-700/20'
            }`}>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">{plan.period}</span>
              </div>

              <motion.button
                {...mbgMotion.buttonPressDepress}
                onClick={() => playSound('buttonPress')}
                className={`w-full px-4 py-2.5 rounded-lg font-medium mb-6 transition-colors ${
                  plan.current
                    ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </motion.button>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
