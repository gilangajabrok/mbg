"use client"

import { SupplierLayout } from "@/components/layout/supplier-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertCircle, Star, FileText, Eye } from "lucide-react"
import { motion } from "framer-motion"

export default function SupplierQuality() {
  const qualityReports = [
    {
      id: "QR-001",
      date: "2024-01-20",
      inspector: "John Smith",
      schoolName: "Greenfield Elementary",
      orderId: "ORD-2024-001",
      overallRating: 4.8,
      categories: [
        { name: "Food Safety", score: 5, status: "excellent" },
        { name: "Temperature Control", score: 4.8, status: "excellent" },
        { name: "Packaging Quality", score: 4.7, status: "good" },
        { name: "Freshness", score: 4.9, status: "excellent" },
        { name: "Portion Accuracy", score: 4.6, status: "good" },
      ],
      issues: [],
      approved: true,
    },
    {
      id: "QR-002",
      date: "2024-01-19",
      inspector: "Sarah Johnson",
      schoolName: "Riverside High School",
      orderId: "ORD-2024-002",
      overallRating: 4.2,
      categories: [
        { name: "Food Safety", score: 4.5, status: "good" },
        { name: "Temperature Control", score: 3.8, status: "needs-improvement" },
        { name: "Packaging Quality", score: 4.5, status: "good" },
        { name: "Freshness", score: 4.0, status: "good" },
        { name: "Portion Accuracy", score: 4.3, status: "good" },
      ],
      issues: ["Temperature was slightly below optimal range for 2 items"],
      approved: true,
    },
    {
      id: "QR-003",
      date: "2024-01-18",
      inspector: "Mike Davis",
      schoolName: "Sunset Middle School",
      orderId: "ORD-2024-003",
      overallRating: 3.5,
      categories: [
        { name: "Food Safety", score: 4.0, status: "good" },
        { name: "Temperature Control", score: 2.5, status: "failed" },
        { name: "Packaging Quality", score: 4.0, status: "good" },
        { name: "Freshness", score: 3.5, status: "needs-improvement" },
        { name: "Portion Accuracy", score: 3.5, status: "needs-improvement" },
      ],
      issues: [
        "Temperature control failed for 5 items",
        "Some items showed signs of aging",
        "Portions were inconsistent",
      ],
      approved: false,
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-700"
    if (score >= 3.5) return "text-amber-700"
    return "text-red-700"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-700 border-green-300">Excellent</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-300">Good</Badge>
      case "needs-improvement":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-300">Needs Improvement</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-700 border-red-300">Failed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const stats = [
    {
      label: "Total Reports",
      value: qualityReports.length,
      icon: FileText,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Approved",
      value: qualityReports.filter((r) => r.approved).length,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Rejected",
      value: qualityReports.filter((r) => !r.approved).length,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Avg. Rating",
      value: (qualityReports.reduce((sum, r) => sum + r.overallRating, 0) / qualityReports.length).toFixed(1),
      icon: Star,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ]

  return (
    <SupplierLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
            Quality Control
          </h1>
          <p className="text-muted-foreground mt-1">Track quality inspections and reports</p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="border-0 bg-white/50 backdrop-blur-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quality Reports */}
        <div className="space-y-6">
          {qualityReports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 bg-white/50 backdrop-blur-xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-xl">{report.schoolName}</h3>
                      {report.approved ? (
                        <Badge className="bg-green-100 text-green-700 border-green-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 border-red-300 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Report ID: {report.id}</span>
                      <span>Order: {report.orderId}</span>
                      <span>Inspector: {report.inspector}</span>
                      <span>Date: {new Date(report.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className={`w-5 h-5 ${getScoreColor(report.overallRating)} fill-current`} />
                      <span className={`text-2xl font-bold ${getScoreColor(report.overallRating)}`}>
                        {report.overallRating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Overall Rating</p>
                  </div>
                </div>

                {/* Category Scores */}
                <div className="grid gap-4 md:grid-cols-5 mb-6">
                  {report.categories.map((category) => (
                    <div
                      key={category.name}
                      className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 text-center border border-gray-200"
                    >
                      <p className="text-xs text-muted-foreground mb-2">{category.name}</p>
                      <p className={`text-2xl font-bold ${getScoreColor(category.score)} mb-2`}>
                        {category.score.toFixed(1)}
                      </p>
                      {getStatusBadge(category.status)}
                    </div>
                  ))}
                </div>

                {/* Issues */}
                {report.issues.length > 0 && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-900 mb-2">Issues Identified:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
                          {report.issues.map((issue, idx) => (
                            <li key={idx}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="outline" className="border-emerald-600 text-emerald-700 bg-transparent">
                    <Eye className="w-3 h-3 mr-1" />
                    View Full Report
                  </Button>
                  {!report.approved && (
                    <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-green-600">
                      Submit Corrective Action
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </SupplierLayout>
  )
}
