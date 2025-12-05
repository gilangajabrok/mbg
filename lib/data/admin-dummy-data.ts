// Admin Panel Dummy Data for MBG System

export interface School {
  id: string
  name: string
  address: string
  district: string
  principalName: string
  principalEmail: string
  principalPhone: string
  studentCount: number
  status: "active" | "inactive" | "suspended"
  enrollmentDate: string
  logo?: string
}

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  category: "catering" | "produce" | "dairy" | "meat" | "bakery"
  status: "active" | "pending" | "suspended"
  rating: number
  totalOrders: number
  joinDate: string
  documents: {
    businessLicense: boolean
    healthCertificate: boolean
    taxDocument: boolean
  }
}

export interface ParentRecord {
  id: string
  name: string
  email: string
  phone: string
  address: string
  childrenCount: number
  status: "active" | "pending" | "suspended"
  verificationStatus: "verified" | "pending" | "rejected"
  registrationDate: string
  children: {
    id: string
    name: string
    school: string
    grade: string
  }[]
}

export interface MealPlanItem {
  id: string
  date: string
  mealType: "breakfast" | "lunch" | "snack"
  name: string
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  allergens: string[]
  supplier: string
  cost: number
  status: "planned" | "confirmed" | "delivered"
}

export interface DistributionCycle {
  id: string
  cycleName: string
  startDate: string
  endDate: string
  schools: string[]
  mealCount: number
  status: "planning" | "assigned" | "in-progress" | "completed"
  progress: number
}

export interface QualityReport {
  id: string
  date: string
  school: string
  mealType: string
  inspector: string
  rating: number
  temperature: string
  freshness: string
  packaging: string
  hygiene: string
  notes: string
  images: string[]
  status: "passed" | "failed" | "warning"
}

export interface DeliveryRecord {
  id: string
  date: string
  school: string
  supplier: string
  mealType: string
  scheduledTime: string
  actualTime: string
  mealCount: number
  status: "scheduled" | "in-transit" | "delivered" | "delayed" | "cancelled"
  driverName: string
  driverPhone: string
  temperature: string
  photos: string[]
}

export interface FinancialRecord {
  id: string
  date: string
  category: "meal-cost" | "delivery-fee" | "supplier-payment" | "operational"
  description: string
  amount: number
  status: "pending" | "paid" | "overdue"
  supplier?: string
  invoiceNumber: string
}

// Schools Data
export const adminSchools: School[] = [
  {
    id: "SCH001",
    name: "SDN Menteng 01",
    address: "Jl. Menteng Raya No. 5, Jakarta Pusat",
    district: "Jakarta Pusat",
    principalName: "Dr. Siti Nurhaliza",
    principalEmail: "principal@sdnmenteng01.sch.id",
    principalPhone: "+62 21 3192 4567",
    studentCount: 450,
    status: "active",
    enrollmentDate: "2024-01-15",
    logo: "/generic-school-logo-1.png",
  },
  {
    id: "SCH002",
    name: "SDN Kebayoran 03",
    address: "Jl. Kebayoran Lama No. 12, Jakarta Selatan",
    district: "Jakarta Selatan",
    principalName: "Budi Santoso, S.Pd",
    principalEmail: "kepala@sdnkebayoran03.sch.id",
    principalPhone: "+62 21 7234 5678",
    studentCount: 380,
    status: "active",
    enrollmentDate: "2024-01-20",
    logo: "/school-logo-2.png",
  },
  {
    id: "SCH003",
    name: "SDN Cempaka Putih 05",
    address: "Jl. Cempaka Putih Tengah No. 8, Jakarta Pusat",
    district: "Jakarta Pusat",
    principalName: "Ir. Ahmad Dahlan",
    principalEmail: "admin@sdncempaka05.sch.id",
    principalPhone: "+62 21 4201 2345",
    studentCount: 520,
    status: "active",
    enrollmentDate: "2024-02-01",
    logo: "/school-logo-3.png",
  },
  {
    id: "SCH004",
    name: "SDN Pondok Indah 02",
    address: "Jl. Metro Pondok Indah No. 20, Jakarta Selatan",
    district: "Jakarta Selatan",
    principalName: "Dra. Ratna Sari",
    principalEmail: "headmaster@sdnpondok02.sch.id",
    principalPhone: "+62 21 7592 3456",
    studentCount: 410,
    status: "active",
    enrollmentDate: "2024-02-10",
    logo: "/school-logo-4.jpg",
  },
  {
    id: "SCH005",
    name: "SDN Tanah Abang 04",
    address: "Jl. KH Mas Mansyur No. 15, Jakarta Pusat",
    district: "Jakarta Pusat",
    principalName: "H. Rizki Pratama, M.Pd",
    principalEmail: "info@sdntanahabang04.sch.id",
    principalPhone: "+62 21 5720 6789",
    studentCount: 390,
    status: "active",
    enrollmentDate: "2024-02-15",
    logo: "/school-logo-5.jpg",
  },
]

// Suppliers Data
export const adminSuppliers: Supplier[] = [
  {
    id: "SUP001",
    name: "Berkah Catering",
    email: "info@berkahcatering.co.id",
    phone: "+62 812 3456 7890",
    address: "Jl. Raya Bogor KM 25, Jakarta Timur",
    category: "catering",
    status: "active",
    rating: 4.8,
    totalOrders: 156,
    joinDate: "2023-11-10",
    documents: {
      businessLicense: true,
      healthCertificate: true,
      taxDocument: true,
    },
  },
  {
    id: "SUP002",
    name: "Segar Sentosa Produce",
    email: "contact@segarsentosa.com",
    phone: "+62 813 9876 5432",
    address: "Pasar Induk Kramat Jati, Jakarta Timur",
    category: "produce",
    status: "active",
    rating: 4.5,
    totalOrders: 203,
    joinDate: "2023-10-05",
    documents: {
      businessLicense: true,
      healthCertificate: true,
      taxDocument: true,
    },
  },
  {
    id: "SUP003",
    name: "Dairy Fresh Indonesia",
    email: "sales@dairyfresh.id",
    phone: "+62 815 2468 1357",
    address: "Jl. Industri Raya No. 45, Tangerang",
    category: "dairy",
    status: "active",
    rating: 4.7,
    totalOrders: 178,
    joinDate: "2023-12-01",
    documents: {
      businessLicense: true,
      healthCertificate: true,
      taxDocument: true,
    },
  },
  {
    id: "SUP004",
    name: "Prima Meat Supply",
    email: "order@primameat.co.id",
    phone: "+62 821 7654 3210",
    address: "Jl. Raya Bekasi KM 18, Jakarta Timur",
    category: "meat",
    status: "active",
    rating: 4.6,
    totalOrders: 142,
    joinDate: "2024-01-15",
    documents: {
      businessLicense: true,
      healthCertificate: true,
      taxDocument: true,
    },
  },
  {
    id: "SUP005",
    name: "Golden Bakery",
    email: "hello@goldenbakery.id",
    phone: "+62 822 3456 7891",
    address: "Jl. Gatot Subroto No. 88, Jakarta Selatan",
    category: "bakery",
    status: "active",
    rating: 4.9,
    totalOrders: 189,
    joinDate: "2023-11-20",
    documents: {
      businessLicense: true,
      healthCertificate: true,
      taxDocument: true,
    },
  },
]

// Parent Records
export const adminParents: ParentRecord[] = [
  {
    id: "PAR001",
    name: "Ibu Sarah Wijaya",
    email: "sarah.wijaya@email.com",
    phone: "+62 812 3456 7890",
    address: "Jl. Menteng Raya No. 45, Jakarta Pusat",
    childrenCount: 2,
    status: "active",
    verificationStatus: "verified",
    registrationDate: "2024-01-20",
    children: [
      { id: "CH001", name: "Aisyah Putri", school: "SDN Menteng 01", grade: "4" },
      { id: "CH002", name: "Amir Fadhil", school: "SDN Menteng 01", grade: "2" },
    ],
  },
  {
    id: "PAR002",
    name: "Bapak Andi Kurniawan",
    email: "andi.k@email.com",
    phone: "+62 813 9876 5432",
    address: "Jl. Kebayoran Lama No. 78, Jakarta Selatan",
    childrenCount: 1,
    status: "active",
    verificationStatus: "verified",
    registrationDate: "2024-01-25",
    children: [{ id: "CH003", name: "Dimas Pratama", school: "SDN Kebayoran 03", grade: "5" }],
  },
  {
    id: "PAR003",
    name: "Ibu Rina Mulyani",
    email: "rina.mulyani@email.com",
    phone: "+62 815 2468 1357",
    address: "Jl. Cempaka Putih No. 12, Jakarta Pusat",
    childrenCount: 3,
    status: "active",
    verificationStatus: "verified",
    registrationDate: "2024-02-05",
    children: [
      { id: "CH004", name: "Siti Nur", school: "SDN Cempaka Putih 05", grade: "6" },
      { id: "CH005", name: "Ahmad Rafi", school: "SDN Cempaka Putih 05", grade: "4" },
      { id: "CH006", name: "Zahra Amelia", school: "SDN Cempaka Putih 05", grade: "1" },
    ],
  },
]

// Distribution Cycles
export const adminDistributionCycles: DistributionCycle[] = [
  {
    id: "DC001",
    cycleName: "January 2025 - Week 1",
    startDate: "2025-01-06",
    endDate: "2025-01-10",
    schools: ["SDN Menteng 01", "SDN Kebayoran 03", "SDN Cempaka Putih 05"],
    mealCount: 4500,
    status: "completed",
    progress: 100,
  },
  {
    id: "DC002",
    cycleName: "January 2025 - Week 2",
    startDate: "2025-01-13",
    endDate: "2025-01-17",
    schools: ["SDN Menteng 01", "SDN Kebayoran 03", "SDN Pondok Indah 02"],
    mealCount: 4200,
    status: "in-progress",
    progress: 65,
  },
  {
    id: "DC003",
    cycleName: "January 2025 - Week 3",
    startDate: "2025-01-20",
    endDate: "2025-01-24",
    schools: ["SDN Cempaka Putih 05", "SDN Tanah Abang 04", "SDN Pondok Indah 02"],
    mealCount: 4800,
    status: "assigned",
    progress: 25,
  },
  {
    id: "DC004",
    cycleName: "January 2025 - Week 4",
    startDate: "2025-01-27",
    endDate: "2025-01-31",
    schools: ["SDN Menteng 01", "SDN Kebayoran 03", "SDN Tanah Abang 04"],
    mealCount: 4350,
    status: "planning",
    progress: 10,
  },
]

// Quality Reports
export const adminQualityReports: QualityReport[] = [
  {
    id: "QR001",
    date: "2025-01-15",
    school: "SDN Menteng 01",
    mealType: "Lunch",
    inspector: "Dr. Fitri Handayani",
    rating: 9.2,
    temperature: "65°C",
    freshness: "Excellent",
    packaging: "Good",
    hygiene: "Excellent",
    notes: "All standards met. Food quality excellent.",
    images: ["/meal-inspection-1.jpg"],
    status: "passed",
  },
  {
    id: "QR002",
    date: "2025-01-15",
    school: "SDN Kebayoran 03",
    mealType: "Breakfast",
    inspector: "Ir. Bambang Susilo",
    rating: 7.8,
    temperature: "60°C",
    freshness: "Good",
    packaging: "Adequate",
    hygiene: "Good",
    notes: "Minor issues with packaging seal. Corrected on site.",
    images: ["/meal-inspection-2.jpg"],
    status: "warning",
  },
]

// Delivery Records
export const adminDeliveryRecords: DeliveryRecord[] = [
  {
    id: "DEL001",
    date: "2025-01-15",
    school: "SDN Menteng 01",
    supplier: "Berkah Catering",
    mealType: "Lunch",
    scheduledTime: "10:30 AM",
    actualTime: "10:25 AM",
    mealCount: 450,
    status: "delivered",
    driverName: "Ahmad Yusuf",
    driverPhone: "+62 812 9876 5432",
    temperature: "65°C",
    photos: ["/delivery-proof-1.jpg", "/delivery-vehicle-1.jpg"],
  },
  {
    id: "DEL002",
    date: "2025-01-15",
    school: "SDN Kebayoran 03",
    supplier: "Berkah Catering",
    mealType: "Lunch",
    scheduledTime: "11:00 AM",
    actualTime: "11:15 AM",
    mealCount: 380,
    status: "delivered",
    driverName: "Dedi Kurniawan",
    driverPhone: "+62 813 5432 6789",
    temperature: "63°C",
    photos: ["/delivery-proof-2.jpg"],
  },
  {
    id: "DEL003",
    date: "2025-01-16",
    school: "SDN Cempaka Putih 05",
    supplier: "Golden Bakery",
    mealType: "Breakfast",
    scheduledTime: "07:00 AM",
    actualTime: "07:00 AM",
    mealCount: 520,
    status: "in-transit",
    driverName: "Rudi Hartono",
    driverPhone: "+62 821 3456 7890",
    temperature: "Monitoring",
    photos: [],
  },
]

// Financial Records
export const adminFinancialRecords: FinancialRecord[] = [
  {
    id: "FIN001",
    date: "2025-01-15",
    category: "supplier-payment",
    description: "Payment to Berkah Catering for Week 1 meals",
    amount: 67500000,
    status: "paid",
    supplier: "Berkah Catering",
    invoiceNumber: "INV-2025-001",
  },
  {
    id: "FIN002",
    date: "2025-01-15",
    category: "supplier-payment",
    description: "Payment to Segar Sentosa for produce supply",
    amount: 32500000,
    status: "paid",
    supplier: "Segar Sentosa Produce",
    invoiceNumber: "INV-2025-002",
  },
  {
    id: "FIN003",
    date: "2025-01-16",
    category: "delivery-fee",
    description: "Delivery services for 5 schools",
    amount: 8750000,
    status: "pending",
    invoiceNumber: "INV-2025-003",
  },
  {
    id: "FIN004",
    date: "2025-01-16",
    category: "operational",
    description: "Quality inspection team wages",
    amount: 5000000,
    status: "pending",
    invoiceNumber: "INV-2025-004",
  },
]

// Meal Plans
export const adminMealPlans: MealPlanItem[] = [
  {
    id: "MP001",
    date: "2025-01-20",
    mealType: "breakfast",
    name: "Nasi Uduk with Chicken",
    description: "Traditional Indonesian breakfast with fragrant rice, fried chicken, and sambal",
    calories: 450,
    protein: 25,
    carbs: 55,
    fat: 15,
    allergens: ["peanuts", "soy"],
    supplier: "Berkah Catering",
    cost: 15000,
    status: "confirmed",
  },
  {
    id: "MP002",
    date: "2025-01-20",
    mealType: "lunch",
    name: "Gado-Gado with Peanut Sauce",
    description: "Mixed vegetables with tofu, tempeh, and rich peanut sauce",
    calories: 520,
    protein: 22,
    carbs: 48,
    fat: 28,
    allergens: ["peanuts", "soy"],
    supplier: "Berkah Catering",
    cost: 18000,
    status: "confirmed",
  },
  {
    id: "MP003",
    date: "2025-01-20",
    mealType: "snack",
    name: "Fresh Fruit Salad",
    description: "Seasonal tropical fruits with honey yogurt",
    calories: 180,
    protein: 4,
    carbs: 38,
    fat: 3,
    allergens: ["dairy"],
    supplier: "Segar Sentosa Produce",
    cost: 8000,
    status: "confirmed",
  },
]

// Dashboard Stats
export const adminDashboardStats = {
  totalSchools: 20,
  activeSchools: 18,
  totalStudents: 8540,
  todayMeals: 2580,
  totalSuppliers: 15,
  activeSuppliers: 13,
  pendingOrders: 23,
  completedDeliveries: 156,
  monthlyBudget: 850000000,
  spentThisMonth: 623400000,
  averageRating: 4.7,
  qualityScore: 92,
}

// Comment to explain the dummy data
// This file contains comprehensive dummy data for the Admin Panel, including schools, suppliers, parent records, distribution cycles, quality reports, delivery records, financial data, and meal plans. The data is designed to reflect realistic scenarios with Indonesian context and pricing.
