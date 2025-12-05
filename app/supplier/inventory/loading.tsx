import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function InventoryLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <Skeleton className="h-10 w-full" />
      </Card>
      <Card className="p-6">
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    </div>
  )
}
