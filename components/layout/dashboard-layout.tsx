'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { useKeyboardShortcuts } from '@/lib/shortcuts'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useKeyboardShortcuts({
    'toggle-sidebar': () => setSidebarOpen(prev => !prev),
    'open-search': () => {
      // Trigger search functionality
    },
    'theme-toggle': () => {
      // Toggle theme
    },
  })

  if (!mounted) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-16 border-b border-border bg-card" />
          <main className="flex-1 overflow-auto bg-background" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto bg-background">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
