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
import { useMealsList, useMealCreate, useMealUpdate, useMealDelete } from "@/hooks/use-mbg-api"
import { type CreateMealRequest, type Meal, type UpdateMealRequest } from "@/lib/api-types"

type FormMode = "create" | "edit"

export default function MealsCrudPage() {
  const list = useMealsList()
  const create = useMealCreate()
  const update = useMealUpdate()
  const delete_ = useMealDelete()
  const { toast } = useToast()
  const { data: session } = useSession()

  const role = (session?.user as Record<string, unknown> | undefined)?.role as string | undefined
  const isAdmin = useMemo(() => role === "admin" || role === "super_admin", [role])

  const [formMode, setFormMode] = useState<FormMode>("create")
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CreateMealRequest>({
    name: "",
    description: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    allergens: "",
    school_id: "",
  })

  useEffect(() => {
    list.fetch().catch((err) => {
      const message = err instanceof Error ? err.message : "Failed to load meals"
      toast({ title: "Failed to load", description: message, variant: "destructive" })
    })
  }, [])

  const resetForm = () => {
    setForm({ name: "", description: "", calories: 0, protein: 0, carbs: 0, fat: 0, allergens: "", school_id: "" })
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

  const handleOpenEdit = (meal: Meal) => {
    if (!isAdmin) {
      toast({ title: "Access denied", description: "Admin only action", variant: "destructive" })
      return
    }
    setFormMode("edit")
    setEditingId(meal.id)
    setForm({
      name: meal.name,
      description: meal.description,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      allergens: meal.allergens || "",
      school_id: meal.school_id,
    })
    setOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (formMode === "create") {
        await create.create(form)
        toast({ title: "Meal created", description: form.name })
      } else if (editingId) {
        await update.update(editingId, form as UpdateMealRequest)
        toast({ title: "Meal updated", description: form.name })
      }
      setOpen(false)
      resetForm()
      list.fetch()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save meal"
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
      toast({ title: "Meal deleted" })
      list.fetch()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete meal"
      toast({ title: "Delete failed", description: message, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      {!isAdmin && (
        <Alert variant="destructive">
          <AlertDescription>Only admin or super admin can manage meals.</AlertDescription>
        </Alert>
      )}

      <CrudPage
        title="Meals Management"
        description="Manage meal options"
        items={list.items}
        loading={list.loading}
        error={list.error}
        columns={[
          { accessorKey: "name", header: "Name" },
          { accessorKey: "calories", header: "Calories" },
          { accessorKey: "protein", header: "Protein (g)" },
          { accessorKey: "school_id", header: "School" },
        ]}
        onCreate={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        canCreate={isAdmin}
        canEdit={isAdmin}
        canDelete={isAdmin}
        searchableFields={["name"]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formMode === "create" ? "Add Meal" : "Edit Meal"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="calories">Calories *</Label>
                <Input id="calories" type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input id="protein" type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input id="carbs" type="number" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input id="fat" type="number" value={form.fat} onChange={(e) => setForm({ ...form, fat: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="allergens">Allergens</Label>
              <Input id="allergens" value={form.allergens} onChange={(e) => setForm({ ...form, allergens: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="school_id">School ID *</Label>
              <Input id="school_id" value={form.school_id} onChange={(e) => setForm({ ...form, school_id: e.target.value })} required />
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
