"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSound } from "@/lib/sound-provider"
import {
  Heart,
  UtensilsCrossed,
  Truck,
  FileWarning,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import {
  dummyParent,
  dummyChildren,
  dummyMealPlans,
  dummyDeliveries,
  dummyAnnouncements,
  dummyNutritionStats,
} from "@/lib/data/parent-dummy-data"

export default function ParentDashboardPage() {
  const { playSound } = useSound()

  const todaysMeal = dummyMealPlans[0]
  const recentDeliveries = dummyDeliveries.slice(0, 3)
  const latestAnnouncements = dummyAnnouncements.slice(0, 3)

  return (
    <>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-pink-500/10 via-pink-400/10 to-blue-400/10 dark:from-pink-500/20 dark:via-pink-400/20 dark:to-blue-400/20 rounded-3xl p-8 mb-6 border border-pink-200/30 dark:border-pink-900/30"
      >
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 dark:from-pink-400 dark:to-blue-400 bg-clip-text text-transparent mb-2"
            >
              Welcome back, {dummyParent.name.split(" ")[0]}! 👋
            </motion.h1>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              Here's what's happening with your children's meals today
            </motion.p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="hidden md:flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl"
          >
            <Heart className="w-10 h-10 text-white" fill="white" />
          </motion.div>
        </div>
      </motion.div>

      {/* Children Quick Cards */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Children</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dummyChildren.map((child, index) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -4 }}
            >
              <Card className="p-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <img
                    src={child.photo || "/placeholder.svg"}
                    alt={child.name}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{child.name}</h3>
                    <p className="text-sm text-muted-foreground">{child.school}</p>
                    <p className="text-xs text-muted-foreground mt-1">Class {child.class}</p>
                    {child.allergies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {child.allergies.slice(0, 2).map((allergy) => (
                          <Badge
                            key={allergy}
                            variant="outline"
                            className="text-xs bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200"
                          >
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Meal Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Today's Meals</h3>
                  <p className="text-sm text-muted-foreground">
                    {todaysMeal.day}, {todaysMeal.date}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-pink-600 dark:text-pink-400"
                onMouseEnter={() => playSound("hover")}
              >
                View Full Plan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border border-amber-200/30 dark:border-amber-900/30">
                <p className="text-xs text-muted-foreground mb-2">BREAKFAST</p>
                <p className="font-semibold text-sm mb-2">{todaysMeal.breakfast.name}</p>
                <p className="text-xs text-muted-foreground">{todaysMeal.breakfast.calories} cal</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200/30 dark:border-green-900/30">
                <p className="text-xs text-muted-foreground mb-2">LUNCH</p>
                <p className="font-semibold text-sm mb-2">{todaysMeal.lunch.name}</p>
                <p className="text-xs text-muted-foreground">{todaysMeal.lunch.calories} cal</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-200/30 dark:border-blue-900/30">
                <p className="text-xs text-muted-foreground mb-2">SNACK</p>
                <p className="font-semibold text-sm mb-2">{todaysMeal.snack.name}</p>
                <p className="text-xs text-muted-foreground">{todaysMeal.snack.calories} cal</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Nutrition Snapshot */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-950/20 dark:to-pink-900/20 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30 h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Nutrition Score</h3>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">
                {dummyNutritionStats.monthly.score}
              </span>
              <span className="text-2xl text-muted-foreground">/100</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Calories</span>
                  <span className="font-medium">{dummyNutritionStats.monthly.avgCalories}</span>
                </div>
                <div className="h-2 bg-white/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Protein</span>
                  <span className="font-medium">{dummyNutritionStats.monthly.avgProtein}g</span>
                </div>
                <div className="h-2 bg-white/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                    style={{ width: "92%" }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Delivery Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Recent Deliveries</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-pink-600 dark:text-pink-400"
                onMouseEnter={() => playSound("hover")}
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="space-y-3">
              {recentDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="p-4 bg-gradient-to-r from-white/50 to-pink-50/30 dark:from-slate-800/50 dark:to-pink-950/10 rounded-xl border border-pink-200/20 dark:border-pink-900/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {delivery.status === "delivered" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      {delivery.status === "on-the-way" && <Clock className="w-4 h-4 text-blue-500" />}
                      {delivery.status === "delayed" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      <span className="font-medium text-sm">{delivery.childName}</span>
                    </div>
                    <Badge
                      variant={delivery.status === "delivered" ? "default" : "outline"}
                      className={
                        delivery.status === "delivered"
                          ? "bg-green-500/20 text-green-700 border-green-200"
                          : delivery.status === "on-the-way"
                            ? "bg-blue-500/20 text-blue-700 border-blue-200"
                            : "bg-amber-500/20 text-amber-700 border-amber-200"
                      }
                    >
                      {delivery.status === "delivered"
                        ? "Delivered"
                        : delivery.status === "on-the-way"
                          ? "On the Way"
                          : "Delayed"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {delivery.mealType} • {delivery.deliveryTime}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{delivery.supplier}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Latest Announcements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Announcements</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-pink-600 dark:text-pink-400"
                onMouseEnter={() => playSound("hover")}
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="space-y-3">
              {latestAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-4 bg-gradient-to-r from-white/50 to-purple-50/30 dark:from-slate-800/50 dark:to-purple-950/10 rounded-xl border border-purple-200/20 dark:border-purple-900/20 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm pr-2">{announcement.title}</h4>
                    {announcement.urgent && (
                      <Badge variant="destructive" className="text-xs flex-shrink-0">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {announcement.category}
                    </Badge>
                    <span>•</span>
                    <span>{announcement.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-6 bg-gradient-to-br from-pink-500/10 to-pink-400/5 dark:from-pink-500/20 dark:to-pink-400/10 border-pink-200/30 dark:border-pink-900/30 cursor-pointer hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">View Meal Plan</h3>
                  <p className="text-xs text-muted-foreground">See this week's menu</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-400/5 dark:from-amber-500/20 dark:to-amber-400/10 border-amber-200/30 dark:border-amber-900/30 cursor-pointer hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <FileWarning className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Report Issue</h3>
                  <p className="text-xs text-muted-foreground">Submit feedback</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-400/5 dark:from-blue-500/20 dark:to-blue-400/10 border-blue-200/30 dark:border-blue-900/30 cursor-pointer hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Contact Support</h3>
                  <p className="text-xs text-muted-foreground">Get help anytime</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
