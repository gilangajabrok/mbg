"use client"

import { useState, useEffect } from "react"
import SuperAdminLayout from "../components/SuperAdminLayout"
import AuditLogs from "../components/AuditLogs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface AuditStats {
  total_logs: number
  by_action: Record<string, number>
  by_resource: Record<string, number>
  by_role: Record<string, number>
  recent_activity: any[]
}

export default function AuditPage() {
  const [stats, setStats] = useState<AuditStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const headers = {
    "Content-Type": "application/json",
    "X-User-Role": "super_admin",
    "X-User-ID": "1",
  }

  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/api/v1/audit/stats`, { headers })
      if (!res.ok) throw new Error("Failed to fetch audit stats")
      const data = await res.json()
      setStats(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8" />
            Audit & Monitoring
          </h1>
          <p className="text-muted-foreground mt-2">
            System activity logs and user action tracking
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_logs}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {Object.entries(stats.by_action).map(([action, count]) => (
                    <div key={action} className="flex justify-between text-sm">
                      <Badge variant="outline">{action}</Badge>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {Object.entries(stats.by_resource).slice(0, 3).map(([resource, count]) => (
                    <div key={resource} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{resource}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">By Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {Object.entries(stats.by_role).map(([role, count]) => (
                    <div key={role} className="flex justify-between text-sm">
                      <Badge>{role}</Badge>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Audit Logs Table */}
        <AuditLogs />
      </div>
    </SuperAdminLayout>
  )
}
