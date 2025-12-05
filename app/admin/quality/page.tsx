"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ClipboardCheck, Plus, CheckCircle, AlertTriangle, XCircle, ImageIcon, Thermometer } from "lucide-react"
import { adminQualityReports, type QualityReport } from "@/lib/data/admin-dummy-data"
import { useSound } from "@/lib/sound-provider"

export default function AdminQualityPage() {
  const { playSound } = useSound()
  const [selectedReport, setSelectedReport] = useState<QualityReport | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "passed":
        return { color: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400", icon: CheckCircle }
      case "warning":
        return {
          color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
          icon: AlertTriangle,
        }
      case "failed":
        return { color: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400", icon: XCircle }
      default:
        return { color: "bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400", icon: ClipboardCheck }
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quality Control</h1>
            <p className="text-muted-foreground mt-1">Monitor and manage meal quality inspections</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playSound("click")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Inspection
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Passed",
              value: adminQualityReports.filter((r) => r.status === "passed").length,
              icon: CheckCircle,
              color: "from-green-500 to-green-600",
            },
            {
              label: "Warnings",
              value: adminQualityReports.filter((r) => r.status === "warning").length,
              icon: AlertTriangle,
              color: "from-yellow-500 to-yellow-600",
            },
            {
              label: "Failed",
              value: adminQualityReports.filter((r) => r.status === "failed").length,
              icon: XCircle,
              color: "from-red-500 to-red-600",
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
                  <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
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

        {/* Quality Reports */}
        <div className="space-y-4">
          {adminQualityReports.map((report, index) => {
            const statusConfig = getStatusConfig(report.status)
            const StatusIcon = statusConfig.icon

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => {
                  playSound("click")
                  setSelectedReport(report)
                  setShowDetailModal(true)
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${statusConfig.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <StatusIcon className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{report.school}</h3>
                        <p className="text-sm text-muted-foreground">{report.mealType} Inspection</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{report.rating}/10</p>
                        <p className="text-xs text-muted-foreground">Quality Score</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Date</p>
                        <p className="text-sm font-semibold text-foreground">{report.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                        <p className="text-sm font-semibold text-foreground">{report.temperature}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Freshness</p>
                        <p className="text-sm font-semibold text-foreground">{report.freshness}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Hygiene</p>
                        <p className="text-sm font-semibold text-foreground">{report.hygiene}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Inspector</p>
                        <p className="text-sm font-semibold text-foreground">{report.inspector}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{report.notes}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl border border-border/50 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-border/50">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedReport.school}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedReport.mealType} Quality Inspection Report
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusConfig(selectedReport.status).color}`}
                  >
                    {selectedReport.status}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30">
                    <p className="text-xs text-muted-foreground mb-1">Overall Rating</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedReport.rating}/10</p>
                  </div>
                  <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Thermometer className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <p className="text-xs text-muted-foreground">Temperature</p>
                    </div>
                    <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                      {selectedReport.temperature}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30">
                    <p className="text-xs text-muted-foreground mb-1">Freshness</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">{selectedReport.freshness}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Quality Metrics</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Packaging", value: selectedReport.packaging },
                      { label: "Hygiene", value: selectedReport.hygiene },
                    ].map((metric, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <p className="text-sm font-medium text-foreground">{metric.label}</p>
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 text-sm font-semibold">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Inspector Notes</h3>
                  <p className="text-sm text-muted-foreground p-4 rounded-xl bg-muted/30">{selectedReport.notes}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Inspection Photos</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedReport.images.map((img, idx) => (
                      <div key={idx} className="aspect-video rounded-xl bg-muted/30 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Inspector</p>
                    <p className="text-sm font-semibold text-foreground">{selectedReport.inspector}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Inspection Date</p>
                    <p className="text-sm font-semibold text-foreground">{selectedReport.date}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border/50 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 rounded-lg border border-border hover:bg-muted transition-colors font-medium text-sm"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
  )
}
