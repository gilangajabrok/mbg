"use client"
import { useEffect } from "react"
import { useMealPlansList, useMealPlanCreate, useMealPlanUpdate, useMealPlanDelete } from "@/hooks/use-mbg-api"
import { CrudPage } from "@/components/crud-page"

export default function MealPlansCrudPage() {
  const list = useMealPlansList()
  const create = useMealPlanCreate()
  const update = useMealPlanUpdate()
  const delete_ = useMealPlanDelete()
  
  useEffect(() => { list.fetch() }, [])

  return (
    <CrudPage
      title="Meal Plans Management"
      description="Manage meal plans for students"
      items={list.items}
      loading={list.loading}
      error={list.error}
      columns={[
        { accessorKey: "student_id", header: "Student" },
        { accessorKey: "meal_id", header: "Meal" },
        { accessorKey: "start_date", header: "Start Date" },
        { accessorKey: "end_date", header: "End Date" },
      ]}
      onCreate={() => {
        const student_id = prompt("Student ID:")
        if (!student_id) return
        create
          .create({
            student_id,
            meal_id: "",
            start_date: new Date().toISOString(),
            end_date: "",
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
