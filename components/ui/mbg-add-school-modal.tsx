'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface MBGAddSchoolModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MBGAddSchoolModal({ open, onOpenChange }: MBGAddSchoolModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    district: '',
    students: '',
    email: '',
    principal: '',
  })

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-slate-700/10">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Add New School</h2>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-1 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">School Name</label>
                  <Input
                    placeholder="SDN Jakarta Pusat..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">District</label>
                  <Input
                    placeholder="Central Jakarta"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number of Students</label>
                  <Input
                    type="number"
                    placeholder="450"
                    value={formData.students}
                    onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
                  <Input
                    type="email"
                    placeholder="principal@school.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Principal Name</label>
                  <Input
                    placeholder="Dr. Ahmad Santoso"
                    value={formData.principal}
                    onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-white/10 dark:border-slate-700/10">
                <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => onOpenChange(false)} className="flex-1 bg-blue-500 hover:bg-blue-600">
                  Create School
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
