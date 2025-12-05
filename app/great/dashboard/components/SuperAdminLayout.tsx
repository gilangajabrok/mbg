"use client"

import type React from "react"

import Sidebar from "./Sidebar"

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  )
}
