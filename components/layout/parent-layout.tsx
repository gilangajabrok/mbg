import type React from "react"
import { SidebarParent } from "./sidebar-parent"

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50/30 via-background to-rose-50/30 dark:from-pink-950/10 dark:via-background dark:to-rose-950/10">
      <SidebarParent />
      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto px-6 py-8 max-w-7xl">{children}</div>
      </main>
    </div>
  )
}

export { ParentLayout }
