"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSound } from "@/lib/sound-provider"
import { Megaphone, Search, Filter, Calendar, AlertCircle, X, ChevronRight } from "lucide-react"
import { dummyAnnouncements } from "@/lib/data/parent-dummy-data"

export default function AnnouncementsPage() {
  const { playSound } = useSound()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)

  const filteredAnnouncements = dummyAnnouncements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || announcement.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const urgentAnnouncements = filteredAnnouncements.filter((a) => a.urgent)

  return (
    <>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Announcements</h1>
        <p className="text-muted-foreground">Stay updated with important news from school and MBG</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/50 dark:bg-slate-900/50 border-pink-200/30 dark:border-pink-900/30"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="bg-white/50 dark:bg-slate-900/50 border-pink-200/30 dark:border-pink-900/30">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="School">School</SelectItem>
            <SelectItem value="MBG HQ">MBG HQ</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Urgent Announcements Banner */}
      {urgentAnnouncements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="p-5 bg-gradient-to-r from-red-500/10 to-amber-500/10 dark:from-red-500/20 dark:to-amber-500/20 border-red-200/30 dark:border-red-900/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1">Urgent Announcements</h3>
                <p className="text-sm text-muted-foreground">
                  You have {urgentAnnouncements.length} urgent{" "}
                  {urgentAnnouncements.length === 1 ? "announcement" : "announcements"} requiring your attention
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement, index) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ x: 4 }}
          >
            <Card
              className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30 hover:shadow-xl transition-all cursor-pointer"
              onClick={() => {
                setSelectedAnnouncement(announcement)
                playSound("press")
              }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    announcement.urgent
                      ? "bg-gradient-to-br from-red-400 to-red-600"
                      : announcement.category === "School"
                        ? "bg-gradient-to-br from-blue-400 to-blue-600"
                        : "bg-gradient-to-br from-purple-400 to-purple-600"
                  }`}
                >
                  <Megaphone className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-lg pr-4">{announcement.title}</h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{announcement.content}</p>

                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge
                      variant="outline"
                      className={
                        announcement.category === "School"
                          ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 border-blue-200"
                          : "bg-purple-50 dark:bg-purple-950/20 text-purple-600 border-purple-200"
                      }
                    >
                      {announcement.category}
                    </Badge>

                    {announcement.urgent && (
                      <Badge variant="destructive" className="bg-red-500/20 text-red-700 border-red-200">
                        Urgent
                      </Badge>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{announcement.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Image */}
              {announcement.image && (
                <div className="mt-4 rounded-xl overflow-hidden">
                  <img
                    src={announcement.image || "/placeholder.svg"}
                    alt={announcement.title}
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAnnouncements.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-pink-400/20 to-blue-400/20 flex items-center justify-center">
            <Megaphone className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No announcements found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </motion.div>
      )}

      {/* Announcement Detail Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAnnouncement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-200/30 dark:border-pink-900/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header Image */}
              {selectedAnnouncement.image && (
                <div className="relative h-64 overflow-hidden rounded-t-3xl">
                  <img
                    src={selectedAnnouncement.image || "/placeholder.svg"}
                    alt={selectedAnnouncement.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedAnnouncement(null)}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              )}

              <div className="p-8">
                {!selectedAnnouncement.image && (
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1" />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedAnnouncement(null)}
                      className="rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                )}

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className={
                      selectedAnnouncement.category === "School"
                        ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 border-blue-200"
                        : "bg-purple-50 dark:bg-purple-950/20 text-purple-600 border-purple-200"
                    }
                  >
                    {selectedAnnouncement.category}
                  </Badge>
                  {selectedAnnouncement.urgent && (
                    <Badge variant="destructive" className="bg-red-500/20 text-red-700 border-red-200">
                      Urgent
                    </Badge>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedAnnouncement.date}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold mb-4">{selectedAnnouncement.title}</h2>

                {/* Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-base leading-relaxed text-foreground">{selectedAnnouncement.content}</p>
                </div>

                {/* Action Button */}
                <div className="mt-8 pt-6 border-t border-border">
                  <Button
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                    onMouseEnter={() => playSound("hover")}
                    onClick={() => setSelectedAnnouncement(null)}
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
