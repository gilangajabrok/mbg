"use client"

import { motion } from "framer-motion"
import { School, Users, Package, TrendingUp, Truck, CheckCircle, AlertTriangle } from "lucide-react"
import { adminDashboardStats, adminDeliveryRecords, adminQualityReports } from "@/lib/data/admin-dummy-data"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const statsCards = [
  {
    icon: School,
    label: "Active Schools",
    value: adminDashboardStats.activeSchools,
    total: adminDashboardStats.totalSchools,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Users,
    label: "Total Students",
    value: adminDashboardStats.totalStudents.toLocaleString(),
    subtitle: "Enrolled",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
  },
  {
    icon: Package,
    label: "Meals Today",
    value: adminDashboardStats.todayMeals.toLocaleString(),
    subtitle: "Delivered",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: Truck,
    label: "Deliveries",
    value: adminDashboardStats.completedDeliveries,
    subtitle: "This month",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
]

const weeklyMealData = [
  { day: "Mon", breakfast: 2400, lunch: 2800, snack: 1800 },
  { day: "Tue", breakfast: 2500, lunch: 2900, snack: 1900 },
  { day: "Wed", breakfast: 2450, lunch: 2850, snack: 1850 },
  { day: "Thu", breakfast: 2600, lunch: 3000, snack: 2000 },
  { day: "Fri", breakfast: 2550, lunch: 2950, snack: 1950 },
]

const budgetData = [
  { name: "Spent", value: adminDashboardStats.spentThisMonth },
  { name: "Remaining", value: adminDashboardStats.monthlyBudget - adminDashboardStats.spentThisMonth },
]

const COLORS = ["#3b82f6", "#e5e7eb"]

export default function AdminDashboardPage() {
  const budgetPercentage = (adminDashboardStats.spentThisMonth / adminDashboardStats.monthlyBudget) * 100

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-2xl p-6 border border-border/50`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-foreground">
                    {stat.value}
                    {stat.total && <span className="text-lg text-muted-foreground">/{stat.total}</span>}
                  </h3>
                  {stat.subtitle && <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>}
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Meals Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Meal Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyMealData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                />
                <Legend />
                <Bar dataKey="breakfast" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="lunch" fill="#6366f1" radius={[8, 8, 0, 0]} />
                <Bar dataKey="snack" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Budget Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Budget</h3>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold text-foreground">{budgetPercentage.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Budget Used</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Rp {(adminDashboardStats.spentThisMonth / 1000000).toFixed(0)}M / Rp{" "}
                  {(adminDashboardStats.monthlyBudget / 1000000).toFixed(0)}M
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Deliveries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Recent Deliveries</h3>
              <Truck className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {adminDeliveryRecords.slice(0, 4).map((delivery) => (
                <div
                  key={delivery.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      delivery.status === "delivered"
                        ? "bg-green-500"
                        : delivery.status === "in-transit"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{delivery.school}</p>
                    <p className="text-xs text-muted-foreground">
                      {delivery.mealType} • {delivery.mealCount} meals
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {delivery.status === "delivered" ? `Delivered at ${delivery.actualTime}` : "In transit"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quality Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Quality Reports</h3>
              <CheckCircle className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {adminQualityReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      report.status === "passed"
                        ? "bg-green-500"
                        : report.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{report.school}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.mealType} • Rating: {report.rating}/10
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Inspector: {report.inspector}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">Quality Score</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {adminDashboardStats.qualityScore}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Avg Rating</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {adminDashboardStats.averageRating}/5.0
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {adminDashboardStats.pendingOrders}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
    </motion.div>
  )
}
