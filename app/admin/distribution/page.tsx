"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Truck, Package, Clock, CheckCircle } from "lucide-react"
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
import { distributionApi, Delivery } from "@/lib/api/distributionApi"
import { useTenant } from "@/components/providers/tenant-provider"

export default function DistributionPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { organizationId } = useTenant()

  useEffect(() => {
    fetchDeliveries()
  }, [organizationId])

  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      const data = await distributionApi.getAll()
      setDeliveries(data.content || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch deliveries",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs px-2 py-1 rounded-full"><Clock className="w-3 h-3" /> Pending</span>;
      case 'DISPATCHED': return <span className="flex items-center gap-1 text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs px-2 py-1 rounded-full"><Truck className="w-3 h-3" /> Dispatched</span>;
      case 'DELIVERED': return <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded text-xs px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Delivered</span>;
      default: return <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">{status}</span>;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Distribution</h1>
          <p className="text-muted-foreground mt-1">Track order shipments and delivery status</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> New Delivery
        </Button>
      </div>

      <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Delivery ID</TableHead>
                <TableHead>Order Info</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Loading deliveries...
                  </TableCell>
                </TableRow>
              ) : deliveries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No deliveries found.
                  </TableCell>
                </TableRow>
              ) : (
                deliveries.map((delivery) => (
                  <TableRow key={delivery.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs">
                      {delivery.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">Order #{delivery.order?.id?.substring(0, 6)}</p>
                        <p className="text-xs text-muted-foreground">{delivery.order?.school?.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{delivery.driverName || "Unassigned"}</p>
                        <p className="text-xs text-muted-foreground">{delivery.vehicleNumber || "-"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(delivery.status)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {delivery.deliveredAt || delivery.id /* Placeholder for date */}
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
