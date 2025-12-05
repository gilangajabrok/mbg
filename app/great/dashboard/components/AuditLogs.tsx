"use client"

import { motion } from "framer-motion"
import { Activity, User, Database, Settings, AlertCircle, CheckCircle } from "lucide-react"

const mockLogs = [
  {
    id: 1,
    user: "admin@mbg.id",
    action: "Updated user permissions",
    type: "user",
    status: "success",
    timestamp: "2025-01-15 10:30:45",
    details: "Modified role for user john@example.com",
  },
  {
    id: 2,
    user: "superadmin@mbg.id",
    action: "Database backup initiated",
    type: "database",
    status: "success",
    timestamp: "2025-01-15 09:15:22",
    details: "Full backup completed successfully",
  },
  {
    id: 3,
    user: "admin@mbg.id",
    action: "Failed login attempt",
    type: "security",
    status: "error",
    timestamp: "2025-01-15 08:45:10",
    details: "Invalid credentials from IP 192.168.1.100",
  },
  {
    id: 4,
    user: "superadmin@mbg.id",
    action: "System configuration updated",
    type: "settings",
    status: "success",
    timestamp: "2025-01-15 08:20:33",
    details: "Updated API rate limits",
  },
  {
    id: 5,
    user: "admin@mbg.id",
    action: "New user registered",
    type: "user",
    status: "success",
    timestamp: "2025-01-15 07:55:18",
    details: "User alice@example.com created",
  },
]

const getIcon = (type: string) => {
  switch (type) {
    case "user":
      return User
    case "database":
      return Database
    case "settings":
      return Settings
    case "security":
      return AlertCircle
    default:
      return Activity
  }
}

export default function AuditLogs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Audit Logs</h2>
        <p className="text-sm text-muted-foreground">Track all system activities and changes</p>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {mockLogs.map((log, index) => {
          const Icon = getIcon(log.type)
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  log.type === "user"
                    ? "bg-blue-500/10 text-blue-500"
                    : log.type === "database"
                      ? "bg-purple-500/10 text-purple-500"
                      : log.type === "settings"
                        ? "bg-orange-500/10 text-orange-500"
                        : "bg-red-500/10 text-red-500"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{log.action}</div>
                    <div className="text-sm text-muted-foreground">by {log.user}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {log.status === "success" ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{log.details}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Load More */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-3 border border-border/50 rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
      >
        Load More Logs
      </motion.button>
    </motion.div>
  )
}
