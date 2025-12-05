// Dummy data for MBG platform - all static for UI preview
export const dummySchools = [
  { id: 1, name: 'SDN Jakarta Pusat 01', district: 'Central Jakarta', students: 450, status: 'active', lastAudit: '2025-01-15' },
  { id: 2, name: 'SDN Bandung Timur 05', district: 'East Bandung', students: 320, status: 'active', lastAudit: '2025-01-10' },
  { id: 3, name: 'SDN Surabaya Barat 12', district: 'West Surabaya', students: 280, status: 'active', lastAudit: '2025-01-05' },
  { id: 4, name: 'SDN Medan Utara 03', district: 'North Medan', students: 210, status: 'inactive', lastAudit: '2024-12-20' },
  { id: 5, name: 'SDN Yogyakarta Selatan 08', district: 'South Yogyakarta', students: 390, status: 'active', lastAudit: '2025-01-12' },
]

export const dummySuppliers = [
  { id: 1, name: 'Fresh Valley Farm', email: 'contact@freshvalley.id', score: 4.8, status: 'verified', category: 'Produce', mealsSupplied: 1240 },
  { id: 2, name: 'Protein Prime', email: 'sales@proteinprime.id', score: 4.6, status: 'verified', category: 'Protein', mealsSupplied: 890 },
  { id: 3, name: 'Grain Masters', email: 'info@grainmasters.id', score: 4.3, status: 'verified', category: 'Grains', mealsSupplied: 1050 },
  { id: 4, name: 'Dairy Delights', email: 'support@dairydelights.id', score: 4.9, status: 'pending', category: 'Dairy', mealsSupplied: 340 },
  { id: 5, name: 'Spice & Seasoning Co', email: 'hello@spiceseason.id', score: 4.2, status: 'verified', category: 'Condiments', mealsSupplied: 560 },
]

export const dummyStudents = [
  { id: 1, name: 'Ahmad Rizki', school: 'SDN Jakarta Pusat 01', grade: '3A', status: 'active', mealsReceived: 45, allergies: 'Peanuts' },
  { id: 2, name: 'Siti Nurhaliza', school: 'SDN Jakarta Pusat 01', grade: '4B', status: 'active', mealsReceived: 42, allergies: 'None' },
  { id: 3, name: 'Budi Santoso', school: 'SDN Bandung Timur 05', grade: '2C', status: 'active', mealsReceived: 38, allergies: 'Shellfish' },
  { id: 4, name: 'Dewi Lestari', school: 'SDN Surabaya Barat 12', grade: '5A', status: 'inactive', mealsReceived: 28, allergies: 'None' },
  { id: 5, name: 'Raka Wijaya', school: 'SDN Jakarta Pusat 01', grade: '3B', status: 'active', mealsReceived: 44, allergies: 'Dairy' },
]

export const dummyMealPlan = {
  week: '2025-01-20 to 2025-01-26',
  meals: [
    { day: 'Monday', meal: 'Rice, Chicken Stew, Spinach, Orange', nutrition: { calories: 520, protein: 18, carbs: 65, fat: 12 }, supplier: 'Protein Prime' },
    { day: 'Tuesday', meal: 'Rice, Beef Soup, Carrots, Banana', nutrition: { calories: 540, protein: 20, carbs: 68, fat: 14 }, supplier: 'Protein Prime' },
    { day: 'Wednesday', meal: 'Wheat Roti, Fish Curry, Beans, Apple', nutrition: { calories: 490, protein: 22, carbs: 60, fat: 11 }, supplier: 'Fresh Valley Farm' },
    { day: 'Thursday', meal: 'Rice, Tofu Stir-fry, Broccoli, Mango', nutrition: { calories: 480, protein: 16, carbs: 62, fat: 10 }, supplier: 'Fresh Valley Farm' },
    { day: 'Friday', meal: 'Rice, Egg Fried Rice, Mixed Veggies, Papaya', nutrition: { calories: 510, protein: 15, carbs: 67, fat: 13 }, supplier: 'Grain Masters' },
  ]
}

export const dummyDistributionLogs = [
  { id: 1, date: '2025-01-16', school: 'SDN Jakarta Pusat 01', meals: 450, status: 'delivered', supplier: 'Protein Prime', time: '08:30 AM' },
  { id: 2, date: '2025-01-16', school: 'SDN Bandung Timur 05', meals: 320, status: 'delivered', supplier: 'Fresh Valley Farm', time: '09:15 AM' },
  { id: 3, date: '2025-01-16', school: 'SDN Surabaya Barat 12', meals: 280, status: 'pending', supplier: 'Grain Masters', time: '10:00 AM' },
  { id: 4, date: '2025-01-17', school: 'SDN Medan Utara 03', meals: 0, status: 'delayed', supplier: 'Dairy Delights', time: 'TBD' },
]

export const dummyAdminProfile = {
  name: 'Dr. Siti Aminah',
  email: 'siti.aminah@mbg-portal.id',
  role: 'System Administrator',
  avatar: 'https://dummyimage.com/96x96/3b82f6/ffffff?text=SA',
  joinDate: '2024-01-15',
  department: 'Ministry of Education',
  twoFAEnabled: true,
  lastLogin: '2025-01-16 09:45 AM',
}

export const dummyReports = {
  totalStudents: 1650,
  totalMealsDelivered: 12450,
  totalSuppliers: 8,
  avgMealCost: 2500,
  distributionRate: 94.2,
  supplierPerformance: 4.56,
  successRate: 98.7,
  alerts: 3,
}

export const dummySupplierOrders = [
  { id: 'ORD-001', school: 'SDN Jakarta Pusat 01', items: 450, status: 'pending', date: '2025-01-16', dueDate: '2025-01-17', contact: 'Mr. Budi', quality: 'Good' },
  { id: 'ORD-002', school: 'SDN Bandung Timur 05', items: 320, status: 'preparing', date: '2025-01-16', dueDate: '2025-01-17', contact: 'Ms. Siti', quality: 'Excellent' },
  { id: 'ORD-003', school: 'SDN Surabaya Barat 12', items: 280, status: 'delivered', date: '2025-01-15', dueDate: '2025-01-16', contact: 'Mr. Raka', quality: 'Good' },
  { id: 'ORD-004', school: 'SDN Medan Utara 03', items: 210, status: 'delayed', date: '2025-01-14', dueDate: '2025-01-15', contact: 'Ms. Dwi', quality: 'Fair' },
  { id: 'ORD-005', school: 'SDN Yogyakarta Selatan 08', items: 390, status: 'delivered', date: '2025-01-15', dueDate: '2025-01-16', contact: 'Mr. Ahmad', quality: 'Excellent' },
  { id: 'ORD-006', school: 'SDN Jakarta Pusat 01', items: 450, status: 'pending', date: '2025-01-16', dueDate: '2025-01-18', contact: 'Mr. Budi', quality: 'Good' },
  { id: 'ORD-007', school: 'SDN Bandung Timur 05', items: 320, status: 'preparing', date: '2025-01-16', dueDate: '2025-01-17', contact: 'Ms. Siti', quality: 'Excellent' },
  { id: 'ORD-008', school: 'SDN Surabaya Barat 12', items: 280, status: 'delivered', date: '2025-01-16', dueDate: '2025-01-16', contact: 'Mr. Raka', quality: 'Good' },
  { id: 'ORD-009', school: 'SDN Medan Utara 03', items: 210, status: 'pending', date: '2025-01-16', dueDate: '2025-01-18', contact: 'Ms. Dwi', quality: 'Good' },
  { id: 'ORD-010', school: 'SDN Yogyakarta Selatan 08', items: 390, status: 'delivered', date: '2025-01-16', dueDate: '2025-01-16', contact: 'Mr. Ahmad', quality: 'Excellent' },
  { id: 'ORD-011', school: 'SDN Jakarta Pusat 01', items: 450, status: 'preparing', date: '2025-01-16', dueDate: '2025-01-17', contact: 'Mr. Budi', quality: 'Good' },
  { id: 'ORD-012', school: 'SDN Bandung Timur 05', items: 320, status: 'pending', date: '2025-01-16', dueDate: '2025-01-18', contact: 'Ms. Siti', quality: 'Excellent' },
  { id: 'ORD-013', school: 'SDN Surabaya Barat 12', items: 280, status: 'delayed', date: '2025-01-14', dueDate: '2025-01-15', contact: 'Mr. Raka', quality: 'Fair' },
  { id: 'ORD-014', school: 'SDN Medan Utara 03', items: 210, status: 'delivered', date: '2025-01-15', dueDate: '2025-01-16', contact: 'Ms. Dwi', quality: 'Good' },
  { id: 'ORD-015', school: 'SDN Yogyakarta Selatan 08', items: 390, status: 'preparing', date: '2025-01-16', dueDate: '2025-01-17', contact: 'Mr. Ahmad', quality: 'Excellent' },
]

export const dummySupplierProducts = [
  { id: 'PROD-001', name: 'Fresh Chicken Breast', category: 'Protein', price: 45000, unit: 'kg', stock: 150, nutrition: 'High Protein', image: 'https://dummyimage.com/200x200/FF6B6B/ffffff?text=Chicken' },
  { id: 'PROD-002', name: 'Organic Rice', category: 'Grains', price: 8500, unit: 'kg', stock: 500, nutrition: 'Complex Carbs', image: 'https://dummyimage.com/200x200/FFA07A/ffffff?text=Rice' },
  { id: 'PROD-003', name: 'Green Vegetables Mix', category: 'Vegetables', price: 15000, unit: 'kg', stock: 300, nutrition: 'Vitamins & Minerals', image: 'https://dummyimage.com/200x200/90EE90/ffffff?text=Vegetables' },
  { id: 'PROD-004', name: 'Fresh Fish Fillet', category: 'Protein', price: 55000, unit: 'kg', stock: 120, nutrition: 'Omega-3', image: 'https://dummyimage.com/200x200/87CEEB/ffffff?text=Fish' },
  { id: 'PROD-005', name: 'Whole Wheat Flour', category: 'Grains', price: 12000, unit: 'kg', stock: 400, nutrition: 'Fiber', image: 'https://dummyimage.com/200x200/DEB887/ffffff?text=Flour' },
  { id: 'PROD-006', name: 'Local Eggs', category: 'Protein', price: 25000, unit: 'dozen', stock: 200, nutrition: 'Complete Protein', image: 'https://dummyimage.com/200x200/FFD700/ffffff?text=Eggs' },
  { id: 'PROD-007', name: 'Fresh Tomatoes', category: 'Vegetables', price: 12000, unit: 'kg', stock: 250, nutrition: 'Lycopene', image: 'https://dummyimage.com/200x200/FF4500/ffffff?text=Tomatoes' },
  { id: 'PROD-008', name: 'Red Beans', category: 'Legumes', price: 18000, unit: 'kg', stock: 300, nutrition: 'Plant Protein', image: 'https://dummyimage.com/200x200/DC143C/ffffff?text=Beans' },
  { id: 'PROD-009', name: 'Fresh Carrots', category: 'Vegetables', price: 10000, unit: 'kg', stock: 280, nutrition: 'Beta Carotene', image: 'https://dummyimage.com/200x200/FF8C00/ffffff?text=Carrots' },
  { id: 'PROD-010', name: 'Cooking Oil', category: 'Condiments', price: 35000, unit: 'liter', stock: 150, nutrition: 'Fats', image: 'https://dummyimage.com/200x200/F5DEB3/ffffff?text=Oil' },
  { id: 'PROD-011', name: 'Fresh Broccoli', category: 'Vegetables', price: 14000, unit: 'kg', stock: 180, nutrition: 'Calcium & Iron', image: 'https://dummyimage.com/200x200/228B22/ffffff?text=Broccoli' },
  { id: 'PROD-012', name: 'Lentils', category: 'Legumes', price: 16000, unit: 'kg', stock: 220, nutrition: 'Fiber & Protein', image: 'https://dummyimage.com/200x200/DAA520/ffffff?text=Lentils' },
]

export const dummySupplierSchedule = [
  { id: 1, date: '2025-01-17', school: 'SDN Jakarta Pusat 01', time: '08:00 AM', status: 'scheduled', items: 450 },
  { id: 2, date: '2025-01-17', school: 'SDN Bandung Timur 05', time: '09:30 AM', status: 'scheduled', items: 320 },
  { id: 3, date: '2025-01-17', school: 'SDN Surabaya Barat 12', time: '11:00 AM', status: 'in-transit', items: 280 },
  { id: 4, date: '2025-01-17', school: 'SDN Medan Utara 03', time: '01:00 PM', status: 'delayed', items: 210 },
  { id: 5, date: '2025-01-18', school: 'SDN Yogyakarta Selatan 08', time: '10:00 AM', status: 'scheduled', items: 390 },
  { id: 6, date: '2025-01-18', school: 'SDN Jakarta Pusat 01', time: '08:00 AM', status: 'scheduled', items: 450 },
  { id: 7, date: '2025-01-18', school: 'SDN Bandung Timur 05', time: '09:30 AM', status: 'scheduled', items: 320 },
]

export const dummySupplierInventory = [
  { id: 1, product: 'Fresh Chicken Breast', stock: 150, unit: 'kg', reorderLevel: 50, lastRestocked: '2025-01-15', supplier: 'Local Farm' },
  { id: 2, product: 'Organic Rice', stock: 500, unit: 'kg', reorderLevel: 100, lastRestocked: '2025-01-10', supplier: 'Rice Mills' },
  { id: 3, product: 'Green Vegetables Mix', stock: 300, unit: 'kg', reorderLevel: 100, lastRestocked: '2025-01-14', supplier: 'Farmer Co-op' },
  { id: 4, product: 'Fresh Fish Fillet', stock: 120, unit: 'kg', reorderLevel: 50, lastRestocked: '2025-01-16', supplier: 'Harbor Market' },
  { id: 5, product: 'Whole Wheat Flour', stock: 400, unit: 'kg', reorderLevel: 100, lastRestocked: '2025-01-12', supplier: 'Mill Factory' },
]

export const dummySupplierDocuments = [
  { id: 1, name: 'Business License', type: 'pdf', status: 'verified', uploadDate: '2024-12-01', expiryDate: '2025-12-01' },
  { id: 2, name: 'Health Certificate', type: 'pdf', status: 'verified', uploadDate: '2024-12-15', expiryDate: '2025-06-15' },
  { id: 3, name: 'Insurance Certificate', type: 'pdf', status: 'pending', uploadDate: '2025-01-10', expiryDate: '2025-12-10' },
  { id: 4, name: 'Food Safety Audit', type: 'pdf', status: 'verified', uploadDate: '2024-11-20', expiryDate: '2025-11-20' },
]

export const dummySupplierPerformance = [
  { metric: 'Delivery Success Rate', value: 96.5, target: 95, trend: 'up' },
  { metric: 'On-Time Performance', value: 92.3, target: 90, trend: 'up' },
  { metric: 'Quality Score', value: 4.7, target: 4.5, trend: 'stable' },
  { metric: 'Customer Satisfaction', value: 93.8, target: 90, trend: 'up' },
]

export const dummySupplierProfile = {
  companyName: 'Fresh Valley Farm',
  email: 'contact@freshvalley.id',
  phone: '+62-21-1234-5678',
  address: 'Jl. Pertanian No. 123, Jakarta',
  director: 'Tono Kartono',
  since: '2015',
  totalOrders: 1240,
  totalDeliveries: 1200,
  successRate: 96.5,
  rating: 4.8,
}

export const dummySupplierSupport = [
  { id: 1, category: 'Order Issues', count: 3 },
  { id: 2, category: 'Delivery Problems', count: 2 },
  { id: 3, category: 'Product Quality', count: 1 },
  { id: 4, category: 'Payment Questions', count: 5 },
]
