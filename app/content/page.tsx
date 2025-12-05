'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Eye, Clock, User } from 'lucide-react'
import { SectionHeader } from '@/components/business/section-header'
import { CardContainer } from '@/components/ui/card-container'
import { BadgeCustom } from '@/components/ui/badge-custom'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/lib/toast-provider'
import { pageVariants, staggerContainerVariants, staggerItemVariants } from '@/lib/motion-variants'

const contentItems = [
  {
    id: 1,
    title: 'Getting Started with Admin Dashboard',
    status: 'published',
    views: 2341,
    author: 'Sarah Johnson',
    date: '2024-01-15',
  },
  {
    id: 2,
    title: 'Advanced UI Components Guide',
    status: 'draft',
    views: 0,
    author: 'Mike Chen',
    date: '2024-01-14',
  },
  {
    id: 3,
    title: 'Performance Optimization Tips',
    status: 'published',
    views: 5234,
    author: 'Emma Davis',
    date: '2024-01-13',
  },
]

export default function ContentPage() {
  const { addToast } = useToast()

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="p-8 space-y-8 max-w-7xl mx-auto"
    >
      <SectionHeader
        title="Content"
        subtitle="Manage all your content and publications"
        action={{
          label: 'Create Content',
          onClick: () => {
            addToast({
              title: 'Content Editor',
              description: 'Content editor will open here',
              type: 'info',
            })
          },
        }}
      />

      {/* Content Grid */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {contentItems.map(item => (
          <motion.div key={item.id} variants={staggerItemVariants}>
            <CardContainer
              interactive
              className="h-full flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText size={20} className="text-primary" />
                </div>
                <BadgeCustom variant={item.status === 'published' ? 'success' : 'warning'}>
                  {item.status === 'published' ? 'Published' : 'Draft'}
                </BadgeCustom>
              </div>

              <h3 className="font-semibold text-foreground mb-2 flex-1">{item.title}</h3>

              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye size={16} />
                  <span>{item.views} views</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User size={16} />
                  <span>{item.author}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={16} />
                  <span>{item.date}</span>
                </div>
              </div>
            </CardContainer>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
