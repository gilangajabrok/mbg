"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users, Database, Activity, ArrowUp, ArrowDown } from "lucide-react"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const statsData = [
  {
    title: "Total Users",
    value: "12,458",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "System Uptime",
    value: "99.8%",
    change: "+0.2%",
    trend: "up",
    icon: Activity,
    color: "from-emerald-500 to-green-500",
  },
  {
    title: "Database Size",
    value: "2.4 TB",
    change: "+8.3%",
    trend: "up",
    icon: Database,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "API Requests",
    value: "1.2M",
    change: "-3.2%",
    trend: "down",
    icon: TrendingUp,
    color: "from-orange-500 to-red-500",
  },
]

const activityData = [
  { name: "Mon", users: 4000, requests: 2400, errors: 24 },
  { name: "Tue", users: 3000, requests: 1398, errors: 22 },
  { name: "Wed", users: 2000, requests: 9800, errors: 29 },
  { name: "Thu", users: 2780, requests: 3908, errors: 20 },
  { name: "Fri", users: 1890, requests: 4800, errors: 18 },
  { name: "Sat", users: 2390, requests: 3800, errors: 23 },
  { name: "Sun", users: 3490, requests: 4300, errors: 21 },
]

export default function AnalyticsPanel() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground mb-2">System Overview</h1>
        <p className="text-muted-foreground">Monitor system health and performance metrics</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {stat.trend === "up" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">User Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* API Requests Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">API Requests & Errors</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="requests" fill="#10b981" />
              <Bar dataKey="errors" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
