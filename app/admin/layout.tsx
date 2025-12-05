'use client'

import { ReactNode } from 'react'
import AdminLayout from '@/components/layout/admin-layout'

export default function AdminPagesLayout({ children }: { children: ReactNode }) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  )
}
