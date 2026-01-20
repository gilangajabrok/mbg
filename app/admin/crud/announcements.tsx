"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { CrudPage } from "@/components/crud-page"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAnnouncementsList, useAnnouncementCreate, useAnnouncementUpdate, useAnnouncementDelete } from "@/hooks/use-mbg-api"
import { type Announcement, type CreateAnnouncementRequest, type UpdateAnnouncementRequest } from "@/lib/api-types"

type FormMode = "create" | "edit"

export default function AnnouncementsCrudPage() {
  const list = useAnnouncementsList()
  const create = useAnnouncementCreate()
  const update = useAnnouncementUpdate()
  const delete_ = useAnnouncementDelete()
  const { toast } = useToast()
  const { data: session } = useSession()

  const role = (session?.user as Record<string, unknown> | undefined)?.role as string | undefined
  const isAdmin = useMemo(() => role === "admin" || role === "super_admin", [role])

  const [formMode, setFormMode] = useState<FormMode>("create")
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CreateAnnouncementRequest>({
    title: "",
    content: "",
    school_id: "",
    is_active: true,
  })

  useEffect(() => {
    list.fetch().catch((err) => {
      const message = err instanceof Error ? err.message : "Failed to load announcements"
      toast({ title: "Failed to load", description: message, variant: "destructive" })
    })
  }, [])

  const resetForm = () => {
    setForm({ title: "", content: "", school_id: "", is_active: true })
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

  const handleOpenEdit = (announcement: Announcement) => {
    if (!isAdmin) {
      toast({ title: "Access denied", description: "Admin only action", variant: "destructive" })
      return
    }
    setFormMode("edit")
    setEditingId(announcement.id)
    setForm({
      title: announcement.title,
      content: announcement.content,
      school_id: announcement.school_id,
      is_active: announcement.is_active,
    })
    setOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (formMode === "create") {
        await create.create(form)
        toast({ title: "Announcement created", description: form.title })
      } else if (editingId) {
        await update.update(editingId, form as UpdateAnnouncementRequest)
        toast({ title: "Announcement updated", description: form.title })
      }
      setOpen(false)
      resetForm()
      list.fetch()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save announcement"
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
      toast({ title: "Announcement deleted" })
      list.fetch()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete announcement"
      toast({ title: "Delete failed", description: message, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      {!isAdmin && (
        <Alert variant="destructive">
          <AlertDescription>Only admin or super admin can manage announcements.</AlertDescription>
        </Alert>
      )}

      <CrudPage
        title="Announcements Management"
        description="Manage system announcements"
        items={list.items}
        loading={list.loading}
        error={list.error}
        columns={[
          { accessorKey: "title", header: "Title" },
          { accessorKey: "school_id", header: "School" },
          { accessorKey: "is_active", header: "Active" },
          { accessorKey: "created_at", header: "Created" },
        ]}
        onCreate={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        canCreate={isAdmin}
        canEdit={isAdmin}
        canDelete={isAdmin}
        searchableFields={["id", "title"]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formMode === "create" ? "Add Announcement" : "Edit Announcement"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea id="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="school_id">School ID *</Label>
              <Input id="school_id" value={form.school_id} onChange={(e) => setForm({ ...form, school_id: e.target.value })} required />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="is_active"
                type="checkbox"
                checked={form.is_active ?? true}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              <Label htmlFor="is_active">Active</Label>
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
