"use client"

import { useState, useEffect } from "react"
import { Plus, Search, ShoppingBag, Truck, School as SchoolIcon } from "lucide-react"
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
import { orderApi, Order } from "@/lib/api/orderApi"
import { useTenant } from "@/components/providers/tenant-provider"

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()
    const { organizationId } = useTenant()

    useEffect(() => {
        fetchOrders()
    }, [organizationId])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const data = await orderApi.getAll()
            setOrders(data.content || [])
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch orders",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Orders</h1>
                    <p className="text-muted-foreground mt-1">Manage food orders and procurement</p>
                </div>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Create Order
                </Button>
            </div>

            <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
                <div className="rounded-xl border border-border/50 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead>Order ID</TableHead>
                                <TableHead>School</TableHead>
                                <TableHead>Supplier</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        Loading orders...
                                    </TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-muted/30">
                                        <TableCell className="font-mono text-xs">
                                            {order.id.substring(0, 8)}...
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <SchoolIcon className="w-4 h-4 text-muted-foreground" />
                                                <span>{order.school?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Truck className="w-4 h-4 text-muted-foreground" />
                                                <span>{order.supplier?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <p className="font-medium">{order.meal?.name}</p>
                                                <p className="text-xs text-muted-foreground">Qty: {order.quantity}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            IDR {order.totalPrice?.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
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
