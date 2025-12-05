"use client"
import { useState, useEffect } from "react"
import { useStudentsList, useStudentCreate, useStudentUpdate, useStudentDelete } from "@/hooks/use-mbg-api"
import { CrudPage } from "@/components/crud-page"

export default function StudentsCrudPage() {
  const list = useStudentsList()
  const create = useStudentCreate()
  const update = useStudentUpdate()
  const delete_ = useStudentDelete()
  
  useEffect(() => { list.fetch() }, [])

  return (
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
      onCreate={() => {
        const first_name = prompt("First name:"); if (!first_name) return;
        const last_name = prompt("Last name:") || "";
        create.create({ first_name, last_name, school_id: "", email: "" })
          .then(() => list.fetch()).catch(console.error)
      }}
      onEdit={(student) => {
        const first_name = prompt("First name:", student.first_name); if (!first_name) return;
        update.update(student.id, { first_name }).then(() => list.fetch()).catch(console.error)
      }}
      onDelete={(id) => delete_.delete(id).then(() => list.fetch()).catch(console.error)}
      searchableFields={["first_name", "last_name"]}
    />
  )
}
