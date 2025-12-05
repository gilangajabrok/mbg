"use client"

import SuperAdminLayout from "./components/SuperAdminLayout"
import AnalyticsPanel from "./components/AnalyticsPanel"
import UserManagement from "./components/UserManagement"
import AuditLogs from "./components/AuditLogs"
import DatabaseOversight from "./components/DatabaseOversight"

export default function GreatDashboardPage() {
  return (
    <SuperAdminLayout>
      <div className="flex flex-col gap-8 w-full">
        <AnalyticsPanel />
        <UserManagement />
        <AuditLogs />
        <DatabaseOversight />
      </div>
    </SuperAdminLayout>
  )
}
