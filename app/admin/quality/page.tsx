"use client"

import { useState, useEffect } from "react"
import { Plus, Search, ClipboardCheck, Star, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
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
import { qualityApi, QualityCheck } from "@/lib/api/qualityApi"
import { useTenant } from "@/components/providers/tenant-provider"

export default function QualityPage() {
  const [checks, setChecks] = useState<QualityCheck[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { organizationId } = useTenant()

  useEffect(() => {
    fetchChecks()
  }, [organizationId])

  const fetchChecks = async () => {
    try {
      setLoading(true)
      const data = await qualityApi.getAll()
      setChecks(data.content || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch quality checks",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'PASSED': return <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded text-xs rounded-full"><CheckCircle className="w-3 h-3" /> Passed</span>;
      case 'WARNING': return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs rounded-full"><AlertTriangle className="w-3 h-3" /> Warning</span>;
      case 'FAILED': return <span className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded text-xs rounded-full"><XCircle className="w-3 h-3" /> Failed</span>;
      default: return <span>{result}</span>;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quality Control</h1>
          <p className="text-muted-foreground mt-1">Inspection records and standards</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> New Inspection
        </Button>
      </div>

      <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Check Date</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Inspector</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Loading checks...
                  </TableCell>
                </TableRow>
              ) : checks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No quality checks found.
                  </TableCell>
                </TableRow>
              ) : (
                checks.map((check) => (
                  <TableRow key={check.id} className="hover:bg-muted/30">
                    <TableCell className="text-sm">
                      {new Date(check.checkDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{check.school?.name || "No School"}</p>
                        {check.meal && <p className="text-xs text-muted-foreground">{check.meal.name}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getResultBadge(check.result)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-orange-500">
                        <span className="text-sm font-bold">{check.rating}</span>
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {check.inspectorName || "Unknown"}
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
