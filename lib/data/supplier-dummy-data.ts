// Supplier Panel Dummy Data for MBG System

export interface SupplierOrder {
  id: string
  orderNumber: string
  date: string
  school: string
  mealType: "breakfast" | "lunch" | "snack"
  quantity: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled" | "quality-check"
  deliveryDate: string
  deliveryTime: string
  totalAmount: number
  notes?: string
  priority?: "high" | "medium" | "low"
  items?: { productName: string; quantity: number; price: number }[]
  contactInfo?: { phone: string; email: string; address: string }
}

export interface ProductCatalog {
  id: string
  name: string
  category: "meal" | "ingredient" | "beverage" | "snack" | "main-course" | "side-dish" | "dessert"
  description: string
  price: number
  unit: string
  available: boolean
  image?: string
  allergens: string[]
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  stock?: number
  minimumOrder?: number
}

export interface DeliverySchedule {
  id: string
  date: string
  timeSlot: string
  schools: string[]
  driver: string
  vehicle: string
  status: "scheduled" | "in-progress" | "completed" | "delayed" | "in-transit"
  orders: string[]
  totalMeals: number
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  unit: string
  minStock: number
  maxStock: number
  lastRestocked: string
  supplier?: string
  status: "in-stock" | "low-stock" | "out-of-stock"
}

export interface SupplierDocument {
  id: string
  name: string
  type: "license" | "certificate" | "contract" | "invoice" | "report"
  uploadDate: string
  expiryDate?: string
  status: "active" | "expired" | "pending"
  size: string
}

export interface PerformanceMetric {
  metric: string
  value: number
  target: number
  trend: "up" | "down" | "stable"
  period: string
}

// Orders Data
export const supplierOrders: SupplierOrder[] = [
  {
    id: "ORD001",
    orderNumber: "MBG-2025-001",
    date: "2025-01-15",
    school: "SDN Menteng 01",
    mealType: "lunch",
    quantity: 450,
    status: "confirmed",
    deliveryDate: "2025-01-17",
    deliveryTime: "10:30 AM",
    totalAmount: 8100000,
    notes: "No peanuts for 5 students",
  },
  {
    id: "ORD002",
    orderNumber: "MBG-2025-002",
    date: "2025-01-15",
    school: "SDN Kebayoran 03",
    mealType: "breakfast",
    quantity: 380,
    status: "preparing",
    deliveryDate: "2025-01-17",
    deliveryTime: "07:00 AM",
    totalAmount: 5700000,
  },
  {
    id: "ORD003",
    orderNumber: "MBG-2025-003",
    date: "2025-01-16",
    school: "SDN Cempaka Putih 05",
    mealType: "lunch",
    quantity: 520,
    status: "pending",
    deliveryDate: "2025-01-18",
    deliveryTime: "11:00 AM",
    totalAmount: 9360000,
  },
  {
    id: "ORD004",
    orderNumber: "MBG-2025-004",
    date: "2025-01-16",
    school: "SDN Pondok Indah 02",
    mealType: "snack",
    quantity: 410,
    status: "ready",
    deliveryDate: "2025-01-17",
    deliveryTime: "02:00 PM",
    totalAmount: 3280000,
  },
  {
    id: "ORD005",
    orderNumber: "MBG-2025-005",
    date: "2025-01-14",
    school: "SDN Tanah Abang 04",
    mealType: "lunch",
    quantity: 390,
    status: "delivered",
    deliveryDate: "2025-01-16",
    deliveryTime: "10:45 AM",
    totalAmount: 7020000,
  },
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    school: "Greenfield Elementary",
    status: "pending",
    priority: "high",
    deliveryDate: "2024-01-25",
    items: [
      { productName: "Chicken Rice Bowl", quantity: 150, price: 2250 },
      { productName: "Fresh Fruit Cup", quantity: 150, price: 750 },
    ],
    totalAmount: 3000,
    contactInfo: {
      phone: "+1-555-0101",
      email: "admin@greenfield.edu",
      address: "123 School Lane, Education District",
    },
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    school: "Riverside High School",
    status: "in-progress",
    priority: "medium",
    deliveryDate: "2024-01-26",
    items: [
      { productName: "Turkey Sandwich", quantity: 200, price: 2000 },
      { productName: "Caesar Salad", quantity: 200, price: 1800 },
    ],
    totalAmount: 3800,
    contactInfo: {
      phone: "+1-555-0102",
      email: "admin@riverside.edu",
      address: "456 River Road, Riverside",
    },
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    school: "Sunset Middle School",
    status: "quality-check",
    priority: "low",
    deliveryDate: "2024-01-24",
    items: [
      { productName: "Pasta Marinara", quantity: 180, price: 2700 },
      { productName: "Garlic Bread", quantity: 180, price: 900 },
    ],
    totalAmount: 3600,
    contactInfo: {
      phone: "+1-555-0103",
      email: "admin@sunset.edu",
      address: "789 Sunset Boulevard, West Side",
    },
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    school: "Mountain View Academy",
    status: "ready",
    priority: "high",
    deliveryDate: "2024-01-25",
    items: [
      { productName: "Grilled Chicken Wrap", quantity: 120, price: 1800 },
      { productName: "Vegetable Sticks", quantity: 120, price: 600 },
    ],
    totalAmount: 2400,
    contactInfo: {
      phone: "+1-555-0104",
      email: "admin@mountainview.edu",
      address: "321 Mountain Drive, Heights",
    },
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    school: "Lakeside Elementary",
    status: "delivered",
    priority: "medium",
    deliveryDate: "2024-01-23",
    items: [
      { productName: "Pizza Slice", quantity: 160, price: 2400 },
      { productName: "Apple Juice", quantity: 160, price: 640 },
    ],
    totalAmount: 3040,
    contactInfo: {
      phone: "+1-555-0105",
      email: "admin@lakeside.edu",
      address: "555 Lake Street, Waterfront",
    },
  },
]

// Product Catalog
export const supplierProducts: ProductCatalog[] = [
  {
    id: "PROD001",
    name: "Nasi Uduk with Chicken",
    category: "meal",
    description: "Traditional Indonesian breakfast with fragrant coconut rice and fried chicken",
    price: 15000,
    unit: "portion",
    available: true,
    allergens: ["peanuts", "soy"],
    nutrition: {
      calories: 450,
      protein: 25,
      carbs: 55,
      fat: 15,
    },
  },
  {
    id: "PROD002",
    name: "Gado-Gado Complete",
    category: "meal",
    description: "Mixed vegetables with tofu, tempeh and rich peanut sauce",
    price: 18000,
    unit: "portion",
    available: true,
    allergens: ["peanuts", "soy"],
    nutrition: {
      calories: 520,
      protein: 22,
      carbs: 48,
      fat: 28,
    },
  },
  {
    id: "PROD003",
    name: "Fruit Salad Cup",
    category: "snack",
    description: "Fresh seasonal fruits with honey yogurt",
    price: 8000,
    unit: "cup",
    available: true,
    allergens: ["dairy"],
    nutrition: {
      calories: 180,
      protein: 4,
      carbs: 38,
      fat: 3,
    },
  },
  {
    id: "PROD004",
    name: "Chicken Nuggets Pack",
    category: "snack",
    description: "Premium chicken nuggets with vegetables",
    price: 12000,
    unit: "pack",
    available: true,
    allergens: ["wheat", "soy"],
    nutrition: {
      calories: 320,
      protein: 18,
      carbs: 25,
      fat: 16,
    },
  },
  {
    id: "PROD005",
    name: "Orange Juice Box",
    category: "beverage",
    description: "100% natural orange juice",
    price: 5000,
    unit: "box",
    available: true,
    allergens: [],
    nutrition: {
      calories: 110,
      protein: 2,
      carbs: 26,
      fat: 0,
    },
  },
  {
    id: "1",
    name: "Chicken Rice Bowl",
    category: "main-course",
    description: "Grilled chicken breast with jasmine rice and vegetables",
    price: 15.0,
    stock: 250,
    minimumOrder: 50,
    allergens: ["soy"],
  },
  {
    id: "2",
    name: "Turkey Sandwich",
    category: "main-course",
    description: "Whole wheat sandwich with sliced turkey, lettuce, and tomato",
    price: 10.0,
    stock: 180,
    minimumOrder: 30,
    allergens: ["wheat", "dairy"],
  },
  {
    id: "3",
    name: "Pasta Marinara",
    category: "main-course",
    description: "Penne pasta with homemade marinara sauce and parmesan",
    price: 12.0,
    stock: 320,
    minimumOrder: 40,
    allergens: ["wheat", "dairy"],
  },
  {
    id: "4",
    name: "Caesar Salad",
    category: "side-dish",
    description: "Fresh romaine lettuce with Caesar dressing and croutons",
    price: 9.0,
    stock: 200,
    minimumOrder: 25,
    allergens: ["dairy", "fish"],
  },
  {
    id: "5",
    name: "Fresh Fruit Cup",
    category: "snack",
    description: "Seasonal fresh fruit medley",
    price: 5.0,
    stock: 400,
    minimumOrder: 50,
    allergens: [],
  },
  {
    id: "6",
    name: "Veggie Wrap",
    category: "main-course",
    description: "Whole wheat wrap with hummus and fresh vegetables",
    price: 11.0,
    stock: 45,
    minimumOrder: 30,
    allergens: ["wheat", "sesame"],
  },
  {
    id: "7",
    name: "Chocolate Chip Cookie",
    category: "dessert",
    description: "Freshly baked chocolate chip cookies",
    price: 3.0,
    stock: 500,
    minimumOrder: 100,
    allergens: ["wheat", "dairy", "eggs"],
  },
  {
    id: "8",
    name: "Apple Juice",
    category: "beverage",
    description: "100% natural apple juice box",
    price: 4.0,
    stock: 600,
    minimumOrder: 100,
    allergens: [],
  },
]

// Delivery Schedules
export const supplierDeliverySchedules: DeliverySchedule[] = [
  {
    id: "DEL001",
    date: "2025-01-17",
    timeSlot: "07:00 - 09:00 AM",
    schools: ["SDN Kebayoran 03", "SDN Menteng 01"],
    driver: "Ahmad Yusuf",
    vehicle: "Truck B 1234 XYZ",
    status: "scheduled",
    orders: ["ORD001", "ORD002"],
    totalMeals: 830,
  },
  {
    id: "DEL002",
    date: "2025-01-17",
    timeSlot: "10:00 - 12:00 PM",
    schools: ["SDN Cempaka Putih 05"],
    driver: "Dedi Kurniawan",
    vehicle: "Truck B 5678 ABC",
    status: "scheduled",
    orders: ["ORD003"],
    totalMeals: 520,
  },
  {
    id: "DEL003",
    date: "2025-01-16",
    timeSlot: "10:00 - 12:00 PM",
    schools: ["SDN Tanah Abang 04"],
    driver: "Rudi Hartono",
    vehicle: "Truck B 9012 DEF",
    status: "completed",
    orders: ["ORD005"],
    totalMeals: 390,
  },
  {
    id: "1",
    schoolName: "Greenfield Elementary",
    deliveryDate: "2024-01-25T10:30:00",
    deliveryTime: "10:30 AM",
    address: "123 School Lane, Education District",
    status: "scheduled",
    mealCount: 150,
    driverName: "John Smith",
    vehicleNumber: "VAN-001",
  },
  {
    id: "2",
    schoolName: "Riverside High School",
    deliveryDate: "2024-01-26T11:00:00",
    deliveryTime: "11:00 AM",
    address: "456 River Road, Riverside",
    status: "scheduled",
    mealCount: 200,
    driverName: "Mike Johnson",
    vehicleNumber: "VAN-002",
  },
  {
    id: "3",
    schoolName: "Mountain View Academy",
    deliveryDate: "2024-01-25T09:30:00",
    deliveryTime: "09:30 AM",
    address: "321 Mountain Drive, Heights",
    status: "in-transit",
    mealCount: 120,
    driverName: "Sarah Williams",
    vehicleNumber: "VAN-003",
  },
  {
    id: "4",
    schoolName: "Lakeside Elementary",
    deliveryDate: "2024-01-23T10:00:00",
    deliveryTime: "10:00 AM",
    address: "555 Lake Street, Waterfront",
    status: "delivered",
    mealCount: 160,
    driverName: "David Brown",
    vehicleNumber: "VAN-001",
  },
]

// Inventory
export const supplierInventory: InventoryItem[] = [
  {
    id: "INV001",
    name: "Rice (Premium)",
    category: "Grains",
    currentStock: 500,
    unit: "kg",
    minStock: 200,
    maxStock: 1000,
    lastRestocked: "2025-01-10",
    status: "in-stock",
  },
  {
    id: "INV002",
    name: "Chicken Breast",
    category: "Protein",
    currentStock: 150,
    unit: "kg",
    minStock: 100,
    maxStock: 500,
    lastRestocked: "2025-01-15",
    status: "low-stock",
  },
  {
    id: "INV003",
    name: "Mixed Vegetables",
    category: "Produce",
    currentStock: 80,
    unit: "kg",
    minStock: 50,
    maxStock: 300,
    lastRestocked: "2025-01-14",
    status: "in-stock",
  },
  {
    id: "INV004",
    name: "Cooking Oil",
    category: "Oils",
    currentStock: 45,
    unit: "liters",
    minStock: 50,
    maxStock: 200,
    lastRestocked: "2025-01-12",
    status: "low-stock",
  },
  {
    id: "INV005",
    name: "Peanuts",
    category: "Nuts",
    currentStock: 0,
    unit: "kg",
    minStock: 30,
    maxStock: 150,
    lastRestocked: "2025-01-05",
    status: "out-of-stock",
  },
  {
    id: "1",
    name: "Chicken Breast",
    category: "Protein",
    currentStock: 150,
    minimumStock: 100,
    unit: "kg",
    lastUpdated: "2024-01-20",
  },
  {
    id: "2",
    name: "Jasmine Rice",
    category: "Grains",
    currentStock: 300,
    minimumStock: 200,
    unit: "kg",
    lastUpdated: "2024-01-19",
  },
  {
    id: "3",
    name: "Fresh Lettuce",
    category: "Vegetables",
    currentStock: 80,
    minimumStock: 50,
    unit: "kg",
    lastUpdated: "2024-01-22",
  },
  {
    id: "4",
    name: "Tomatoes",
    category: "Vegetables",
    currentStock: 60,
    minimumStock: 80,
    unit: "kg",
    lastUpdated: "2024-01-21",
  },
  {
    id: "5",
    name: "Whole Wheat Bread",
    category: "Grains",
    currentStock: 200,
    minimumStock: 150,
    unit: "loaves",
    lastUpdated: "2024-01-23",
  },
  {
    id: "6",
    name: "Mozzarella Cheese",
    category: "Dairy",
    currentStock: 40,
    minimumStock: 60,
    unit: "kg",
    lastUpdated: "2024-01-20",
  },
  {
    id: "7",
    name: "Olive Oil",
    category: "Oils",
    currentStock: 25,
    minimumStock: 30,
    unit: "liters",
    lastUpdated: "2024-01-18",
  },
  {
    id: "8",
    name: "Fresh Apples",
    category: "Fruits",
    currentStock: 150,
    minimumStock: 100,
    unit: "kg",
    lastUpdated: "2024-01-23",
  },
  {
    id: "9",
    name: "Chocolate Chips",
    category: "Baking",
    currentStock: 0,
    minimumStock: 20,
    unit: "kg",
    lastUpdated: "2024-01-15",
  },
  {
    id: "10",
    name: "Pasta",
    category: "Grains",
    currentStock: 180,
    minimumStock: 120,
    unit: "kg",
    lastUpdated: "2024-01-22",
  },
]

// Documents
export const supplierDocuments: SupplierDocument[] = [
  {
    id: "DOC001",
    name: "Business License",
    type: "license",
    uploadDate: "2024-01-15",
    expiryDate: "2026-01-15",
    status: "active",
    size: "1.2 MB",
  },
  {
    id: "DOC002",
    name: "Health Certificate",
    type: "certificate",
    uploadDate: "2024-06-20",
    expiryDate: "2025-06-20",
    status: "active",
    size: "856 KB",
  },
  {
    id: "DOC003",
    name: "Supply Contract - MBG",
    type: "contract",
    uploadDate: "2024-12-01",
    expiryDate: "2025-12-01",
    status: "active",
    size: "2.4 MB",
  },
  {
    id: "DOC004",
    name: "Tax Document 2024",
    type: "certificate",
    uploadDate: "2024-03-15",
    status: "active",
    size: "945 KB",
  },
  {
    id: "1",
    name: "Food Safety Certificate",
    category: "Compliance",
    uploadDate: "2024-01-15",
    size: "2.4 MB",
    status: "active",
  },
  {
    id: "2",
    name: "Business License",
    category: "Legal",
    uploadDate: "2024-01-10",
    size: "1.8 MB",
    status: "active",
  },
  {
    id: "3",
    name: "Insurance Policy",
    category: "Insurance",
    uploadDate: "2024-01-12",
    size: "3.2 MB",
    status: "active",
  },
  {
    id: "4",
    name: "Health Inspection Report",
    category: "Compliance",
    uploadDate: "2024-01-20",
    size: "1.5 MB",
    status: "active",
  },
]

// Performance Metrics
export const supplierPerformance: PerformanceMetric[] = [
  { metric: "On-Time Delivery", value: 96, target: 95, trend: "up", period: "This Month" },
  { metric: "Order Fulfillment", value: 98, target: 95, trend: "up", period: "This Month" },
  { metric: "Quality Score", value: 4.8, target: 4.5, trend: "stable", period: "This Month" },
  { metric: "Customer Satisfaction", value: 92, target: 90, trend: "up", period: "This Month" },
  { metric: "Cost Efficiency", value: 88, target: 85, trend: "down", period: "This Month" },
  { metric: "Waste Reduction", value: 94, target: 90, trend: "up", period: "This Month" },
]

// Dashboard Stats
export const supplierDashboardStats = {
  totalOrders: supplierOrders.length,
  pendingOrders: supplierOrders.filter((o) => o.status === "pending").length,
  confirmedOrders: supplierOrders.filter((o) => o.status === "confirmed").length,
  deliveredToday: supplierOrders.filter((o) => o.status === "delivered").length,
  revenue: supplierOrders.reduce((sum, o) => sum + o.totalAmount, 0),
  revenueThisMonth: 245000000,
  averageRating: 4.8,
  activeProducts: supplierProducts.filter((p) => p.available).length,
}

// Consolidated Supplier Data
export const supplierData = {
  orders: supplierOrders,
  products: supplierProducts,
  deliverySchedule: supplierDeliverySchedules,
  inventory: supplierInventory,
  documents: supplierDocuments,
}
