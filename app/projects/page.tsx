'use client'

import { motion } from 'framer-motion'
import { FolderOpen, Users, Calendar } from 'lucide-react'
import { mbgMotion } from '@/lib/mbg-motion'

const PROJECTS_DATA = [
  { id: 1, name: 'Design System v2', status: 'In Progress', team: 5, dueDate: '2024-04-30', progress: 65 },
  { id: 2, name: 'Mobile App Launch', status: 'Planning', team: 8, dueDate: '2024-05-15', progress: 30 },
  { id: 3, name: 'API Migration', status: 'In Progress', team: 4, dueDate: '2024-04-15', progress: 85 },
  { id: 4, name: 'Dashboard Redesign', status: 'Completed', team: 3, dueDate: '2024-03-31', progress: 100 },
]

export default function ProjectsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Projects</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">View and manage all active projects</p>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {PROJECTS_DATA.map((project) => (
          <motion.div key={project.id} variants={itemVariants} {...mbgMotion.cardFloatHover}>
            <div className="bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-800/90 dark:to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{project.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{project.status}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Progress</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{project.progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/30 dark:bg-slate-700/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  />
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{project.team} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{project.dueDate}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
