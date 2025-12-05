"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Star, Phone, Mail } from "lucide-react"
import { adminSuppliers } from "@/lib/data/admin-dummy-data"
import { useSound } from "@/lib/sound-provider"

export default function AdminSuppliersPage() {
  const { playSound } = useSound()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredSuppliers = adminSuppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || supplier.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || supplier.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      catering: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
      produce: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
      dairy: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
      meat: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
      bakery: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
    }
    return colors[category] || "bg-gray-100 text-gray-700"
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Supplier Management</h1>
            <p className="text-muted-foreground mt-1">Manage suppliers and their products</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playSound("click")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Supplier
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search suppliers..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onFocus={() => playSound("hover")}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => {
                playSound("click")
                setSelectedCategory(e.target.value)
              }}
              className="px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="all">All Categories</option>
              <option value="catering">Catering</option>
              <option value="produce">Produce</option>
              <option value="dairy">Dairy</option>
              <option value="meat">Meat</option>
              <option value="bakery">Bakery</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => {
                playSound("click")
                setSelectedStatus(e.target.value)
              }}
              className="px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Suppliers Table */}
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Documents
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredSuppliers.map((supplier, index) => (
                  <motion.tr
                    key={supplier.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => playSound("click")}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground">{supplier.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(supplier.category)}`}
                      >
                        {supplier.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          {supplier.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {supplier.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold text-foreground">{supplier.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">{supplier.totalOrders}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          supplier.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                            : supplier.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                              : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                        }`}
                      >
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {supplier.documents.businessLicense && (
                          <div className="w-2 h-2 rounded-full bg-green-500" title="Business License" />
                        )}
                        {supplier.documents.healthCertificate && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" title="Health Certificate" />
                        )}
                        {supplier.documents.taxDocument && (
                          <div className="w-2 h-2 rounded-full bg-purple-500" title="Tax Document" />
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
  )
}
