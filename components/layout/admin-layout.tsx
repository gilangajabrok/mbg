"use client"

import type { ReactNode } from "react"
import AdminSidebar from "./admin-sidebar"
import AdminTopbar from "./admin-topbar"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex">
      <AdminSidebar />
      <div className="flex-1 transition-all duration-300 min-h-screen flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export { AdminLayout }
