'use client'

import { useState, useCallback } from 'react'
import { MBGSidebar } from './mbg-sidebar'
import { MBGTopbar } from './mbg-topbar'
import { useMBGKeyboard } from '@/hooks/use-mbg-keyboard'

export function MBGLayout({ children }: { children: React.ReactNode }) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <MBGSidebar collapsed={sidebarCollapsed} />
      <MBGTopbar />
      <main className={`ml-64 mt-16 p-6 transition-all duration-300`}>
        {children}
      </main>
    </div>
  )
}
