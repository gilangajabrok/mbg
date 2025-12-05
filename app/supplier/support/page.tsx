'use client'

import { motion } from 'framer-motion'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { dummySupplierSupport } from '@/lib/mbg-dummy-data'
import { MessageSquare, Send, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useMBGSound } from '@/hooks/use-mbg-sound'

const FAQS = [
  {
    question: 'How do I submit a new order?',
    answer: 'You can submit orders through the Orders page. Click "New Order" and fill in the required details including school, items, and delivery date.',
  },
  {
    question: 'What documents do I need to upload?',
    answer: 'You need to upload: Business License, Health Certificate, Insurance Certificate, and Food Safety Audit report.',
  },
  {
    question: 'How is my performance score calculated?',
    answer: 'Your performance score is based on delivery success rate, on-time performance, quality ratings, and customer satisfaction.',
  },
  {
    question: 'What are the payment terms?',
    answer: 'Payment is typically made on a monthly basis. Invoices are sent on the 1st of each month for the previous month\'s deliveries.',
  },
  {
    question: 'How do I dispute a delivery issue?',
    answer: 'You can file a dispute through the Support page. Provide details and supporting evidence. Our team will review within 24 hours.',
  },
]

export default function SupportPage() {
  const [issueTitle, setIssueTitle] = useState('')
  const [issueDescription, setIssueDescription] = useState('')
  const [issueCategory, setIssueCategory] = useState('general')
  const { playSound } = useMBGSound()

  const handleSubmitIssue = () => {
    playSound('success')
    setIssueTitle('')
    setIssueDescription('')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Support Center</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Get help and contact our support team</p>
      </div>

      {/* Submit Issue Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-6"
      >
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Submit an Issue
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
            <select
              value={issueCategory}
              onChange={(e) => setIssueCategory(e.target.value)}
              onClick={() => playSound('click')}
              className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            >
              <option value="general">General Inquiry</option>
              <option value="order">Order Issues</option>
              <option value="delivery">Delivery Problems</option>
              <option value="quality">Product Quality</option>
              <option value="payment">Payment Questions</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Issue Title</label>
            <input
              type="text"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              onClick={() => playSound('click')}
              placeholder="Briefly describe your issue..."
              className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
            <textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              onClick={() => playSound('click')}
              placeholder="Provide detailed information..."
              rows={4}
              className="w-full bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-700/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmitIssue}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg"
          >
            <Send className="w-5 h-5" />
            Submit Issue
          </motion.button>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 p-6"
      >
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {FAQS.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`} className="border-0">
              <AccordionTrigger className="px-4 py-3 rounded-lg bg-white/50 dark:bg-slate-700/30 hover:bg-white/70 dark:hover:bg-slate-700/50 transition-colors text-left font-semibold text-slate-900 dark:text-white">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-slate-600 dark:text-slate-400 text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-500/20 rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Need immediate assistance?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Contact our support team at support@mbg-portal.id or call +62-21-XXXX-XXXX</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
