"use client"

import { useState, useEffect } from "react"
import SuperAdminLayout from "../components/SuperAdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Server, AlertCircle, Activity, Cpu, Database } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface SystemHealth {
  status: string
  timestamp: string
  database: {
    status: string
    open_connections: number
    in_use: number
    idle: number
    max_open_conns: number
  }
  system: {
    go_version: string
    num_goroutine: number
    num_cpu: number
  }
}

interface SystemMetrics {
  memory: {
    alloc_mb: number
    total_alloc_mb: number
    sys_mb: number
    num_gc: number
  }
  goroutines: number
  cpu_count: number
  timestamp: string
}

export default function SystemPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const headers = {
    "Content-Type": "application/json",
    "X-User-Role": "super_admin",
    "X-User-ID": "1",
  }

  const fetchSystemHealth = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/api/v1/system/health`, { headers })
      if (!res.ok) throw new Error("Failed to fetch system health")
      const data = await res.json()
      setHealth(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSystemMetrics = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/system/metrics`, { headers })
      if (!res.ok) throw new Error("Failed to fetch system metrics")
      const data = await res.json()
      setMetrics(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchSystemHealth()
    fetchSystemMetrics()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchSystemHealth()
      fetchSystemMetrics()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Server className="h-8 w-8" />
            System Monitoring
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time system health and performance metrics
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-8">Loading system info...</div>
        ) : (
          <div className="space-y-4">
            {/* System Status */}
            {health && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant={health.status === "ok" ? "default" : "destructive"} className="text-lg">
                      {health.status.toUpperCase()}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last checked: {new Date(health.timestamp).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Database Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant={health.database.status === "healthy" ? "default" : "destructive"} className="text-lg">
                      {health.database.status.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Database Connections */}
            {health && (
              <Card>
                <CardHeader>
                  <CardTitle>Database Connections</CardTitle>
                  <CardDescription>Active database connection pool status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Open Connections</p>
                      <p className="text-2xl font-bold">{health.database.open_connections}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">In Use</p>
                      <p className="text-2xl font-bold">{health.database.in_use}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Idle</p>
                      <p className="text-2xl font-bold">{health.database.idle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Max Open</p>
                      <p className="text-2xl font-bold">{health.database.max_open_conns}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* System Information */}
            {health && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    System Information
                  </CardTitle>
                  <CardDescription>Runtime and system details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Go Version</p>
                      <p className="text-lg font-semibold">{health.system.go_version}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Goroutines</p>
                      <p className="text-lg font-semibold">{health.system.num_goroutine}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CPU Cores</p>
                      <p className="text-lg font-semibold">{health.system.num_cpu}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Memory Metrics */}
            {metrics && (
              <Card>
                <CardHeader>
                  <CardTitle>Memory Usage</CardTitle>
                  <CardDescription>Current memory allocation and garbage collection stats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Allocated</p>
                      <p className="text-2xl font-bold">{metrics.memory.alloc_mb} MB</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Allocated</p>
                      <p className="text-2xl font-bold">{metrics.memory.total_alloc_mb} MB</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">System</p>
                      <p className="text-2xl font-bold">{metrics.memory.sys_mb} MB</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">GC Runs</p>
                      <p className="text-2xl font-bold">{metrics.memory.num_gc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </SuperAdminLayout>
  )
}
