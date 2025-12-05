"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSound } from "@/lib/sound-provider"
import { TrendingUp, Heart, Award, Flame, Beef, Wheat, Droplet, Pill, Download } from "lucide-react"
import { dummyNutritionStats, dummyChildren } from "@/lib/data/parent-dummy-data"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"

export default function NutritionPage() {
  const { playSound } = useSound()
  const [selectedChild, setSelectedChild] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("month")

  const macroData = [
    { name: "Protein", value: dummyNutritionStats.monthly.avgProtein, color: "#EF4444" },
    { name: "Carbs", value: dummyNutritionStats.monthly.avgCarbs, color: "#F59E0B" },
    { name: "Fat", value: dummyNutritionStats.monthly.avgFat, color: "#EAB308" },
  ]

  return (
    <>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Nutrition Tracking</h1>
        <p className="text-muted-foreground">Monitor your children's nutritional intake and health metrics</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <Select value={selectedChild} onValueChange={setSelectedChild}>
          <SelectTrigger className="bg-white/50 dark:bg-slate-900/50 border-pink-200/30 dark:border-pink-900/30">
            <SelectValue placeholder="Select child" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            {dummyChildren.map((child) => (
              <SelectItem key={child.id} value={child.id}>
                {child.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="bg-white/50 dark:bg-slate-900/50 border-pink-200/30 dark:border-pink-900/30">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Nutrition Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card className="p-8 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-blue-500/20 border-pink-200/30 dark:border-pink-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-2xl shadow-pink-500/30"
              >
                <Award className="w-12 h-12 text-white" />
              </motion.div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overall Nutrition Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">
                    {dummyNutritionStats.monthly.score}
                  </span>
                  <span className="text-3xl text-muted-foreground">/100</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +3 points from last month
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-pink-200 dark:border-pink-900/30 bg-transparent"
              onMouseEnter={() => playSound("hover")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Calories</p>
                <p className="text-xl font-bold">{dummyNutritionStats.monthly.avgCalories}</p>
              </div>
            </div>
            <div className="h-2 bg-white/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                style={{ width: "85%" }}
              />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="p-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Beef className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Protein</p>
                <p className="text-xl font-bold">{dummyNutritionStats.monthly.avgProtein}g</p>
              </div>
            </div>
            <div className="h-2 bg-white/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full" style={{ width: "92%" }} />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Wheat className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Carbs</p>
                <p className="text-xl font-bold">{dummyNutritionStats.monthly.avgCarbs}g</p>
              </div>
            </div>
            <div className="h-2 bg-white/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                style={{ width: "88%" }}
              />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="p-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Droplet className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Fat</p>
                <p className="text-xl font-bold">{dummyNutritionStats.monthly.avgFat}g</p>
              </div>
            </div>
            <div className="h-2 bg-white/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                style={{ width: "78%" }}
              />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Trend Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Weekly Nutrition Trend</h3>
                <p className="text-xs text-muted-foreground">Score & Calories over time</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dummyNutritionStats.weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #fce7f3",
                    borderRadius: "12px",
                    padding: "8px 12px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#ec4899"
                  strokeWidth={3}
                  dot={{ fill: "#ec4899", r: 4 }}
                  name="Score"
                />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  name="Calories"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Macronutrients Pie Chart */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Macronutrient Distribution</h3>
                <p className="text-xs text-muted-foreground">Daily average breakdown</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}g`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Vitamins & Minerals */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Vitamins & Minerals Intake</h3>
              <p className="text-xs text-muted-foreground">Daily recommended values</p>
            </div>
          </div>

          <div className="space-y-4">
            {dummyNutritionStats.vitamins.map((vitamin, index) => (
              <motion.div
                key={vitamin.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-4 bg-gradient-to-r from-white/50 to-green-50/30 dark:from-slate-800/50 dark:to-green-950/10 rounded-xl border border-green-200/30 dark:border-green-900/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{vitamin.name}</p>
                    <p className="text-xs text-muted-foreground">{vitamin.value}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{vitamin.percentage}%</span>
                </div>
                <div className="h-2 bg-white/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${vitamin.percentage}%` }}
                    transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </>
  )
}
