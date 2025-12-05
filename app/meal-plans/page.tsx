'use client'

import { motion } from 'framer-motion'
import { Plus, Edit2, Copy } from 'lucide-react'
import { dummyMealPlan } from '@/lib/mbg-dummy-data'
import { Button } from '@/components/ui/button'

export default function MealPlansPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Meal Plans</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage weekly meal menus and nutrition</p>
        </div>
        <Button className="gap-2 bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4" />
          New Meal Plan
        </Button>
      </div>

      {/* Current Week */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Weekly Menu</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">{dummyMealPlan.week}</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Copy className="w-4 h-4" />
            Copy to Next Week
          </Button>
        </div>

        {/* Meal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {dummyMealPlan.meals.map((meal, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-white/50 dark:bg-slate-700/30 rounded-xl p-4 border border-white/20 dark:border-slate-600/20"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">{meal.day}</h3>
                <button className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 line-clamp-2">{meal.meal}</p>
              
              <div className="bg-blue-500/10 rounded-lg p-3 mb-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Calories:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{meal.nutrition.calories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Protein:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{meal.nutrition.protein}g</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                Supplier: <span className="font-medium text-slate-900 dark:text-white">{meal.supplier}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
