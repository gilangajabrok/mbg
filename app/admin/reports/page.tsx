"use client"

import { useState, useEffect } from "react"
import { BarChart3, Building2, Users, School, ShieldCheck, AlertCircle, FileStack } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { reportApi, GovernanceDashboard } from "@/lib/api/reportApi"

export default function ReportsPage() {
  const [data, setData] = useState<GovernanceDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const dashboardData = await reportApi.getDashboard()
      setData(dashboardData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch governance data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Governance Reports</h1>
          <p className="text-muted-foreground mt-1">Platform-wide statistics and compliance overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Building2}
          label="Total Organizations"
          value={data?.tenantCount || 0}
          color="text-blue-600"
          bgColor="bg-blue-100"
          subValue={`${data?.activeTenants || 0} Active`}
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={data?.totalUsers || 0}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <StatCard
          icon={School}
          label="Total Schools"
          value={data?.totalSchools || 0}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
        <StatCard
          icon={ShieldCheck}
          label="Compliance Score"
          value={`${data?.complianceScore || 0}%`}
          color="text-green-600"
          bgColor="bg-green-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" /> System Alerts
          </h3>
          <div className="flex items-center justify-center h-40 bg-muted/20 rounded-xl">
            <div className="text-center">
              <span className="text-4xl font-bold text-red-500">{data?.activeAlerts || 0}</span>
              <p className="text-muted-foreground text-sm mt-1">Active Alerts</p>
            </div>
          </div>
        </div>
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FileStack className="w-5 h-5 text-yellow-500" /> Pending Approvals
          </h3>
          <div className="flex items-center justify-center h-40 bg-muted/20 rounded-xl">
            <div className="text-center">
              <span className="text-4xl font-bold text-yellow-600">{data?.pendingDocuments || 0}</span>
              <p className="text-muted-foreground text-sm mt-1">Documents Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, bgColor, subValue }: any) {
  return (
    <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${bgColor} ${color} dark:bg-opacity-20`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-2xl font-bold text-foreground">
            {value}
          </h3>
          {subValue && <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>}
        </div>
      </div>
    </div>
  )
}
