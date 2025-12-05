import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>
      <Card className="p-6">
        <Skeleton className="h-80 w-full" />
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-64 w-full" />
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </Card>
    </div>
  )
}
