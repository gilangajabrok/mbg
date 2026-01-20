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
import { useStudentsList, useStudentCreate, useStudentUpdate, useStudentDelete } from "@/hooks/use-mbg-api"
import { type CreateStudentRequest, type Student, type UpdateStudentRequest } from "@/lib/api-types"

type FormMode = "create" | "edit"

export default function StudentsCrudPage() {
  const list = useStudentsList()
  const create = useStudentCreate()
  const update = useStudentUpdate()
  const delete_ = useStudentDelete()
  const { toast } = useToast()
  const { data: session } = useSession()

  const role = (session?.user as Record<string, unknown> | undefined)?.role as string | undefined
  const isAdmin = useMemo(() => role === "admin" || role === "super_admin", [role])

  const [formMode, setFormMode] = useState<FormMode>("create")
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CreateStudentRequest>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    school_id: "",
    parent_id: "",
    grade: "",
  })

  useEffect(() => {
    list.fetch().catch((err) => {
      const message = err instanceof Error ? err.message : "Failed to load students"
      toast({ title: "Failed to load", description: message, variant: "destructive" })
    })
  }, [])

  const resetForm = () => {
    setForm({ first_name: "", last_name: "", email: "", phone: "", school_id: "", parent_id: "", grade: "" })
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

  const handleOpenEdit = (student: Student) => {
    if (!isAdmin) {
      toast({ title: "Access denied", description: "Admin only action", variant: "destructive" })
      return
    }
    setFormMode("edit")
    setEditingId(student.id)
    setForm({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email || "",
      phone: student.phone || "",
      school_id: student.school_id,
      parent_id: student.parent_id || "",
      grade: student.grade || "",
    })
    setOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (formMode === "create") {
        await create.create(form)
        toast({ title: "Student created", description: `${form.first_name} ${form.last_name}` })
      } else if (editingId) {
        await update.update(editingId, form as UpdateStudentRequest)
        toast({ title: "Student updated", description: `${form.first_name} ${form.last_name}` })
      }
      setOpen(false)
      resetForm()
      list.fetch()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save student"
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
      toast({ title: "Student deleted" })
      list.fetch()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete student"
      toast({ title: "Delete failed", description: message, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      {!isAdmin && (
        <Alert variant="destructive">
          <AlertDescription>Only admin or super admin can manage students.</AlertDescription>
        </Alert>
      )}

      <CrudPage
        title="Students Management"
        description="Manage student information"
        items={list.items}
        loading={list.loading}
        error={list.error}
        columns={[
          { accessorKey: "first_name", header: "First Name" },
          { accessorKey: "last_name", header: "Last Name" },
          { accessorKey: "grade", header: "Grade" },
          { accessorKey: "school_id", header: "School" },
        ]}
        onCreate={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        canCreate={isAdmin}
        canEdit={isAdmin}
        canDelete={isAdmin}
        searchableFields={["first_name", "last_name"]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formMode === "create" ? "Add Student" : "Edit Student"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input id="first_name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
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
              <Label htmlFor="school_id">School ID *</Label>
              <Input id="school_id" value={form.school_id} onChange={(e) => setForm({ ...form, school_id: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="parent_id">Parent ID</Label>
              <Input id="parent_id" value={form.parent_id} onChange={(e) => setForm({ ...form, parent_id: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="grade">Grade</Label>
              <Input id="grade" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
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
