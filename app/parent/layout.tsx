"use client"

import type React from "react"

import { ParentLayout } from "@/components/layout/parent-layout"

export default function ParentRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ParentLayout>{children}</ParentLayout>
}
