import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function OrdersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Card className="p-6">
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-5 w-1/2 mb-6" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
