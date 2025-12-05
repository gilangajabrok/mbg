"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Truck, MapPin, Clock, Phone, Thermometer, ImageIcon, CheckCircle, AlertCircle } from "lucide-react"
import { adminDeliveryRecords, type DeliveryRecord } from "@/lib/data/admin-dummy-data"
import { useSound } from "@/lib/sound-provider"

export default function AdminDeliveryPage() {
  const { playSound } = useSound()
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRecord | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "delivered":
        return {
          color: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
          icon: CheckCircle,
          label: "Delivered",
        }
      case "in-transit":
        return {
          color: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
          icon: Truck,
          label: "In Transit",
        }
      case "scheduled":
        return {
          color: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
          icon: Clock,
          label: "Scheduled",
        }
      case "delayed":
        return {
          color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
          icon: AlertCircle,
          label: "Delayed",
        }
      default:
        return { color: "bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400", icon: Truck, label: status }
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Delivery Oversight</h1>
          <p className="text-muted-foreground mt-1">Monitor real-time delivery status and tracking</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: "Delivered",
              value: adminDeliveryRecords.filter((d) => d.status === "delivered").length,
              icon: CheckCircle,
              color: "from-green-500 to-green-600",
            },
            {
              label: "In Transit",
              value: adminDeliveryRecords.filter((d) => d.status === "in-transit").length,
              icon: Truck,
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "Scheduled",
              value: adminDeliveryRecords.filter((d) => d.status === "scheduled").length,
              icon: Clock,
              color: "from-purple-500 to-purple-600",
            },
            {
              label: "Total Meals",
              value: adminDeliveryRecords.reduce((sum, d) => sum + d.mealCount, 0).toLocaleString(),
              icon: Truck,
              color: "from-indigo-500 to-indigo-600",
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

        {/* Delivery Records */}
        <div className="space-y-4">
          {adminDeliveryRecords.map((delivery, index) => {
            const statusConfig = getStatusConfig(delivery.status)
            const StatusIcon = statusConfig.icon

            return (
              <motion.div
                key={delivery.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => {
                  playSound("click")
                  setSelectedDelivery(delivery)
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
                        <h3 className="text-lg font-bold text-foreground">{delivery.school}</h3>
                        <p className="text-sm text-muted-foreground">{delivery.supplier}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Date</p>
                        <p className="text-sm font-semibold text-foreground">{delivery.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Meal Type</p>
                        <p className="text-sm font-semibold text-foreground">{delivery.mealType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Scheduled</p>
                        <p className="text-sm font-semibold text-foreground">{delivery.scheduledTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Meal Count</p>
                        <p className="text-sm font-semibold text-foreground">{delivery.mealCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Driver</p>
                        <p className="text-sm font-semibold text-foreground">{delivery.driverName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedDelivery && (
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
                    <h2 className="text-2xl font-bold text-foreground">{selectedDelivery.school}</h2>
                    <p className="text-sm text-muted-foreground mt-1">Delivery ID: {selectedDelivery.id}</p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusConfig(selectedDelivery.status).color}`}
                  >
                    {getStatusConfig(selectedDelivery.status).label}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Scheduled Time</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {selectedDelivery.scheduledTime}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Actual Time</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {selectedDelivery.actualTime || "Pending"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30">
                    <Thermometer className="w-5 h-5 text-orange-600 dark:text-orange-400 mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {selectedDelivery.temperature}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Delivery Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Supplier</p>
                        <p className="text-sm font-semibold text-foreground">{selectedDelivery.supplier}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <Truck className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Driver</p>
                        <p className="text-sm font-semibold text-foreground">{selectedDelivery.driverName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Driver Contact</p>
                        <p className="text-sm font-semibold text-foreground">{selectedDelivery.driverPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedDelivery.photos.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Delivery Photos</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedDelivery.photos.map((photo, idx) => (
                        <div key={idx} className="aspect-video rounded-xl bg-muted/30 flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
