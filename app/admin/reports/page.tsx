"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, Download, Calendar, TrendingUp, FileText, PieChart } from "lucide-react"
import { useSound } from "@/lib/sound-provider"

const reportTypes = [
  {
    id: "meal-distribution",
    name: "Meal Distribution Report",
    icon: PieChart,
    description: "Comprehensive overview of meal distribution across all schools",
  },
  {
    id: "financial",
    name: "Financial Summary",
    icon: TrendingUp,
    description: "Detailed financial transactions and budget analysis",
  },
  {
    id: "quality",
    name: "Quality Inspection Report",
    icon: BarChart3,
    description: "Quality control metrics and inspection results",
  },
  {
    id: "delivery",
    name: "Delivery Performance",
    icon: FileText,
    description: "Delivery timelines and completion rates",
  },
  {
    id: "supplier",
    name: "Supplier Performance",
    icon: TrendingUp,
    description: "Supplier ratings and fulfillment metrics",
  },
  {
    id: "nutrition",
    name: "Nutrition Analysis",
    icon: PieChart,
    description: "Nutritional content and compliance report",
  },
]

export default function AdminReportsPage() {
  const { playSound } = useSound()
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Generate and download comprehensive reports</p>
        </div>

        {/* Period Selector */}
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-2">Report Period</p>
              <div className="flex gap-2">
                {["week", "month", "quarter", "year"].map((period) => (
                  <motion.button
                    key={period}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      playSound("click")
                      setSelectedPeriod(period)
                    }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      selectedPeriod === period
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report, index) => {
            const Icon = report.icon

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-1">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => playSound("click")}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => playSound("click")}
                    className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors font-medium text-sm"
                  >
                    View
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Recent Reports */}
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {[
              { name: "Monthly Financial Summary - January 2025", date: "2025-01-31", size: "2.4 MB" },
              { name: "Quality Inspection Report - Week 3", date: "2025-01-24", size: "1.8 MB" },
              { name: "Delivery Performance - Q4 2024", date: "2024-12-31", size: "3.2 MB" },
            ].map((report, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-foreground text-sm">{report.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.date} • {report.size}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => playSound("click")}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Download className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
  )
}
