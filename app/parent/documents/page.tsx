"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Download, Eye, Calendar, Filter, Search, File, FileImage, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSound } from "@/hooks/use-sound"

type Document = {
  id: number
  name: string
  type: string
  category: string
  date: string
  size: string
  icon: typeof FileText
}

const documents: Document[] = [
  {
    id: 1,
    name: "January 2025 Invoice",
    type: "PDF",
    category: "Invoice",
    date: "2025-01-15",
    size: "124 KB",
    icon: File,
  },
  {
    id: 2,
    name: "Meal Plan - Week 3",
    type: "PDF",
    category: "Meal Plan",
    date: "2025-01-12",
    size: "356 KB",
    icon: FileText,
  },
  {
    id: 3,
    name: "December 2024 Invoice",
    type: "PDF",
    category: "Invoice",
    date: "2024-12-15",
    size: "118 KB",
    icon: File,
  },
  {
    id: 4,
    name: "Nutrition Report - Emma",
    type: "PDF",
    category: "Report",
    date: "2025-01-10",
    size: "245 KB",
    icon: FileSpreadsheet,
  },
  {
    id: 5,
    name: "Allergy Certificate - Emma",
    type: "PDF",
    category: "Medical",
    date: "2024-11-20",
    size: "87 KB",
    icon: FileText,
  },
  {
    id: 6,
    name: "Registration Form",
    type: "PDF",
    category: "Registration",
    date: "2024-09-01",
    size: "203 KB",
    icon: FileText,
  },
  {
    id: 7,
    name: "Delivery Photo - Jan 14",
    type: "JPG",
    category: "Delivery",
    date: "2025-01-14",
    size: "1.2 MB",
    icon: FileImage,
  },
  {
    id: 8,
    name: "Meal Plan - Week 2",
    type: "PDF",
    category: "Meal Plan",
    date: "2025-01-05",
    size: "342 KB",
    icon: FileText,
  },
]

const categories = ["All", "Invoice", "Meal Plan", "Report", "Medical", "Registration", "Delivery"]

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { playSound } = useSound()

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDownload = (docName: string) => {
    playSound("success")
    // Simulate download
    console.log(`[v0] Downloading: ${docName}`)
  }

  const handleView = (docName: string) => {
    playSound("click")
    // Simulate view
    console.log(`[v0] Viewing: ${docName}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm">
          <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-balance">Documents & Files</h1>
          <p className="text-muted-foreground">Access all your important documents</p>
        </div>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-purple-200/50 bg-gradient-to-br from-white/80 to-purple-50/30 backdrop-blur-sm dark:border-purple-900/30 dark:from-gray-900/80 dark:to-purple-950/20">
          <div className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Documents Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card className="border-gray-200/50 bg-gradient-to-br from-white/80 to-gray-50/30 backdrop-blur-sm hover:shadow-lg transition-shadow dark:border-gray-700/30 dark:from-gray-900/80 dark:to-gray-800/20">
              <div className="p-4 space-y-4">
                {/* Document Icon & Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10">
                    <doc.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {doc.type}
                  </Badge>
                </div>

                {/* Document Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold line-clamp-2">{doc.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(doc.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {doc.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{doc.size}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleView(doc.name)}
                  >
                    <Eye className="mr-2 h-3 w-3" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
                    onClick={() => handleDownload(doc.name)}
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <p className="text-lg font-semibold text-muted-foreground">No documents found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  )
}
