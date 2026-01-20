"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { CrudPage } from "@/components/crud-page"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useOrdersList, useOrderCreate, useOrderUpdate, useOrderDelete } from "@/hooks/use-mbg-api"
import { type CreateOrderRequest, type Order, type UpdateOrderRequest } from "@/lib/api-types"

type FormMode = "create" | "edit"

export default function OrdersCrudPage() {
  const list = useOrdersList()
  const create = useOrderCreate()
  const update = useOrderUpdate()
  const delete_ = useOrderDelete()
  const { toast } = useToast()
  const { data: session } = useSession()

  const role = (session?.user as Record<string, unknown> | undefined)?.role as string | undefined
  const isAdmin = useMemo(() => role === "admin" || role === "super_admin", [role])

  const [formMode, setFormMode] = useState<FormMode>("create")
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CreateOrderRequest>({
    supplier_id: "",
    school_id: "",
    student_id: "",
    meal_id: "",
    quantity: 1,
    total_price: 0,
    delivery_date: "",
    notes: "",
  })

  useEffect(() => {
    list.fetch().catch((err) => {
      const message = err instanceof Error ? err.message : "Failed to load orders"
      toast({ title: "Failed to load", description: message, variant: "destructive" })
    })
  }, [])

  const resetForm = () => {
    setForm({ supplier_id: "", school_id: "", student_id: "", meal_id: "", quantity: 1, total_price: 0, delivery_date: "", notes: "" })
    setEditingId(null)
  }

  const handleOpenCreate = () => {
    if (!isAdmin) {
      toast({ title: "Access denied", description: "Admin only action", variant: "destructive" })
      return
    }
    resetForm()
    setFormMode("create")
    setOpen(true)
  }

  const handleOpenEdit = (order: Order) => {
    if (!isAdmin) {
      toast({ title: "Access denied", description: "Admin only action", variant: "destructive" })
      return
    }
    setFormMode("edit")
    setEditingId(order.id)
    setForm({
      supplier_id: order.supplier_id,
      school_id: order.school_id || "",
      student_id: order.student_id || "",
      meal_id: order.meal_id || "",
      quantity: order.quantity,
      total_price: order.total_price,
      delivery_date: order.delivery_date || "",
      notes: order.notes || "",
    })
    setOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (formMode === "create") {
        await create.create(form)
        toast({ title: "Order created" })
      } else if (editingId) {
        await update.update(editingId, form as UpdateOrderRequest)
        toast({ title: "Order updated" })
      }
      setOpen(false)
      resetForm()
      list.fetch()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save order"
      toast({ title: "Action failed", description: message, variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      toast({ title: "Access denied", description: "Admin only action", variant: "destructive" })
      return
    }
    try {
      await delete_.delete(id)
      toast({ title: "Order deleted" })
      list.fetch()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete order"
      toast({ title: "Delete failed", description: message, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      {!isAdmin && (
        <Alert variant="destructive">
          <AlertDescription>Only admin or super admin can manage orders.</AlertDescription>
        </Alert>
      )}

      <CrudPage
        title="Orders Management"
        description="Manage all orders"
        items={list.items}
        loading={list.loading}
        error={list.error}
        columns={[
          { accessorKey: "status", header: "Status" },
          { accessorKey: "quantity", header: "Quantity" },
          { accessorKey: "total_price", header: "Price" },
          { accessorKey: "delivery_date", header: "Delivery Date" },
          { accessorKey: "supplier_id", header: "Supplier" },
        ]}
        onCreate={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        canCreate={isAdmin}
        canEdit={isAdmin}
        canDelete={isAdmin}
        searchableFields={["id"]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formMode === "create" ? "Add Order" : "Edit Order"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="supplier_id">Supplier ID *</Label>
              <Input id="supplier_id" value={form.supplier_id} onChange={(e) => setForm({ ...form, supplier_id: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="school_id">School ID</Label>
              <Input id="school_id" value={form.school_id} onChange={(e) => setForm({ ...form, school_id: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student_id">Student ID</Label>
              <Input id="student_id" value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="meal_id">Meal ID</Label>
              <Input id="meal_id" value={form.meal_id} onChange={(e) => setForm({ ...form, meal_id: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input id="quantity" type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="total_price">Total Price *</Label>
                <Input id="total_price" type="number" min={0} value={form.total_price} onChange={(e) => setForm({ ...form, total_price: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="delivery_date">Delivery Date</Label>
              <Input id="delivery_date" type="date" value={form.delivery_date} onChange={(e) => setForm({ ...form, delivery_date: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={create.loading || update.loading}>
              {formMode === "create" ? (create.loading ? "Creating..." : "Create") : update.loading ? "Updating..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
