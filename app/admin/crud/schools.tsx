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
import { useSchoolsList, useSchoolCreate, useSchoolUpdate, useSchoolDelete } from "@/hooks/use-mbg-api"
import { type CreateSchoolRequest, type School, type UpdateSchoolRequest } from "@/lib/api-types"

type FormMode = "create" | "edit"

export default function SchoolsCrudPage() {
  const list = useSchoolsList()
  const create = useSchoolCreate()
  const update = useSchoolUpdate()
  const delete_ = useSchoolDelete()
  const { toast } = useToast()
  const { data: session } = useSession()

  const role = (session?.user as Record<string, unknown> | undefined)?.role as string | undefined
  const isAdmin = useMemo(() => role === "admin" || role === "super_admin", [role])

  const [formMode, setFormMode] = useState<FormMode>("create")
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CreateSchoolRequest>({
    name: "",
    email: "",
    phone: "",
    address: "",
    principal: "",
  })

  useEffect(() => {
    list.fetch().catch((err) => {
      const message = err instanceof Error ? err.message : "Failed to load schools"
      toast({ title: "Failed to load", description: message, variant: "destructive" })
    })
  }, [])

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", address: "", principal: "" })
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

  const handleOpenEdit = (school: School) => {
    if (!isAdmin) {
      toast({ title: "Access denied", description: "Admin only action", variant: "destructive" })
      return
    }
    setFormMode("edit")
    setEditingId(school.id)
    setForm({
      name: school.name,
      email: school.email || "",
      phone: school.phone || "",
      address: school.address || "",
      principal: school.principal || "",
    })
    setOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (formMode === "create") {
        await create.create(form)
        toast({ title: "School created", description: form.name })
      } else if (editingId) {
        await update.update(editingId, form as UpdateSchoolRequest)
        toast({ title: "School updated", description: form.name })
      }
      setOpen(false)
      resetForm()
      list.fetch()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save school"
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
      toast({ title: "School deleted" })
      list.fetch()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete school"
      toast({ title: "Delete failed", description: message, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      {!isAdmin && (
        <Alert variant="destructive">
          <AlertDescription>Only admin or super admin can manage schools.</AlertDescription>
        </Alert>
      )}

      <CrudPage
        title="Schools Management"
        description="Create, update, and manage schools"
        items={list.items}
        loading={list.loading}
        error={list.error}
        columns={[
          { accessorKey: "name", header: "Name" },
          { accessorKey: "email", header: "Email" },
          { accessorKey: "phone", header: "Phone" },
          { accessorKey: "principal", header: "Principal" },
        ]}
        onCreate={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        canCreate={isAdmin}
        canEdit={isAdmin}
        canDelete={isAdmin}
        searchableFields={["name", "email"]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formMode === "create" ? "Add School" : "Edit School"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="principal">Principal</Label>
              <Input id="principal" value={form.principal} onChange={(e) => setForm({ ...form, principal: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
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
