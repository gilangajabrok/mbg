"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSound } from "@/lib/sound-provider"
import {
  ArrowLeft,
  Edit,
  Calendar,
  SchoolIcon,
  User,
  AlertCircle,
  UtensilsCrossed,
  TrendingUp,
  FileText,
} from "lucide-react"
import { dummyChildren, dummyMealPlans } from "@/lib/data/parent-dummy-data"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ChildProfilePage() {
  const { playSound } = useSound()
  const params = useParams()
  const childId = params.id as string

  const child = dummyChildren.find((c) => c.id === childId) || dummyChildren[0]
  const [editMode, setEditMode] = useState(false)

  const recentMeals = dummyMealPlans.slice(0, 5)

  return (
    <>
      {/* Back Button */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
        <Link href="/parent/children">
          <Button variant="ghost" className="gap-2" onMouseEnter={() => playSound("hover")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Children
          </Button>
        </Link>
      </motion.div>

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30 mb-6">
          {/* Header Background */}
          <div className="relative h-40 bg-gradient-to-br from-pink-400/30 via-purple-400/30 to-blue-400/30">
            <motion.div whileHover={{ scale: 1.05 }} className="absolute -bottom-16 left-8">
              <img
                src={child.photo || "/placeholder.svg"}
                alt={child.name}
                className="w-32 h-32 rounded-3xl border-4 border-white dark:border-slate-900 object-cover shadow-2xl"
              />
            </motion.div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{child.name}</h1>
                <p className="text-muted-foreground">Student ID: {child.studentId}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {child.allergies.length > 0 ? (
                    child.allergies.map((allergy) => (
                      <Badge
                        key={allergy}
                        variant="outline"
                        className="bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200"
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {allergy}
                      </Badge>
                    ))
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-green-50 dark:bg-green-950/20 text-green-600 border-green-200"
                    >
                      No Known Allergies
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg shadow-pink-500/30"
                onMouseEnter={() => playSound("hover")}
                onClick={() => {
                  setEditMode(!editMode)
                  playSound("press")
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 rounded-xl border border-blue-200/30 dark:border-blue-900/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <SchoolIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">School</p>
                </div>
                <p className="font-semibold">{child.school}</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 rounded-xl border border-purple-200/30 dark:border-purple-900/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">Class</p>
                </div>
                <p className="font-semibold">{child.class}</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20 rounded-xl border border-green-200/30 dark:border-green-900/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">Birth Date</p>
                </div>
                <p className="font-semibold">{child.birthDate}</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/20 rounded-xl border border-orange-200/30 dark:border-orange-900/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">Preference</p>
                </div>
                <p className="font-semibold text-sm">{child.mealPreference}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabbed Content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="bg-white/50 dark:bg-slate-900/50 border border-pink-200/30 dark:border-pink-900/30 p-1">
            <TabsTrigger value="personal" className="data-[state=active]:bg-pink-500/20">
              <FileText className="w-4 h-4 mr-2" />
              Personal Data
            </TabsTrigger>
            <TabsTrigger value="dietary" className="data-[state=active]:bg-pink-500/20">
              <UtensilsCrossed className="w-4 h-4 mr-2" />
              Dietary Info
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-pink-500/20">
              <TrendingUp className="w-4 h-4 mr-2" />
              Meal History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <Card className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-muted-foreground">Full Name</label>
                  <p className="font-medium mt-1">{child.name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Student ID</label>
                  <p className="font-medium mt-1">{child.studentId}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Birth Date</label>
                  <p className="font-medium mt-1">{child.birthDate}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">School</label>
                  <p className="font-medium mt-1">{child.school}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Class</label>
                  <p className="font-medium mt-1">{child.class}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Enrollment Status</label>
                  <Badge
                    variant="outline"
                    className="bg-green-50 dark:bg-green-950/20 text-green-600 border-green-200 mt-1"
                  >
                    Active
                  </Badge>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="dietary" className="mt-6">
            <Card className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30">
              <h3 className="text-lg font-semibold mb-4">Dietary Restrictions & Preferences</h3>

              <div className="space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Allergies</label>
                  {child.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {child.allergies.map((allergy) => (
                        <Badge
                          key={allergy}
                          className="bg-red-50 dark:bg-red-950/20 text-red-600 border border-red-200"
                        >
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No known allergies</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Meal Preference</label>
                  <Badge
                    variant="outline"
                    className="bg-orange-50 dark:bg-orange-950/20 text-orange-600 border-orange-200"
                  >
                    {child.mealPreference}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Special Notes</label>
                  <p className="text-sm">
                    {child.allergies.includes("Peanuts") &&
                      "Strictly avoid all peanut products and cross-contamination. "}
                    {child.mealPreference === "Vegetarian" && "Prefers plant-based meals with no meat or fish. "}
                    {child.mealPreference === "No Spicy Food" && "Sensitive to spicy flavors and hot peppers. "}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30">
              <h3 className="text-lg font-semibold mb-4">Recent Meal History</h3>

              <div className="space-y-3">
                {recentMeals.map((meal) => (
                  <div
                    key={meal.date}
                    className="p-4 bg-gradient-to-r from-white/50 to-pink-50/30 dark:from-slate-800/50 dark:to-pink-950/10 rounded-xl border border-pink-200/20 dark:border-pink-900/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold">{meal.day}</p>
                        <p className="text-xs text-muted-foreground">{meal.date}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 dark:bg-green-950/20 text-green-600 border-green-200"
                      >
                        Completed
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Breakfast</p>
                        <p className="font-medium text-xs">{meal.breakfast.name}</p>
                      </div>
                      <div className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Lunch</p>
                        <p className="font-medium text-xs">{meal.lunch.name}</p>
                      </div>
                      <div className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Snack</p>
                        <p className="font-medium text-xs">{meal.snack.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  )
}
