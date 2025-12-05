'use client'

import { SupplierLayout } from '@/components/layout/supplier-layout'

export default function SupplierRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SupplierLayout>{children}</SupplierLayout>
}
