"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface TenantContextType {
    organizationId: string | null
    branchId: string | null
    setOrganizationId: (id: string | null) => void
    setBranchId: (id: string | null) => void
    tenantName: string | null
    setTenantName: (name: string | null) => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
    const [organizationId, setOrganizationId] = useState<string | null>(null)
    const [branchId, setBranchId] = useState<string | null>(null)
    const [tenantName, setTenantName] = useState<string | null>(null)
    const router = useRouter()

    // Load from localStorage on mount
    useEffect(() => {
        const storedOrgId = localStorage.getItem("organizationId")
        const storedBranchId = localStorage.getItem("branchId")
        const storedTenantName = localStorage.getItem("tenantName")

        if (storedOrgId) setOrganizationId(storedOrgId)
        if (storedBranchId) setBranchId(storedBranchId)
        if (storedTenantName) setTenantName(storedTenantName)
    }, [])

    // Sync to localStorage when changed
    useEffect(() => {
        if (organizationId) localStorage.setItem("organizationId", organizationId)
        else localStorage.removeItem("organizationId")

        if (branchId) localStorage.setItem("branchId", branchId)
        else localStorage.removeItem("branchId")

        if (tenantName) localStorage.setItem("tenantName", tenantName)
        else localStorage.removeItem("tenantName")
    }, [organizationId, branchId, tenantName])

    return (
        <TenantContext.Provider
            value={{
                organizationId,
                branchId,
                setOrganizationId,
                setBranchId,
                tenantName,
                setTenantName
            }}
        >
            {children}
        </TenantContext.Provider>
    )
}

export function useTenant() {
    const context = useContext(TenantContext)
    if (context === undefined) {
        throw new Error("useTenant must be used within a TenantProvider")
    }
    return context
}
