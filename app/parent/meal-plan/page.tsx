"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSound } from "@/lib/sound-provider"
import {
  Calendar,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  Info,
  AlertTriangle,
  Flame,
  Beef,
  Wheat,
  Droplet,
} from "lucide-react"
import { dummyMealPlans } from "@/lib/data/parent-dummy-data"

export default function MealPlanPage() {
  const { playSound } = useSound()
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly")
  const [selectedMeal, setSelectedMeal] = useState<any>(null)

  return (
    <>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Meal Plan</h1>
        <p className="text-muted-foreground">View nutritious meals planned for your children</p>
      </motion.div>

      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-pink-200 dark:border-pink-900/30 bg-transparent"
            onMouseEnter={() => playSound("hover")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <p className="font-semibold">January 20 - 24, 2025</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-pink-200 dark:border-pink-900/30 bg-transparent"
            onMouseEnter={() => playSound("hover")}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <TabsList className="bg-white/50 dark:bg-slate-900/50 border border-pink-200/30 dark:border-pink-900/30">
            <TabsTrigger value="weekly" className="data-[state=active]:bg-pink-500/20">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-pink-500/20">
              Monthly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Meal Plan Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {dummyMealPlans.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-pink-200/30 dark:border-pink-900/30 hover:shadow-lg transition-all">
              {/* Day Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{day.day}</h3>
                    <p className="text-sm text-muted-foreground">{day.date}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 text-green-600 border-green-200">
                  Balanced
                </Badge>
              </div>

              {/* Meals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Breakfast */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border border-amber-200/30 dark:border-amber-900/30 cursor-pointer"
                  onClick={() => {
                    setSelectedMeal({ ...day.breakfast, mealType: "Breakfast", day: day.day })
                    playSound("press")
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <UtensilsCrossed className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                      Breakfast
                    </p>
                  </div>
                  <h4 className="font-semibold mb-2">{day.breakfast.name}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      <span>{day.breakfast.calories} cal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Beef className="w-3 h-3" />
                      <span>{day.breakfast.protein}g</span>
                    </div>
                  </div>
                  {day.breakfast.allergens.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {day.breakfast.allergens.map((allergen) => (
                        <Badge
                          key={allergen}
                          variant="outline"
                          className="text-xs bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200"
                        >
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Lunch */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200/30 dark:border-green-900/30 cursor-pointer"
                  onClick={() => {
                    setSelectedMeal({ ...day.lunch, mealType: "Lunch", day: day.day })
                    playSound("press")
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <UtensilsCrossed className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
                      Lunch
                    </p>
                  </div>
                  <h4 className="font-semibold mb-2">{day.lunch.name}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      <span>{day.lunch.calories} cal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Beef className="w-3 h-3" />
                      <span>{day.lunch.protein}g</span>
                    </div>
                  </div>
                  {day.lunch.allergens.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {day.lunch.allergens.map((allergen) => (
                        <Badge
                          key={allergen}
                          variant="outline"
                          className="text-xs bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200"
                        >
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Snack */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-200/30 dark:border-blue-900/30 cursor-pointer"
                  onClick={() => {
                    setSelectedMeal({ ...day.snack, mealType: "Snack", day: day.day })
                    playSound("press")
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <UtensilsCrossed className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                      Snack
                    </p>
                  </div>
                  <h4 className="font-semibold mb-2">{day.snack.name}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      <span>{day.snack.calories} cal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Beef className="w-3 h-3" />
                      <span>{day.snack.protein}g</span>
                    </div>
                  </div>
                  {day.snack.allergens.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {day.snack.allergens.map((allergen) => (
                        <Badge
                          key={allergen}
                          variant="outline"
                          className="text-xs bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200"
                        >
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Meal Detail Modal */}
      <AnimatePresence>
        {selectedMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMeal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-200/30 dark:border-pink-900/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {selectedMeal.mealType} • {selectedMeal.day}
                    </Badge>
                    <h2 className="text-2xl font-bold">{selectedMeal.name}</h2>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedMeal(null)} className="rounded-full">
                    ✕
                  </Button>
                </div>

                {/* Nutrition Facts */}
                <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-950/20 dark:to-pink-900/20 border-pink-200/30 dark:border-pink-900/30 mb-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Nutrition Facts
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-orange-500/20 flex items-center justify-center mb-2">
                        <Flame className="w-6 h-6 text-orange-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">Calories</p>
                      <p className="font-bold">{selectedMeal.calories}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/20 flex items-center justify-center mb-2">
                        <Beef className="w-6 h-6 text-red-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">Protein</p>
                      <p className="font-bold">{selectedMeal.protein}g</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/20 flex items-center justify-center mb-2">
                        <Wheat className="w-6 h-6 text-amber-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">Carbs</p>
                      <p className="font-bold">{selectedMeal.carbs}g</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-yellow-500/20 flex items-center justify-center mb-2">
                        <Droplet className="w-6 h-6 text-yellow-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">Fat</p>
                      <p className="font-bold">{selectedMeal.fat}g</p>
                    </div>
                  </div>
                </Card>

                {/* Ingredients */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeal.ingredients.map((ingredient: string) => (
                      <Badge key={ingredient} variant="outline" className="bg-white/50 dark:bg-slate-800/50">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Allergens */}
                {selectedMeal.allergens.length > 0 && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <h3 className="font-semibold text-red-600">Allergen Warning</h3>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Contains: {selectedMeal.allergens.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
