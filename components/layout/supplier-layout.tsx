'use client'

import { useState, useCallback } from 'react'
import { SupplierSidebar } from './supplier-sidebar'
import { SupplierTopbar } from './supplier-topbar'
import { useMBGKeyboard } from '@/hooks/use-mbg-keyboard'

export function SupplierLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleKeyboardShortcut = useCallback((key: string) => {
    switch (key) {
      case 'sidebar-toggle':
        setSidebarCollapsed((prev) => !prev)
        break
      case 'search-open':
        // Would open search modal
        break
      case 'settings-open':
        // Would navigate to settings
        break
    }
  }, [])

  useMBGKeyboard(handleKeyboardShortcut)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex">
      <SupplierSidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 transition-all duration-300 min-h-screen flex flex-col">
        <SupplierTopbar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
