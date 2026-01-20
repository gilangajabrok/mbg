"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, User, Database, Settings, AlertCircle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface AuditLog {
  id: string
  user_id: string
  user_role: string
  action: string
  resource: string
  resource_id: string
  details: string
  ip_address: string
  user_agent: string
  created_at: string
}

const getIcon = (resource: string) => {
  switch (resource) {
    case "users":
      return User
    case "schools":
    case "students":
      return Database
    case "suppliers":
    case "meals":
      return Settings
    default:
      return Activity
  }
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const headers = {
    "Content-Type": "application/json",
    "X-User-Role": "super_admin",
    "X-User-ID": "1",
  }

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/api/v1/audit?limit=50`, { headers })
      if (!res.ok) throw new Error("Failed to fetch audit logs")
      const data = await res.json()
      setLogs(data.data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

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

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {/* Logs Table */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading logs...</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No audit logs found</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, index) => {
                const Icon = getIcon(log.resource)
                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="text-sm">
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.user_role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        log.action === "create" ? "default" :
                        log.action === "delete" ? "destructive" : "secondary"
                      }>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span>{log.resource}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {log.details || log.resource_id}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.ip_address}
                    </TableCell>
                  </motion.tr>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Load More */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={fetchLogs}
        className="w-full mt-4 py-3 border border-border/50 rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
      >
        Refresh Logs
      </motion.button>
    </motion.div>
  )
}
