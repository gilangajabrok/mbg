"use client"

import { useState } from "react"
import { SupplierLayout } from "@/components/layout/supplier-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, Search, Plus, Edit, Trash2, Eye, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react"
import { supplierData } from "@/lib/data/supplier-dummy-data"
import { motion } from "framer-motion"

export default function SupplierProducts() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const categories = ["all", "main-course", "side-dish", "beverage", "dessert", "snack"]

  const filteredProducts = supplierData.products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700 border-red-300" }
    if (stock < 50) return { label: "Low Stock", color: "bg-amber-100 text-amber-700 border-amber-300" }
    return { label: "In Stock", color: "bg-green-100 text-green-700 border-green-300" }
  }

  return (
    <SupplierLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
              Product Catalog
            </h1>
            <p className="text-muted-foreground mt-1">Manage your product inventory</p>
          </div>
          <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-0 bg-white/50 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                <p className="text-3xl font-bold">{supplierData.products.length}</p>
              </div>
              <Package className="w-10 h-10 text-emerald-600" />
            </div>
          </Card>
          <Card className="border-0 bg-white/50 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">In Stock</p>
                <p className="text-3xl font-bold">{supplierData.products.filter((p) => p.stock > 0).length}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </Card>
          <Card className="border-0 bg-white/50 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Low Stock</p>
                <p className="text-3xl font-bold">
                  {supplierData.products.filter((p) => p.stock < 50 && p.stock > 0).length}
                </p>
              </div>
              <AlertCircle className="w-10 h-10 text-amber-600" />
            </div>
          </Card>
          <Card className="border-0 bg-white/50 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Price</p>
                <p className="text-3xl font-bold">
                  $
                  {(supplierData.products.reduce((sum, p) => sum + p.price, 0) / supplierData.products.length).toFixed(
                    2,
                  )}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-blue-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 bg-white/50 backdrop-blur-xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(category)}
                  className={categoryFilter === category ? "bg-gradient-to-r from-emerald-600 to-green-600" : ""}
                >
                  {category.replace("-", " ")}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock)
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 bg-white/50 backdrop-blur-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <Package className="w-16 h-16 text-emerald-600" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {product.category.replace("-", " ")}
                        </Badge>
                      </div>
                      <Badge className={`${stockStatus.color} border text-xs`}>{stockStatus.label}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-bold text-emerald-700">${product.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Stock:</span>
                        <span className="font-semibold">{product.stock} units</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Minimum Order:</span>
                        <span className="font-semibold">{product.minimumOrder}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-emerald-600 text-emerald-700 bg-transparent"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-600 text-blue-700 bg-transparent">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-700 bg-transparent">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </SupplierLayout>
  )
}
