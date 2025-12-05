"use client"

import { SupplierLayout } from "@/components/layout/supplier-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar, TrendingUp, DollarSign, Package, BarChart3 } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts"

export default function SupplierReports() {
  const revenueData = [
    { month: "Jul", revenue: 45000, orders: 120 },
    { month: "Aug", revenue: 52000, orders: 135 },
    { month: "Sep", revenue: 48000, orders: 128 },
    { month: "Oct", revenue: 58000, orders: 145 },
    { month: "Nov", revenue: 63000, orders: 158 },
    { month: "Dec", revenue: 71000, orders: 172 },
  ]

  const productPerformance = [
    { product: "Chicken Rice Bowl", sales: 2450, revenue: 24500 },
    { product: "Pasta Marinara", sales: 2180, revenue: 21800 },
    { product: "Turkey Sandwich", sales: 1920, revenue: 19200 },
    { product: "Caesar Salad", sales: 1650, revenue: 16500 },
    { product: "Veggie Wrap", sales: 1380, revenue: 13800 },
  ]

  const deliveryPerformance = [
    { week: "Week 1", onTime: 98, delayed: 2 },
    { week: "Week 2", onTime: 96, delayed: 4 },
    { week: "Week 3", onTime: 99, delayed: 1 },
    { week: "Week 4", onTime: 97, delayed: 3 },
  ]

  const reports = [
    { name: "Monthly Revenue Report", date: "December 2024", type: "Financial", icon: DollarSign },
    { name: "Order Summary Report", date: "December 2024", type: "Operations", icon: Package },
    { name: "Quality Control Report", date: "December 2024", type: "Quality", icon: BarChart3 },
    { name: "Delivery Performance Report", date: "December 2024", type: "Logistics", icon: TrendingUp },
  ]

  return (
    <SupplierLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">View performance reports and analytics</p>
        </div>

        {/* Revenue Chart */}
        <Card className="border-0 bg-white/50 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">Revenue & Orders Trend</h3>
              <p className="text-sm text-muted-foreground mt-1">Last 6 months performance</p>
            </div>
            <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-700 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Product Performance */}
          <Card className="border-0 bg-white/50 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Top Products</h3>
                <p className="text-sm text-muted-foreground mt-1">Best performing items</p>
              </div>
              <Package className="w-8 h-8 text-emerald-600" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={productPerformance} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis dataKey="product" type="category" stroke="#64748b" fontSize={10} width={120} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Delivery Performance */}
          <Card className="border-0 bg-white/50 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Delivery Performance</h3>
                <p className="text-sm text-muted-foreground mt-1">On-time vs delayed deliveries</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deliveryPerformance}>
                <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="onTime" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="delayed" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Downloadable Reports */}
        <Card className="border-0 bg-white/50 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl font-bold">Available Reports</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {reports.map((report, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <report.icon className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{report.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {report.date}
                      </span>
                      <span>•</span>
                      <span>{report.type}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-emerald-600 text-emerald-700 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </SupplierLayout>
  )
}
