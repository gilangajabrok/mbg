"use client"
import { useState, useEffect } from "react"
import { useSchoolsList, useSchoolCreate, useSchoolUpdate, useSchoolDelete } from "@/hooks/use-mbg-api"
import { CrudPage } from "@/components/crud-page"

export default function SchoolsCrudPage() {
  const list = useSchoolsList()
  const create = useSchoolCreate()
  const update = useSchoolUpdate()
  const delete_ = useSchoolDelete()
  
  useEffect(() => { list.fetch() }, [])

  return (
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
      onCreate={() => {
        const name = prompt("School name:"); if (!name) return;
        create.create({ name, email: "", phone: "", address: "", principal: "" })
          .then(() => list.fetch()).catch(console.error)
      }}
      onEdit={(school) => {
        const name = prompt("School name:", school.name); if (!name) return;
        update.update(school.id, { name }).then(() => list.fetch()).catch(console.error)
      }}
      onDelete={(id) => delete_.delete(id).then(() => list.fetch()).catch(console.error)}
      searchableFields={["name", "email"]}
    />
  )
}
