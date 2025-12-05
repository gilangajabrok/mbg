"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useSound } from "@/lib/sound-provider"
import { Plus, Search, User, Calendar, SchoolIcon, AlertCircle, UtensilsCrossed, Edit, Eye } from "lucide-react"
import { dummyChildren } from "@/lib/data/parent-dummy-data"
import Link from "next/link"

export default function ChildrenPage() {
  const { playSound } = useSound()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChildren = dummyChildren.filter(
    (child) =>
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.school.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold">My Children</h1>
          <p className="text-muted-foreground mt-1">Manage your children's profiles and preferences</p>
        </div>
        <Button
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg shadow-pink-500/30"
          onMouseEnter={() => playSound("hover")}
          onClick={() => playSound("press")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Child
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or school..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/50 dark:bg-slate-900/50 border-pink-200/30 dark:border-pink-900/30"
          />
        </div>
      </motion.div>

      {/* Children Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChildren.map((child, index) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 2) }}
          >
            <Card className="overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30 hover:shadow-xl transition-all">
              {/* Card Header with Photo */}
              <div className="relative h-32 bg-gradient-to-br from-pink-400/20 to-blue-400/20">
                <motion.div whileHover={{ scale: 1.05 }} className="absolute -bottom-12 left-6">
                  <img
                    src={child.photo || "/placeholder.svg"}
                    alt={child.name}
                    className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-900 object-cover shadow-lg"
                  />
                </motion.div>
              </div>

              {/* Card Content */}
              <div className="pt-14 px-6 pb-6">
                <h3 className="text-xl font-bold mb-1">{child.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">Student ID: {child.studentId}</p>

                {/* Info Grid */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <SchoolIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">School</p>
                      <p className="font-medium truncate">{child.school}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Class</p>
                      <p className="font-medium">{child.class}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Birth Date</p>
                      <p className="font-medium">{child.birthDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Meal Preference</p>
                      <p className="font-medium">{child.mealPreference}</p>
                    </div>
                  </div>
                </div>

                {/* Allergies */}
                {child.allergies.length > 0 ? (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-xs font-medium text-red-600 dark:text-red-400">Allergies</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {child.allergies.map((allergy) => (
                        <Badge
                          key={allergy}
                          variant="outline"
                          className="bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200 dark:border-red-900"
                        >
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <Badge
                      variant="outline"
                      className="bg-green-50 dark:bg-green-950/20 text-green-600 border-green-200"
                    >
                      No Known Allergies
                    </Badge>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/parent/children/${child.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-pink-200 dark:border-pink-900/30 hover:bg-pink-50 dark:hover:bg-pink-950/20 bg-transparent"
                      onMouseEnter={() => playSound("hover")}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-pink-200 dark:border-pink-900/30 hover:bg-pink-50 dark:hover:bg-pink-950/20 bg-transparent"
                    onMouseEnter={() => playSound("hover")}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredChildren.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-pink-400/20 to-blue-400/20 flex items-center justify-center">
            <User className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No children found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your search or add a new child</p>
          <Button
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
            onMouseEnter={() => playSound("hover")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Child
          </Button>
        </motion.div>
      )}
    </>
  )
}
