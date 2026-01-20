"use client"

import { useState, useEffect } from "react"
import SuperAdminLayout from "../components/SuperAdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, AlertCircle, HardDrive } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface DatabaseInfo {
  tables: Array<{ name: string; count: number }>
  total_tables: number
  database_size_mb: number
}

export default function DatabasePage() {
  const [databaseInfo, setDatabaseInfo] = useState<DatabaseInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [backupMessage, setBackupMessage] = useState("")

  const headers = {
    "Content-Type": "application/json",
    "X-User-Role": "super_admin",
    "X-User-ID": "1",
  }

  const fetchDatabaseInfo = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/api/v1/system/database`, { headers })
      if (!res.ok) throw new Error("Failed to fetch database info")
      const data = await res.json()
      setDatabaseInfo(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBackupDatabase = async () => {
    try {
      setLoading(true)
      setBackupMessage("")
      const res = await fetch(`${API_URL}/api/v1/system/database/backup`, {
        method: "POST",
        headers,
      })

      if (!res.ok) throw new Error("Failed to backup database")
      const data = await res.json()
      setBackupMessage(`Backup created: ${data.backup_path}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDatabaseInfo()
  }, [])

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Database className="h-8 w-8" />
              Database Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Database tables, statistics, and backup management
            </p>
          </div>

          <Button onClick={handleBackupDatabase} disabled={loading}>
            <HardDrive className="h-4 w-4 mr-2" />
            Backup Database
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {backupMessage && (
          <Alert>
            <AlertDescription>{backupMessage}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-8">Loading database info...</div>
        ) : databaseInfo ? (
          <div className="space-y-4">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{databaseInfo.total_tables}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Database Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {databaseInfo.database_size_mb.toFixed(2)} MB
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {databaseInfo.tables.reduce((sum, t) => sum + t.count, 0)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tables Information */}
            <Card>
              <CardHeader>
                <CardTitle>Database Tables</CardTitle>
                <CardDescription>Overview of all tables and record counts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Table Name</TableHead>
                      <TableHead>Record Count</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {databaseInfo.tables.map((table) => (
                      <TableRow key={table.name}>
                        <TableCell className="font-medium capitalize">
                          {table.name.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell>{table.count}</TableCell>
                        <TableCell>
                          <Badge variant={table.count > 0 ? "default" : "secondary"}>
                            {table.count > 0 ? "Active" : "Empty"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </SuperAdminLayout>
  )
}
