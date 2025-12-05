"use client"
import { useEffect } from "react"
import { useSuppliersList, useSupplierCreate, useSupplierUpdate, useSupplierDelete } from "@/hooks/use-mbg-api"
import { CrudPage } from "@/components/crud-page"

export default function SuppliersCrudPage() {
  const list = useSuppliersList()
  const create = useSupplierCreate()
  const update = useSupplierUpdate()
  const delete_ = useSupplierDelete()
  
  useEffect(() => { list.fetch() }, [])

  return (
    <CrudPage
      title="Suppliers Management"
      description="Manage suppliers"
      items={list.items}
      loading={list.loading}
      error={list.error}
      columns={[
        { accessorKey: "name", header: "Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "phone", header: "Phone" },
        { accessorKey: "rating", header: "Rating" },
      ]}
      onCreate={() => {
        const name = prompt("Supplier name:")
        if (!name) return
        create
          .create({
            name,
            email: prompt("Email:") || "",
            phone: prompt("Phone:") || "",
            address: "",
          })
          .then(() => list.fetch())
          .catch(console.error)
      }}
      onEdit={(supplier) => {
        const name = prompt("Supplier name:", supplier.name)
        if (!name) return
        update.update(supplier.id, { name }).then(() => list.fetch()).catch(console.error)
      }}
      onDelete={(id) =>
        delete_
          .delete(id)
          .then(() => list.fetch())
          .catch(console.error)
      }
      searchableFields={["name", "email"]}
    />
  )
}
