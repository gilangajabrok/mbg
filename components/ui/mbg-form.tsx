'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface MBGFormProps {
  onSubmit: (e: React.FormEvent) => void
  children: ReactNode
  className?: string
}

export function MBGForm({ onSubmit, children, className = '' }: MBGFormProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {children}
    </form>
  )
}

interface MBGFormFieldProps {
  label: string
  children: ReactNode
  required?: boolean
}

export function MBGFormField({ label, children, required }: MBGFormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

interface MBGInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  floating?: boolean
}

export function MBGInput({ floating, className = '', ...props }: MBGInputProps) {
  return (
    <motion.input
      whileFocus={{ scale: 1.01 }}
      className={`w-full px-4 py-2.5 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white/80 dark:focus:bg-slate-800/80 focus:border-blue-500/50 transition-all ${className}`}
      {...props}
    />
  )
}

interface MBGSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function MBGSelect({ className = '', ...props }: MBGSelectProps) {
  return (
    <select
      className={`w-full px-4 py-2.5 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20 text-slate-900 dark:text-white focus:outline-none focus:bg-white/80 dark:focus:bg-slate-800/80 focus:border-blue-500/50 transition-all ${className}`}
      {...props}
    />
  )
}

interface MBGToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function MBGToggle({ checked, onChange, label }: MBGToggleProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onChange(!checked)}
      animate={{ backgroundColor: checked ? 'rgb(59, 130, 246)' : 'rgb(226, 232, 240)' }}
      className="relative w-14 h-7 rounded-full transition-colors"
    >
      <motion.div
        animate={{ x: checked ? 28 : 4 }}
        className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
      />
      {label && <span className="ml-2">{label}</span>}
    </motion.button>
  )
}

interface MBGSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  isLoading?: boolean
}

export function MBGSubmitButton({ children, isLoading, ...props }: MBGSubmitButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={isLoading}
      className="w-full px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-medium transition-colors"
      {...props}
    >
      {isLoading ? 'Processing...' : children}
    </motion.button>
  )
}
