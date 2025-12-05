import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function QualityLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-64 w-full" />
          </Card>
        ))}
      </div>
    </div>
  )
}
