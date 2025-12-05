'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { SectionHeader } from '@/components/business/section-header'
import { CardContainer } from '@/components/ui/card-container'
import { DataTable } from '@/components/ui/data-table'
import { BadgeCustom } from '@/components/ui/badge-custom'
import { Modal } from '@/components/ui/modal'
import { useToast } from '@/lib/toast-provider'
import { useSound } from '@/lib/sound-provider'
import { pageVariants, staggerItemVariants } from '@/lib/motion-variants'

interface AdminUser {
  id: string | number
  name: string
  email: string
  role: string
  status: string
  joinDate: string
}

const adminUsers: AdminUser[] = [
  {
    id: 1,
    name: 'Alice Admin',
    email: 'alice@admin.com',
    role: 'Super Admin',
    status: 'active',
    joinDate: '2023-06-15',
  },
  {
    id: 2,
    name: 'Bob Manager',
    email: 'bob@admin.com',
    role: 'Manager',
    status: 'active',
    joinDate: '2023-08-20',
  },
  {
    id: 3,
    name: 'Charlie Editor',
    email: 'charlie@admin.com',
    role: 'Editor',
    status: 'inactive',
    joinDate: '2023-09-10',
  },
  {
    id: 4,
    name: 'Diana Moderator',
    email: 'diana@admin.com',
    role: 'Moderator',
    status: 'active',
    joinDate: '2023-10-05',
  },
  {
    id: 5,
    name: 'Eve Support',
    email: 'eve@admin.com',
    role: 'Support',
    status: 'active',
    joinDate: '2023-11-12',
  },
]

const adminColumns = [
  {
    key: 'name' as const,
    label: 'Name',
    render: (value: string) => <p className="font-medium">{value}</p>,
  },
  {
    key: 'email' as const,
    label: 'Email',
  },
  {
    key: 'role' as const,
    label: 'Role',
    render: (value: string) => (
      <BadgeCustom variant="info">{value}</BadgeCustom>
    ),
  },
  {
    key: 'status' as const,
    label: 'Status',
    render: (value: string) => (
      <BadgeCustom variant={value === 'active' ? 'success' : 'warning'}>
        {value === 'active' ? 'Active' : 'Inactive'}
      </BadgeCustom>
    ),
  },
  {
    key: 'joinDate' as const,
    label: 'Join Date',
  },
]

export default function AdminPage() {
  const { addToast } = useToast()
  const { playSound } = useSound()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null)

  const handleAddAdmin = () => {
    playSound('click')
    setSelectedAdmin(null)
    setIsModalOpen(true)
    addToast({
      title: 'Add New Admin',
      description: 'Fill in the form to create a new admin user',
      type: 'info',
    })
  }

  const handleEditAdmin = (admin: AdminUser) => {
    playSound('click')
    setSelectedAdmin(admin)
    setIsModalOpen(true)
  }

  const handleDeleteAdmin = (admin: AdminUser) => {
    playSound('error')
    addToast({
      title: 'Admin Deleted',
      description: `${admin.name} has been removed from the system`,
      type: 'success',
    })
  }

  const handleRowClick = (admin: AdminUser) => {
    handleEditAdmin(admin)
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="p-8 space-y-8 max-w-7xl mx-auto"
    >
      <SectionHeader
        title="Admin Management"
        subtitle="Manage team members and permissions"
        action={{
          label: 'Add Admin',
          onClick: handleAddAdmin,
        }}
      />

      {/* Admin Table */}
      <motion.div variants={staggerItemVariants}>
        <CardContainer>
          <DataTable<AdminUser>
            columns={adminColumns}
            data={adminUsers}
            onRowClick={handleRowClick}
          />
        </CardContainer>
      </motion.div>

      {/* Admin Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAdmin ? 'Edit Admin' : 'Add New Admin'}
        footer={
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors font-medium text-sm"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playSound('success')
                addToast({
                  title: selectedAdmin ? 'Admin Updated' : 'Admin Created',
                  description: `${selectedAdmin ? 'Changes have been saved' : 'New admin has been added successfully'}`,
                  type: 'success',
                })
                setIsModalOpen(false)
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
            >
              {selectedAdmin ? 'Save Changes' : 'Create Admin'}
            </motion.button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={selectedAdmin?.name || ''}
              placeholder="Enter full name"
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue={selectedAdmin?.email || ''}
              placeholder="Enter email address"
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role
            </label>
            <select
              defaultValue={selectedAdmin?.role || 'Editor'}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Super Admin</option>
              <option>Manager</option>
              <option>Editor</option>
              <option>Moderator</option>
              <option>Support</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              defaultValue={selectedAdmin?.status || 'active'}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
