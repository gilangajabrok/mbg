"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Star, Send, Upload, X, MessageCircle, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useSound } from "@/hooks/use-sound"

const categories = [
  { id: "meal-quality", label: "Meal Quality", icon: Heart },
  { id: "delivery", label: "Delivery Service", icon: MessageCircle },
  { id: "app", label: "App Experience", icon: ThumbsUp },
  { id: "support", label: "Support", icon: MessageCircle },
  { id: "other", label: "Other", icon: MessageCircle },
]

const recentFeedback = [
  {
    id: 1,
    date: "2025-01-15",
    category: "Meal Quality",
    rating: 5,
    comment: "Emma loved the quinoa bowl! Great portion size.",
    response: "Thank you for the positive feedback! We're thrilled Emma enjoyed it.",
    status: "Responded",
  },
  {
    id: 2,
    date: "2025-01-10",
    category: "Delivery Service",
    rating: 4,
    comment: "Delivery was on time but packaging could be better.",
    response: null,
    status: "Under Review",
  },
]

export default function FeedbackPage() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const { toast } = useToast()
  const { playSound } = useSound()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCategory || rating === 0 || !comment) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    playSound("success")
    toast({
      title: "Feedback Submitted!",
      description: "Thank you for helping us improve. We'll review your feedback soon.",
    })

    // Reset form
    setSelectedCategory("")
    setRating(0)
    setComment("")
    setAttachments([])
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setAttachments([...attachments, ...files])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm">
          <MessageCircle className="h-6 w-6 text-pink-600 dark:text-pink-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-balance">Share Your Feedback</h1>
          <p className="text-muted-foreground">Help us improve your MBG experience</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Feedback Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card className="border-pink-200/50 bg-gradient-to-br from-white/80 to-pink-50/30 backdrop-blur-sm dark:border-pink-900/30 dark:from-gray-900/80 dark:to-pink-950/20">
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Select Category *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <motion.button
                        key={category.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedCategory(category.id)
                          playSound("click")
                        }}
                        className={`flex items-center gap-2 rounded-lg border-2 p-3 transition-colors ${
                          selectedCategory === category.id
                            ? "border-pink-500 bg-pink-50 dark:border-pink-600 dark:bg-pink-950/30"
                            : "border-gray-200 hover:border-pink-300 dark:border-gray-700 dark:hover:border-pink-800"
                        }`}
                      >
                        <category.icon className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        <span className="text-sm font-medium">{category.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Overall Rating *</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setRating(star)
                          playSound("click")
                        }}
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-3">
                  <Label htmlFor="comment" className="text-base font-semibold">
                    Your Feedback *
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder="Tell us about your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-32 resize-none"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Attachments (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photos
                    </Button>
                    <span className="text-sm text-muted-foreground">{attachments.length} file(s) selected</span>
                  </div>
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
                          <span className="text-sm">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>

        {/* Recent Feedback History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold">Your Recent Feedback</h2>
          {recentFeedback.map((feedback, index) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="border-gray-200/50 bg-gradient-to-br from-white/80 to-blue-50/30 backdrop-blur-sm dark:border-gray-700/30 dark:from-gray-900/80 dark:to-blue-950/20">
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{feedback.category}</Badge>
                    <span className="text-xs text-muted-foreground">{feedback.date}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{feedback.comment}</p>
                  <Badge
                    variant={feedback.response ? "default" : "secondary"}
                    className={feedback.response ? "bg-green-500/10 text-green-700 dark:text-green-400" : ""}
                  >
                    {feedback.status}
                  </Badge>
                  {feedback.response && (
                    <div className="rounded-lg bg-blue-50/50 p-3 dark:bg-blue-950/20">
                      <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">MBG Response:</p>
                      <p className="text-xs text-blue-800 dark:text-blue-400 mt-1">{feedback.response}</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
