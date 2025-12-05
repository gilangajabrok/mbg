"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Calendar, Coffee, UtensilsCrossed, Apple, AlertTriangle } from "lucide-react"
import { adminMealPlans, type MealPlanItem } from "@/lib/data/admin-dummy-data"
import { useSound } from "@/lib/sound-provider"

export default function AdminMealsPage() {
  const { playSound } = useSound()
  const [selectedMeal, setSelectedMeal] = useState<MealPlanItem | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const getMealIcon = (type: string) => {
    switch (type) {
      case "breakfast":
        return Coffee
      case "lunch":
        return UtensilsCrossed
      case "snack":
        return Apple
      default:
        return UtensilsCrossed
    }
  }

  const getMealColor = (type: string) => {
    switch (type) {
      case "breakfast":
        return "from-yellow-500 to-orange-500"
      case "lunch":
        return "from-blue-500 to-indigo-600"
      case "snack":
        return "from-green-500 to-emerald-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meal Plans</h1>
            <p className="text-muted-foreground mt-1">Manage meal plans and nutritional information</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playSound("click")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Meal Plan
          </motion.button>
        </div>

        {/* Calendar View */}
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-foreground">Weekly Meal Schedule</h2>
          </div>

          <div className="space-y-6">
            {adminMealPlans.map((meal, index) => {
              const MealIcon = getMealIcon(meal.mealType)

              return (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-muted/30 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    playSound("click")
                    setSelectedMeal(meal)
                    setShowDetailModal(true)
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getMealColor(meal.mealType)} flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                      <MealIcon className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{meal.name}</h3>
                          <p className="text-sm text-muted-foreground">{meal.description}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            meal.status === "confirmed"
                              ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                              : meal.status === "planned"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                          }`}
                        >
                          {meal.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Date</p>
                          <p className="text-sm font-semibold text-foreground">{meal.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Meal Type</p>
                          <p className="text-sm font-semibold text-foreground capitalize">{meal.mealType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Calories</p>
                          <p className="text-sm font-semibold text-foreground">{meal.calories} kcal</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Supplier</p>
                          <p className="text-sm font-semibold text-foreground">{meal.supplier}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Cost</p>
                          <p className="text-sm font-semibold text-foreground">Rp {meal.cost.toLocaleString()}</p>
                        </div>
                      </div>

                      {meal.allergens.length > 0 && (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <p className="text-xs text-muted-foreground">Allergens: {meal.allergens.join(", ")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl border border-border/50 max-w-2xl w-full"
            >
              <div className="p-6 border-b border-border/50">
                <h2 className="text-2xl font-bold text-foreground">{selectedMeal.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{selectedMeal.description}</p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Nutrition Facts</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedMeal.calories}</p>
                      <p className="text-xs text-muted-foreground mt-1">Calories</p>
                    </div>
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedMeal.protein}g</p>
                      <p className="text-xs text-muted-foreground mt-1">Protein</p>
                    </div>
                    <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 text-center">
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{selectedMeal.carbs}g</p>
                      <p className="text-xs text-muted-foreground mt-1">Carbs</p>
                    </div>
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-center">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{selectedMeal.fat}g</p>
                      <p className="text-xs text-muted-foreground mt-1">Fat</p>
                    </div>
                  </div>
                </div>

                {selectedMeal.allergens.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Allergen Information</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMeal.allergens.map((allergen, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400 text-sm font-medium"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Supplier</p>
                    <p className="text-sm font-semibold text-foreground">{selectedMeal.supplier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Cost per Meal</p>
                    <p className="text-sm font-semibold text-foreground">Rp {selectedMeal.cost.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border/50 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 rounded-lg border border-border hover:bg-muted transition-colors font-medium text-sm"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
  )
}
