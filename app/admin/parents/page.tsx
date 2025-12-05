"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Phone, Mail, MapPin, Users, CheckCircle, Clock, XCircle } from "lucide-react"
import { adminParents } from "@/lib/data/admin-dummy-data"
import { useSound } from "@/lib/sound-provider"

export default function AdminParentsPage() {
  const { playSound } = useSound()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredParents = adminParents.filter((parent) => {
    const matchesSearch =
      parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || parent.verificationStatus === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Parent Registry</h1>
          <p className="text-muted-foreground mt-1">Manage parent accounts and verifications</p>
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
                placeholder="Search parents..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onFocus={() => playSound("hover")}
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => {
                playSound("click")
                setSelectedStatus(e.target.value)
              }}
              className="px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Parents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredParents.map((parent, index) => (
            <motion.div
              key={parent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6 hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg">
                    {parent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{parent.name}</h3>
                    <p className="text-xs text-muted-foreground">{parent.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      parent.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                        : parent.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                    }`}
                  >
                    {parent.status}
                  </span>
                  {parent.verificationStatus === "verified" ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : parent.verificationStatus === "pending" ? (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {parent.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {parent.email}
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{parent.address}</span>
                </div>
              </div>

              {/* Children Info */}
              <div className="border-t border-border/50 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">
                    {parent.childrenCount} {parent.childrenCount === 1 ? "Child" : "Children"}
                  </span>
                </div>
                <div className="space-y-2">
                  {parent.children.map((child) => (
                    <div key={child.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <div>
                        <p className="text-sm font-medium text-foreground">{child.name}</p>
                        <p className="text-xs text-muted-foreground">{child.school}</p>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">Grade {child.grade}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registration Date */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Registered on{" "}
                  {new Date(parent.registrationDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
  )
}
