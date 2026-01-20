"use client"

import { useEffect, useMemo, useState } from "react"
import SuperAdminLayout from "../components/SuperAdminLayout"
import { StatsGrid } from "@/components/stats-grid"
import { ChartCard } from "@/components/chart-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Users, Database, FileDown } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface AuditStats {
  total_logs: number
  by_action: Record<string, number>
  by_resource: Record<string, number>
  by_role: Record<string, number>
}

interface UserStats {
  total_users: number
  active_users: number
  by_role: Record<string, number>
}

interface DatabaseInfo {
  tables: Array<{ name: string; count: number }>
  total_tables: number
  database_size_mb: number
}

export default function ReportsPage() {
  const [auditStats, setAuditStats] = useState<AuditStats | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const headers = {
    "Content-Type": "application/json",
    "X-User-Role": "super_admin",
    "X-User-ID": "1",
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError("")

      const [auditRes, userRes, dbRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/audit/stats`, { headers }),
        fetch(`${API_URL}/api/v1/users/stats`, { headers }),
        fetch(`${API_URL}/api/v1/system/database`, { headers }),
      ])

      if (!auditRes.ok) throw new Error("Failed to fetch audit stats")
      if (!userRes.ok) throw new Error("Failed to fetch user stats")
      if (!dbRes.ok) throw new Error("Failed to fetch database info")

      const [auditData, userData, dbData] = await Promise.all([
        auditRes.json(),
        userRes.json(),
        dbRes.json(),
      ])

      setAuditStats(auditData)
      setUserStats(userData)
      setDbInfo(dbData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const totalRecords = useMemo(() => {
    if (!dbInfo) return 0
    return dbInfo.tables.reduce((sum, t) => sum + t.count, 0)
  }, [dbInfo])

  const exportAuditCSV = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/audit?limit=1000`, { headers })
      if (!res.ok) throw new Error("Failed to fetch audit logs for export")
      const data = await res.json()
      const logs = data.data || []
      const rows = [
        ["id", "created_at", "user_id", "user_role", "action", "resource", "resource_id", "details", "ip_address"],
        ...logs.map((l: any) => [
          l.id, l.created_at, l.user_id, l.user_role, l.action, l.resource, l.resource_id, (l.details || "").replace(/\n/g, " "), l.ip_address,
        ]),
      ]
      const csv = rows.map(r => r.map(String).map(s => '"' + s.replace(/"/g, '""') + '"').join(",")).join("\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `audit_logs_${new Date().toISOString()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">System trends and data overview</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchData} disabled={loading}>Refresh</Button>
            <Button onClick={exportAuditCSV}>
              <FileDown className="h-4 w-4 mr-2" />
              Export Audit CSV
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <StatsGrid
          items={[
            {
              label: "Total Audit Logs",
              value: auditStats?.total_logs ?? 0,
              icon: <Activity className="h-5 w-5" />,
            },
            {
              label: "Total Users",
              value: userStats?.total_users ?? 0,
              icon: <Users className="h-5 w-5" />,
            },
            {
              label: "Active Users",
              value: userStats?.active_users ?? 0,
              icon: <Users className="h-5 w-5" />,
            },
            {
              label: "Total Records",
              value: totalRecords,
              icon: <Database className="h-5 w-5" />,
            },
          ]}
        />

        {/* Actions Distribution */}
        <ChartCard
          title="Actions Distribution"
          subtitle="Counts of actions across the system"
          action={<Badge variant="outline">Audit</Badge>}
        >
          <div className="space-y-2">
            {Object.entries(auditStats?.by_action || {}).map(([action, count]) => (
              <div key={action} className="flex items-center gap-3">
                <div className="w-32 text-sm text-muted-foreground capitalize">{action}</div>
                <div className="flex-1 h-3 bg-muted rounded">
                  <div
                    className="h-3 bg-blue-600 rounded"
                    style={{ width: `${Math.min(100, (count / Math.max(1, auditStats?.total_logs || 1)) * 100)}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm font-medium">{count}</div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Users by Role */}
        <ChartCard
          title="Users by Role"
          subtitle="Distribution of users by role"
          action={<Badge variant="outline">Users</Badge>}
        >
          <div className="space-y-2">
            {Object.entries(userStats?.by_role || {}).map(([role, count]) => (
              <div key={role} className="flex items-center gap-3">
                <div className="w-32 text-sm text-muted-foreground capitalize">{role.replace("_", " ")}</div>
                <div className="flex-1 h-3 bg-muted rounded">
                  <div
                    className="h-3 bg-emerald-600 rounded"
                    style={{ width: `${Math.min(100, (count / Math.max(1, userStats?.total_users || 1)) * 100)}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm font-medium">{count}</div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Top Tables */}
        <Card>
          <CardHeader>
            <CardTitle>Database Tables Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(dbInfo?.tables || []).map((t) => (
                  <TableRow key={t.name}>
                    <TableCell className="capitalize">{t.name.replace(/_/g, " ")}</TableCell>
                    <TableCell>{t.count}</TableCell>
                    <TableCell>
                      <Badge variant={t.count > 0 ? "default" : "secondary"}>
                        {t.count > 0 ? "Active" : "Empty"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
      </div>
    </SuperAdminLayout>
  )
}
