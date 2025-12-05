"use client"

import { motion } from "framer-motion"
import { Database, HardDrive, Server, RefreshCw, Download, Settings } from "lucide-react"
import { useSound } from "@/hooks/use-sound"

const databaseStats = [
  { label: "Total Size", value: "2.4 TB", icon: HardDrive, color: "text-blue-500" },
  { label: "Active Connections", value: "247", icon: Server, color: "text-green-500" },
  { label: "Queries/sec", value: "1,234", icon: Database, color: "text-purple-500" },
  { label: "Avg Response Time", value: "45ms", icon: RefreshCw, color: "text-orange-500" },
]

const recentBackups = [
  { id: 1, name: "Full Backup", date: "2025-01-15 03:00:00", size: "2.3 TB", status: "completed" },
  { id: 2, name: "Incremental Backup", date: "2025-01-14 03:00:00", size: "145 GB", status: "completed" },
  { id: 3, name: "Full Backup", date: "2025-01-13 03:00:00", size: "2.2 TB", status: "completed" },
]

export default function DatabaseOversight() {
  const { play } = useSound()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Database & System Oversight</h2>
          <p className="text-sm text-muted-foreground">Monitor database health and manage backups</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => play("click")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Settings className="w-4 h-4" />
          System Config
        </motion.button>
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {databaseStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-muted/30 rounded-lg p-4 text-center"
            >
              <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Backup Management */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Backups</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => play("click")}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Create Backup
          </motion.button>
        </div>

        <div className="space-y-3">
          {recentBackups.map((backup, index) => (
            <motion.div
              key={backup.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{backup.name}</div>
                  <div className="text-sm text-muted-foreground">{backup.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">{backup.size}</div>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-medium">
                  {backup.status}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => play("click")}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* System Health Indicators */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">CPU Usage</div>
          <div className="text-xl font-bold text-foreground">45%</div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }} />
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Memory Usage</div>
          <div className="text-xl font-bold text-foreground">62%</div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: "62%" }} />
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Disk Usage</div>
          <div className="text-xl font-bold text-foreground">78%</div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: "78%" }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
