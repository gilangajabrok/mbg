"use client"
import { useState, useEffect } from "react"
import { useMealsList, useMealCreate, useMealUpdate, useMealDelete } from "@/hooks/use-mbg-api"
import { CrudPage } from "@/components/crud-page"

export default function MealsCrudPage() {
  const list = useMealsList()
  const create = useMealCreate()
  const update = useMealUpdate()
  const delete_ = useMealDelete()
  
  useEffect(() => { list.fetch() }, [])

  return (
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
      onCreate={() => {
        const name = prompt("Meal name:"); if (!name) return;
        create.create({ name, description: "", calories: 0, protein: 0, carbs: 0, fat: 0, school_id: "" })
          .then(() => list.fetch()).catch(console.error)
      }}
      onEdit={(meal) => {
        const name = prompt("Meal name:", meal.name); if (!name) return;
        update.update(meal.id, { name }).then(() => list.fetch()).catch(console.error)
      }}
      onDelete={(id) => delete_.delete(id).then(() => list.fetch()).catch(console.error)}
      searchableFields={["name"]}
    />
  )
}
