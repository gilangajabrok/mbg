/**
 * API Type Definitions
 * Comprehensive type definitions for all backend API responses and requests
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    trace_id?: string;
    limit?: number;
    offset?: number;
    timestamp?: number;
  };
}

export interface PaginationMeta {
  limit?: number;
  offset?: number;
  total?: number;
  trace_id?: string;
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user?: User;
  expires_in?: number;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: "admin" | "parent" | "supplier" | "super_admin";
  address?: string;
  school_id?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  password?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

// ============================================================================
// SCHOOLS
// ============================================================================

export interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  principal: string;
  students_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSchoolRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
  principal: string;
}

export interface UpdateSchoolRequest {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  principal?: string;
}

// ============================================================================
// STUDENTS
// ============================================================================

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  school_id: string;
  parent_id?: string;
  date_of_birth?: string;
  grade?: string;
  is_active: boolean;
  school?: School;
  created_at: string;
  updated_at: string;
}

export interface CreateStudentRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  school_id: string;
  parent_id?: string;
  date_of_birth?: string;
  grade?: string;
}

export interface UpdateStudentRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  grade?: string;
  date_of_birth?: string;
}

// ============================================================================
// MEALS
// ============================================================================

export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  allergens?: string;
  school_id: string;
  school?: School;
  created_at: string;
  updated_at: string;
}

export interface CreateMealRequest {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  allergens?: string;
  school_id: string;
}

export interface UpdateMealRequest {
  name?: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  allergens?: string;
}

// ============================================================================
// MEAL PLANS
// ============================================================================

export interface MealPlan {
  id: string;
  student_id: string;
  meal_id: string;
  start_date: string;
  end_date: string;
  meal?: Meal;
  created_at: string;
  updated_at: string;
}

export interface CreateMealPlanRequest {
  student_id: string;
  meal_id: string;
  start_date: string;
  end_date: string;
}

export interface UpdateMealPlanRequest {
  meal_id?: string;
  start_date?: string;
  end_date?: string;
}

// ============================================================================
// ORDERS
// ============================================================================

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface Order {
  id: string;
  student_id?: string;
  meal_id?: string;
  supplier_id: string;
  school_id?: string;
  quantity: number;
  total_price: number;
  status: OrderStatus;
  delivery_date?: string;
  notes?: string;
  meal?: Meal;
  supplier?: Supplier;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  student_id?: string;
  meal_id?: string;
  supplier_id: string;
  school_id?: string;
  quantity: number;
  total_price: number;
  delivery_date?: string;
  notes?: string;
}

export interface UpdateOrderRequest {
  quantity?: number;
  total_price?: number;
  delivery_date?: string;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  reason?: string;
}

// ============================================================================
// SUPPLIERS
// ============================================================================

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  rating: number;
  is_verified: boolean;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSupplierRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
}

export interface UpdateSupplierRequest {
  name?: string;
  phone?: string;
  address?: string;
  description?: string;
  email?: string;
}

// ============================================================================
// ANNOUNCEMENTS
// ============================================================================

export interface Announcement {
  id: string;
  title: string;
  content: string;
  school_id: string;
  author_id?: string;
  is_active: boolean;
  published_at?: string;
  school?: School;
  created_at: string;
  updated_at: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  school_id: string;
  is_active?: boolean;
  published_at?: string;
}

export interface UpdateAnnouncementRequest {
  title?: string;
  content?: string;
  is_active?: boolean;
  published_at?: string;
}

// ============================================================================
// LIST RESPONSES
// ============================================================================

export interface ListResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export interface ApiError {
  success: false;
  error: string;
  meta?: {
    trace_id?: string;
    timestamp?: number;
    code?: string;
  };
}

export class ApiErrorClass extends Error {
  public statusCode?: number;
  public traceId?: string;

  constructor(message: string, statusCode?: number, traceId?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.traceId = traceId;
  }
}
