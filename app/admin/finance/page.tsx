"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, TrendingUp, TrendingDown, FileText, Download, Filter } from "lucide-react"
import { adminFinancialRecords, adminDashboardStats } from "@/lib/data/admin-dummy-data"
import { useSound } from "@/lib/sound-provider"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const monthlyData = [
  { month: "Jan", revenue: 750000000, expenses: 623400000 },
  { month: "Feb", revenue: 820000000, expenses: 680000000 },
  { month: "Mar", revenue: 850000000, expenses: 710000000 },
  { month: "Apr", revenue: 880000000, expenses: 735000000 },
]

export default function AdminFinancePage() {
  const { playSound } = useSound()
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredRecords =
    selectedCategory === "all"
      ? adminFinancialRecords
      : adminFinancialRecords.filter((r) => r.category === selectedCategory)

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "meal-cost": "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
      "delivery-fee": "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
      "supplier-payment": "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
      operational: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
    }
    return colors[category] || "bg-gray-100 text-gray-700"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
      case "overdue":
        return "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const totalExpenses = adminFinancialRecords.reduce((sum, r) => sum + r.amount, 0)
  const paidAmount = adminFinancialRecords.filter((r) => r.status === "paid").reduce((sum, r) => sum + r.amount, 0)
  const pendingAmount = adminFinancialRecords
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => sum + r.amount, 0)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financial Overview</h1>
            <p className="text-muted-foreground mt-1">Monitor budget, expenses, and payments</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playSound("click")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export Report
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: "Monthly Budget",
              value: `Rp ${(adminDashboardStats.monthlyBudget / 1000000).toFixed(0)}M`,
              icon: DollarSign,
              color: "from-blue-500 to-blue-600",
              change: null,
            },
            {
              label: "Total Spent",
              value: `Rp ${(adminDashboardStats.spentThisMonth / 1000000).toFixed(0)}M`,
              icon: TrendingDown,
              color: "from-red-500 to-red-600",
              change: "-73%",
            },
            {
              label: "Paid",
              value: `Rp ${(paidAmount / 1000000).toFixed(0)}M`,
              icon: TrendingUp,
              color: "from-green-500 to-green-600",
              change: null,
            },
            {
              label: "Pending",
              value: `Rp ${(pendingAmount / 1000000).toFixed(0)}M`,
              icon: FileText,
              color: "from-yellow-500 to-yellow-600",
              change: null,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                  {stat.change && <p className="text-xs text-muted-foreground mt-1">Budget used</p>}
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                  formatter={(value: number) => `Rp ${(value / 1000000).toFixed(0)}M`}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  { category: "Meals", amount: 450 },
                  { category: "Delivery", amount: 120 },
                  { category: "Operations", amount: 80 },
                  { category: "Other", amount: 40 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis dataKey="category" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                  formatter={(value: number) => `Rp ${value}M`}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Filter */}
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                playSound("click")
                setSelectedCategory(e.target.value)
              }}
              className="px-4 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="all">All Categories</option>
              <option value="meal-cost">Meal Cost</option>
              <option value="delivery-fee">Delivery Fee</option>
              <option value="supplier-payment">Supplier Payment</option>
              <option value="operational">Operational</option>
            </select>
          </div>
        </div>

        {/* Financial Records Table */}
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredRecords.map((record, index) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{record.invoiceNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">{record.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(record.category)}`}
                      >
                        {record.category.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground max-w-xs truncate">{record.description}</p>
                      {record.supplier && <p className="text-xs text-muted-foreground">{record.supplier}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">Rp {(record.amount / 1000000).toFixed(1)}M</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
  )
}
