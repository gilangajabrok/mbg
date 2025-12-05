"use client"

import { useState, useEffect } from "react"
import { useSchoolsList, useSchoolCreate, useSchoolUpdate, useSchoolDelete } from "@/hooks/use-mbg-api"
import { School, CreateSchoolRequest, UpdateSchoolRequest } from "@/lib/api-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSchoolsPage() {
  const list = useSchoolsList()
  const create = useSchoolCreate()
  const update = useSchoolUpdate()
  const delete_ = useSchoolDelete()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  
  const [formData, setFormData] = useState<CreateSchoolRequest>({
    name: "",
    email: "",
    phone: "",
    address: "",
    principal: "",
  })

  useEffect(() => {
    list.fetch()
  }, [])

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      principal: "",
    })
  }

  const handleCreateOpen = () => {
    resetForm()
    setIsCreateOpen(true)
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await create.create(formData)
      setIsCreateOpen(false)
      resetForm()
      list.fetch()
    } catch (error) {
      console.error("Failed to create school:", error)
    }
  }

  const handleEditOpen = (school: School) => {
    setSelectedSchool(school)
    setFormData({
      name: school.name,
      email: school.email || "",
      phone: school.phone || "",
      address: school.address || "",
      principal: school.principal || "",
    })
    setIsEditOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSchool) return
    
    try {
      await update.update(selectedSchool.id, formData as UpdateSchoolRequest)
      setIsEditOpen(false)
      setSelectedSchool(null)
      resetForm()
      list.fetch()
    } catch (error) {
      console.error("Failed to update school:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this school?")) return
    
    try {
      await delete_.delete(id)
      list.fetch()
    } catch (error) {
      console.error("Failed to delete school:", error)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Schools Management</CardTitle>
          <Button onClick={handleCreateOpen}>
            <Plus className="mr-2 h-4 w-4" />
            Add School
          </Button>
        </CardHeader>
        <CardContent>
          {list.loading ? (
            <div className="text-center py-8">Loading schools...</div>
          ) : list.error ? (
            <div className="text-center py-8 text-red-500">{list.error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.items.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{school.email || "-"}</TableCell>
                    <TableCell>{school.phone || "-"}</TableCell>
                    <TableCell>{school.principal || "-"}</TableCell>
                    <TableCell>{school.students_count || 0}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditOpen(school)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(school.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {list.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No schools found. Click "Add School" to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New School</DialogTitle>
            <DialogDescription>
              Enter the school details below to create a new school.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">School Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="principal">Principal</Label>
                <Input
                  id="principal"
                  value={formData.principal}
                  onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={create.loading}>
                {create.loading ? "Creating..." : "Create School"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
            <DialogDescription>
              Update the school details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">School Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-principal">Principal</Label>
                <Input
                  id="edit-principal"
                  value={formData.principal}
                  onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={update.loading}>
                {update.loading ? "Updating..." : "Update School"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
