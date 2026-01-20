"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Calendar, User, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { mealPlanApi, MealPlan } from "@/lib/api/mealPlanApi"
import { useTenant } from "@/components/providers/tenant-provider"

export default function MealPlansPage() {
  const [plans, setPlans] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { organizationId } = useTenant()

  useEffect(() => {
    fetchPlans()
  }, [organizationId])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const data = await mealPlanApi.getAll()
      setPlans(data.content || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch meal plans",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meal Plans</h1>
          <p className="text-muted-foreground mt-1">Student subscriptions and schedules</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Add Plan
        </Button>
      </div>

      <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search plans..." className="pl-10" />
          </div>
        </div>

        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Student</TableHead>
                <TableHead>Meal</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Period</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading plans...
                  </TableCell>
                </TableRow>
              ) : plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No meal plans found.
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{plan.student?.name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-pink-500" />
                        <span>{plan.meal?.name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                        {plan.daysOfWeek || "Everyday"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {plan.startDate} - {plan.endDate}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
