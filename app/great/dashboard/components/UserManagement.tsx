"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, UserPlus, MoreVertical, Shield, UserX, Key } from "lucide-react"
import { useSound } from "@/hooks/use-sound"

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin", status: "active", lastActive: "2 hours ago" },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "supplier",
    status: "active",
    lastActive: "5 minutes ago",
  },
  { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "parent", status: "inactive", lastActive: "2 days ago" },
  {
    id: 4,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "admin",
    status: "active",
    lastActive: "1 hour ago",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "supplier",
    status: "active",
    lastActive: "30 minutes ago",
  },
]

export default function UserManagement() {
  const { play } = useSound()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">User Management</h2>
          <p className="text-sm text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => play("click")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="supplier">Supplier</option>
          <option value="parent">Parent</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Active</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-border/30 hover:bg-muted/30 transition-colors"
              >
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                        : user.role === "supplier"
                          ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          : "bg-green-500/10 text-green-500 border border-green-500/20"
                    }`}
                  >
                    {user.role === "admin" && <Shield className="w-3 h-3" />}
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-muted-foreground">{user.lastActive}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => play("click")}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="Reset Password"
                    >
                      <Key className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => play("click")}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="Deactivate User"
                    >
                      <UserX className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => play("click")}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
