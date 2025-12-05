"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { MBGLayout } from "./mbg-layout"

export function MBGLayoutWrapper({ children }: { children: ReactNode }) {
  // Never apply global layout - each route should manage its own layout
  return <>{children}</>
}
