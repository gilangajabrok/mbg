"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Upload, Search, Download, Eye, Trash2, Filter } from "lucide-react"
import { useSound } from "@/lib/sound-provider"

const documents = [
  {
    id: "DOC001",
    name: "School Registration Form - SDN Menteng 01",
    category: "registration",
    date: "2025-01-15",
    size: "1.2 MB",
  },
  {
    id: "DOC002",
    name: "Supplier Contract - Berkah Catering",
    category: "contract",
    date: "2025-01-14",
    size: "2.8 MB",
  },
  { id: "DOC003", name: "Quality Inspection Certificate", category: "certificate", date: "2025-01-13", size: "856 KB" },
  { id: "DOC004", name: "Monthly Budget Report - January", category: "financial", date: "2025-01-12", size: "3.4 MB" },
  { id: "DOC005", name: "Parent Consent Forms - Batch 1", category: "consent", date: "2025-01-11", size: "4.2 MB" },
]

export default function AdminDocumentsPage() {
  const { playSound } = useSound()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground mt-1">Manage system documents and files</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playSound("click")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Document
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onFocus={() => playSound("hover")}
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  playSound("click")
                  setSelectedCategory(e.target.value)
                }}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
              >
                <option value="all">All Categories</option>
                <option value="registration">Registration</option>
                <option value="contract">Contracts</option>
                <option value="certificate">Certificates</option>
                <option value="financial">Financial</option>
                <option value="consent">Consent Forms</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{doc.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-muted-foreground">{doc.date}</p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">{doc.size}</p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 font-medium">
                        {doc.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => playSound("click")}
                    className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                    title="View"
                  >
                    <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => playSound("click")}
                    className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => playSound("click")}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
  )
}
