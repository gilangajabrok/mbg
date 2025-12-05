import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      ))}
    </div>
  )
}
