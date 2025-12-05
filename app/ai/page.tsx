'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2 } from 'lucide-react'
import { mbgMotion } from '@/lib/mbg-motion'
import { useMBGSound } from '@/hooks/use-mbg-sound'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI Assistant. How can I help you with your dashboard today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { playSound } = useMBGSound()

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    playSound('buttonPress')

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I can help you analyze your dashboard data, create reports, and answer questions about your metrics. What would you like to know?',
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
      playSound('success')
    }, 800)
  }

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
      className="flex flex-col h-[calc(100vh-120px)]"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Assistant</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Get insights and help with your data</p>
      </motion.div>

      {/* Chat Container */}
      <motion.div
        variants={itemVariants}
        className="flex-1 bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6 flex flex-col shadow-lg"
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`max-w-xs px-4 py-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white border border-white/10 dark:border-slate-600/10'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user'
                      ? 'text-white/60'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </motion.div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white px-4 py-3 rounded-lg border border-white/10 dark:border-slate-600/10"
                >
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p className="text-sm">AI is thinking...</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 pt-4 border-t border-white/10 dark:border-slate-700/10"
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white/80 dark:focus:bg-slate-800/80 focus:border-blue-500/50 transition-all disabled:opacity-50"
          />
          <motion.button
            {...mbgMotion.buttonPressDepress}
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-medium flex items-center gap-2 transition-colors disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Info */}
      <motion.div
        variants={itemVariants}
        className="mt-4 text-xs text-slate-600 dark:text-slate-400 text-center space-y-1"
      >
        <p>Press Enter to send, Shift+Enter for new line</p>
      </motion.div>
    </motion.div>
  )
}
