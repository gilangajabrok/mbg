"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Send, Bot, User, Phone, Mail, Clock, FileText, Search, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSound } from "@/hooks/use-sound"

type Message = {
  id: string
  sender: "user" | "bot" | "agent"
  content: string
  timestamp: Date
}

const faqTopics = [
  { id: "meal-plan", label: "Meal Plans", count: 12 },
  { id: "delivery", label: "Delivery", count: 8 },
  { id: "allergies", label: "Allergies", count: 15 },
  { id: "payment", label: "Payment", count: 6 },
  { id: "account", label: "Account", count: 9 },
]

const commonQuestions = [
  "How do I update my child's allergies?",
  "When will my next delivery arrive?",
  "How do I change my meal plan?",
  "What if my child doesn't like a meal?",
]

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      content:
        "Hello! I'm here to help. You can ask me questions or connect with our support team. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { playSound } = useSound()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = (message: string = inputMessage) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInputMessage("")
    playSound("click")

    // Simulate bot response
    setIsTyping(true)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content:
          "I understand your question. Let me connect you with a support agent who can help you better. Please hold on...",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
      playSound("success")

      // Simulate agent joining
      setTimeout(() => {
        const agentMessage: Message = {
          id: (Date.now() + 2).toString(),
          sender: "agent",
          content:
            "Hi! I'm Sarah from MBG Support. I've reviewed your question and I'm here to help. What would you like to know?",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, agentMessage])
        playSound("notification")
      }, 2000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm">
          <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-balance">Support Center</h1>
          <p className="text-muted-foreground">We're here to help you 24/7</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat Interface */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card className="border-blue-200/50 bg-gradient-to-br from-white/80 to-blue-50/30 backdrop-blur-sm dark:border-blue-900/30 dark:from-gray-900/80 dark:to-blue-950/20">
            <div className="flex h-[600px] flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-blue-200/50 p-4 dark:border-blue-900/30">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />
                  </div>
                  <div>
                    <p className="font-semibold">MBG Support</p>
                    <p className="text-xs text-muted-foreground">Online • Avg. response 2 min</p>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">Active</Badge>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[80%] items-start gap-2 ${
                          message.sender === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            message.sender === "user"
                              ? "bg-pink-500"
                              : message.sender === "agent"
                                ? "bg-blue-600"
                                : "bg-gray-400"
                          }`}
                        >
                          {message.sender === "user" ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div>
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              message.sender === "user"
                                ? "bg-pink-500 text-white"
                                : message.sender === "agent"
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="rounded-2xl bg-gray-100 px-4 py-2 dark:bg-gray-800">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0 }}
                          className="h-2 w-2 rounded-full bg-gray-400"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2 }}
                          className="h-2 w-2 rounded-full bg-gray-400"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4 }}
                          className="h-2 w-2 rounded-full bg-gray-400"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-blue-200/50 p-4 dark:border-blue-900/30">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => playSound("click")}>
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Questions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-gray-200/50 bg-gradient-to-br from-white/80 to-gray-50/30 backdrop-blur-sm dark:border-gray-700/30 dark:from-gray-900/80 dark:to-gray-800/20">
              <div className="p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Quick Questions
                </h3>
                <div className="space-y-2">
                  {commonQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSendMessage(question)}
                      className="w-full rounded-lg border border-gray-200 bg-white/50 p-2 text-left text-sm hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* FAQ Topics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-gray-200/50 bg-gradient-to-br from-white/80 to-purple-50/30 backdrop-blur-sm dark:border-gray-700/30 dark:from-gray-900/80 dark:to-purple-950/20">
              <div className="p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  FAQ Topics
                </h3>
                <div className="space-y-2">
                  {faqTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white/50 p-2 text-sm dark:border-gray-700 dark:bg-gray-800/50"
                    >
                      <span>{topic.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {topic.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-gray-200/50 bg-gradient-to-br from-white/80 to-green-50/30 backdrop-blur-sm dark:border-gray-700/30 dark:from-gray-900/80 dark:to-green-950/20">
              <div className="p-4 space-y-3">
                <h3 className="font-semibold">Other Ways to Reach Us</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-xs text-muted-foreground">1-800-MBG-CARE</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-xs text-muted-foreground">support@mbg.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium">Hours</p>
                      <p className="text-xs text-muted-foreground">24/7 Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
