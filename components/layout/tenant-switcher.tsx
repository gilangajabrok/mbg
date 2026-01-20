"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Building2, Store } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useTenant } from "@/components/providers/tenant-provider"
import { organizationApi } from "@/lib/api/organizationApi"
import { branchApi } from "@/lib/api/branchApi"

interface TenantOption {
    value: string
    label: string
    type: "organization" | "branch"
}

export function TenantSwitcher() {
    const { organizationId, setOrganizationId, branchId, setBranchId, setTenantName, tenantName } = useTenant()
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState<TenantOption[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchTenants = async () => {
            setLoading(true)
            try {
                // Fetch user's organizations and branches
                // Theoretically, an endpoint like /api/user/tenants would be better
                // For now, we simulate fetching available contexts from APIs
                // In a real implementation, JWT usually dictates this or a specific endpoint

                const orgsRes = await organizationApi.getAll(0, 10)
                // const branchesRes = await branchApi.getAll(0, 10, organizationId || 0)

                const orgOptions: TenantOption[] = (orgsRes.data?.content || []).map((org: any) => ({
                    value: org.id.toString(),
                    label: org.name,
                    type: "organization"
                }))

                // Mock branches for demo if org is selected
                // In real app: fetch branches belonging to selected org
                const branchOptions: TenantOption[] = []
                if (organizationId) {
                    const branchesRes = await branchApi.getAll(0, 10, Number(organizationId))
                    const branches = (branchesRes.data?.content || []).map((b: any) => ({
                        value: b.id.toString(),
                        label: b.name,
                        type: "branch"
                    }))
                    branchOptions.push(...branches)
                }

                setItems([...orgOptions, ...branchOptions])
            } catch (error) {
                console.error("Failed to fetch tenants", error)
            } finally {
                setLoading(false)
            }
        }

        if (open) {
            fetchTenants()
        }
    }, [open, organizationId])

    const currentLabel = tenantName || "Select Tenant"

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between text-sm font-normal"
                >
                    {organizationId ? (
                        <div className="flex items-center gap-2 truncate">
                            {branchId ? <Store className="h-4 w-4 text-orange-500" /> : <Building2 className="h-4 w-4 text-blue-500" />}
                            <span className="truncate">{currentLabel}</span>
                        </div>
                    ) : (
                        "Select Organization"
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search tenant..." />
                    <CommandList>
                        <CommandEmpty>No tenant found.</CommandEmpty>
                        <CommandGroup heading="Organizations">
                            {items.filter(i => i.type === "organization").map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.label}
                                    onSelect={(currentValue) => {
                                        setOrganizationId(item.value)
                                        setBranchId(null) // Reset branch when org changes
                                        setTenantName(item.label)
                                        setOpen(false)
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Building2 className="mr-2 h-4 w-4 text-blue-500" />
                                    {item.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            organizationId === item.value && !branchId ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        {organizationId && (
                            <>
                                <CommandSeparator />
                                <CommandGroup heading="Branches">
                                    {items.filter(i => i.type === "branch").map((item) => (
                                        <CommandItem
                                            key={item.value}
                                            value={item.label}
                                            onSelect={(currentValue) => {
                                                setBranchId(item.value)
                                                setTenantName(item.label)
                                                setOpen(false)
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <Store className="mr-2 h-4 w-4 text-orange-500" />
                                            {item.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    branchId === item.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                    <CommandItem onSelect={() => { /* Add logic to create branch */ }}>
                                        <span className="text-muted-foreground text-xs pl-6">+ Add Branch</span>
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
