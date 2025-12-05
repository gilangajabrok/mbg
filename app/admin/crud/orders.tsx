"use client"
import { useEffect } from "react"
import { useOrdersList, useOrderCreate, useOrderUpdate, useOrderDelete } from "@/hooks/use-mbg-api"
import { CrudPage } from "@/components/crud-page"

export default function OrdersCrudPage() {
  const list = useOrdersList()
  const create = useOrderCreate()
  const update = useOrderUpdate()
  const delete_ = useOrderDelete()
  
  useEffect(() => { list.fetch() }, [])

  return (
    <CrudPage
      title="Orders Management"
      description="Manage all orders"
      items={list.items}
      loading={list.loading}
      error={list.error}
      columns={[
        { accessorKey: "status", header: "Status" },
        { accessorKey: "quantity", header: "Quantity" },
        { accessorKey: "total_price", header: "Price" },
        { accessorKey: "delivery_date", header: "Delivery Date" },
      ]}
      onCreate={() => {
        const supplier_id = prompt("Supplier ID:")
        if (!supplier_id) return
        create
          .create({
            supplier_id,
            quantity: 1,
            total_price: 0,
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
