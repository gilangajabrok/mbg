"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DataTable } from "@/components/data-table"
import { Plus, Edit2, Trash2, Loader } from "lucide-react"

interface CrudPageProps<T> {
  title: string
  description: string
  items: T[]
  loading: boolean
  error: string | null
  columns: any[]
  onCreate: () => void
  onEdit: (item: T) => void
  onDelete: (id: string) => void
  canCreate?: boolean
  canEdit?: boolean
  canDelete?: boolean
  searchableFields?: (keyof T)[]
}

export function CrudPage<T extends { id: string }>({
  title,
  description,
  items,
  loading,
  error,
  columns,
  onCreate,
  onEdit,
  onDelete,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  searchableFields = [],
}: CrudPageProps<T>) {
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = items.filter((item) => {
    if (!search) return true
    const query = search.toLowerCase()
    return searchableFields.some((field) => {
      const value = String(item[field] ?? "").toLowerCase()
      return value.includes(query)
    })
  })

  const actionColumn = {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }: any) => (
      <div className="flex gap-2">
        {canEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row.original)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        )}
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteId(row.original.id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        )}
      </div>
    ),
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        {canCreate && (
          <Button onClick={onCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        )}
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <DataTable
            columns={[...columns, actionColumn]}
            data={filtered}
          />
        )}
      </Card>

      {deleteId && (
        <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>Are you sure? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(deleteId)
                  setDeleteId(null)
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
