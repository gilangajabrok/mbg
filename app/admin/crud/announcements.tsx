"use client"
import { useEffect } from "react"
import { useAnnouncementsList, useAnnouncementCreate, useAnnouncementUpdate, useAnnouncementDelete } from "@/hooks/use-mbg-api"
import { CrudPage } from "@/components/crud-page"

export default function AnnouncementsCrudPage() {
  const list = useAnnouncementsList()
  const create = useAnnouncementCreate()
  const update = useAnnouncementUpdate()
  const delete_ = useAnnouncementDelete()
  
  useEffect(() => { list.fetch() }, [])

  return (
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
      onCreate={() => {
        const title = prompt("Announcement title:")
        if (!title) return
        create
          .create({
            title,
            content: prompt("Content:") || "",
            school_id: "",
          })
          .then(() => list.fetch())
          .catch(console.error)
      }}
      onEdit={() => {
        alert("Edit functionality available in full form mode")
      }}
      onDelete={(id) =>
        delete_
          .delete(id)
          .then(() => list.fetch())
          .catch(console.error)
      }
      searchableFields={["id"]}
    />
  )
}
