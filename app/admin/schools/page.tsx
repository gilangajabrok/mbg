"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, School as SchoolIcon, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { schoolApi, School } from "@/lib/api/schoolApi"
import { useTenant } from "@/components/providers/tenant-provider"

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { organizationId, branchId } = useTenant()

  useEffect(() => {
    fetchSchools()
  }, [organizationId, branchId])

  const fetchSchools = async () => {
    try {
      setLoading(true)
      const data = await schoolApi.getAll()
      setSchools(data.content || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch schools",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schools</h1>
          <p className="text-muted-foreground mt-1">Manage schools in your network</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Add School
        </Button>
      </div>

      <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search schools..." className="pl-10" />
          </div>
        </div>

        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Identitas Sekolah</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading schools...
                  </TableCell>
                </TableRow>
              ) : schools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No schools found. Add your first school to get started.
                  </TableCell>
                </TableRow>
              ) : (
                schools.map((school) => (
                  <TableRow key={school.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <SchoolIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{school.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {school.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-foreground">{school.contactPerson}</p>
                        <p className="text-muted-foreground">{school.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground max-w-[200px] truncate">{school.address || "-"}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
