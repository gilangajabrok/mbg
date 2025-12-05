'use client'

import { motion } from 'framer-motion'
import { dummySupplierDocuments } from '@/lib/mbg-dummy-data'
import { FileText, Upload, CheckCircle, Clock } from 'lucide-react'
import { useMBGSound } from '@/hooks/use-mbg-sound'

const STATUS_COLORS: Record<string, string> = {
  verified: 'bg-green-500/20 text-green-700 dark:text-green-400',
  pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DocumentsPage() {
  const { playSound } = useMBGSound()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Documents</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Upload and manage verification documents</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => playSound('success')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg"
        >
          <Upload className="w-5 h-5" />
          Upload Document
        </motion.button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummySupplierDocuments.map((doc, idx) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{doc.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Uploaded {doc.uploadDate}</p>
                </div>
              </div>
              <span className={cn('px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1', STATUS_COLORS[doc.status])}>
                {doc.status === 'verified' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Type:</span>
                <span className="text-slate-900 dark:text-white font-semibold">{doc.type.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Expiry:</span>
                <span className="text-slate-900 dark:text-white font-semibold">{doc.expiryDate}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-white/10 dark:border-slate-700/10">
              <button
                onClick={() => playSound('click')}
                className="flex-1 px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 dark:text-blue-400 text-sm font-semibold transition-colors"
              >
                Download
              </button>
              <button
                onClick={() => playSound('click')}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-500/20 hover:bg-slate-500/30 text-slate-700 dark:text-slate-400 text-sm font-semibold transition-colors"
              >
                Replace
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
