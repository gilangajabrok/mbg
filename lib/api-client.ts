/**
 * API Client Service
 * Handles all HTTP requests to the MBG Backend API
 */

import axios, { AxiosInstance } from "axios"
import type {
  ApiResponse,
  AuthCredentials,
  AuthResponse,
  User,
  School,
  Student,
  Meal,
  MealPlan,
  Order,
  Supplier,
  Announcement,
  ListResponse,
  CreateSchoolRequest,
  UpdateSchoolRequest,
  CreateStudentRequest,
  UpdateStudentRequest,
  CreateMealRequest,
  UpdateMealRequest,
  CreateMealPlanRequest,
  UpdateMealPlanRequest,
  CreateOrderRequest,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
  ChangePasswordRequest,
  ProfileUpdateRequest,
} from "./api-types"

class ApiClient {
  private client: AxiosInstance
  private baseURL: string
  private tokenKey = "mbg_access_token"
  private refreshTokenKey = "mbg_refresh_token"

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") {
    this.baseURL = baseURL
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Add request interceptor for auth token and role headers
    this.client.interceptors.request.use((config) => {
      const token = this.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      // Add role headers for development (no auth)
      // Default to admin role for now
      config.headers["X-User-Role"] = "admin"
      config.headers["X-User-ID"] = "1"
      
      return config
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          const refreshToken = this.getRefreshToken()
          if (refreshToken) {
            try {
              const response = await this.client.post("/api/v1/auth/refresh", {
                refresh_token: refreshToken,
              })
              const newToken = response.data.data?.access_token
              if (newToken) {
                this.setToken(newToken)
                // Retry original request
                return this.client(error.config)
              }
            } catch (refreshError) {
              this.clearAuth()
              throw refreshError
            }
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // ============================================================================
  // TOKEN MANAGEMENT
  // ============================================================================

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.tokenKey)
    }
    return null
  }

  private setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.tokenKey, token)
    }
  }

  private getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.refreshTokenKey)
    }
    return null
  }

  private setRefreshToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.refreshTokenKey, token)
    }
  }

  private clearAuth(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.tokenKey)
      localStorage.removeItem(this.refreshTokenKey)
    }
  }

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>("/api/v1/auth/login", credentials)
    const authData = response.data.data
    if (authData?.access_token) {
      this.setToken(authData.access_token)
      if (authData.refresh_token) {
        this.setRefreshToken(authData.refresh_token)
      }
    }
    return authData!
  }

  async register(data: any): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>("/api/v1/auth/register", data)
    const authData = response.data.data
    if (authData?.access_token) {
      this.setToken(authData.access_token)
      if (authData.refresh_token) {
        this.setRefreshToken(authData.refresh_token)
      }
    }
    return authData!
  }

  async logout(): Promise<void> {
    try {
      await this.client.post("/api/v1/auth/logout")
    } finally {
      this.clearAuth()
    }
  }

  async getProfile(): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>("/api/v1/auth/profile")
    return response.data.data!
  }

  async updateProfile(data: ProfileUpdateRequest): Promise<User> {
    const response = await this.client.put<ApiResponse<User>>("/api/v1/auth/profile", data)
    return response.data.data!
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await this.client.post("/api/v1/auth/change-password", data)
  }

  // ============================================================================
  // USER PROFILE
  // ============================================================================

  async getMe(): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>("/api/v1/users/me")
    return response.data.data!
  }

  async updateMe(data: ProfileUpdateRequest): Promise<User> {
    const response = await this.client.put<ApiResponse<User>>("/api/v1/users/me", data)
    return response.data.data!
  }

  async getUser(id: string): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>(`/api/v1/users/${id}`)
    return response.data.data!
  }

  // ============================================================================
  // SCHOOLS
  // ============================================================================

  async createSchool(data: CreateSchoolRequest): Promise<School> {
    const response = await this.client.post<ApiResponse<School>>("/api/v1/schools", data)
    return response.data.data!
  }

  async getSchool(id: string): Promise<School> {
    const response = await this.client.get<ApiResponse<School>>(`/api/v1/schools/${id}`)
    return response.data.data!
  }

  async listSchools(limit?: number, offset?: number): Promise<ListResponse<School>> {
    const response = await this.client.get<ApiResponse<School[]>>("/api/v1/schools", {
      params: { limit, offset },
    })
    return {
      items: response.data.data || [],
      meta: response.data.meta,
    }
  }

  async updateSchool(id: string, data: UpdateSchoolRequest): Promise<School> {
    const response = await this.client.put<ApiResponse<School>>(`/api/v1/schools/${id}`, data)
    return response.data.data!
  }

  async deleteSchool(id: string): Promise<void> {
    await this.client.delete(`/api/v1/schools/${id}`)
  }

  // ============================================================================
  // STUDENTS
  // ============================================================================

  async createStudent(data: CreateStudentRequest): Promise<Student> {
    const response = await this.client.post<ApiResponse<Student>>("/api/v1/students", data)
    return response.data.data!
  }

  async getStudent(id: string): Promise<Student> {
    const response = await this.client.get<ApiResponse<Student>>(`/api/v1/students/${id}`)
    return response.data.data!
  }

  async getStudentsBySchool(schoolId: string, limit?: number, offset?: number): Promise<ListResponse<Student>> {
    const response = await this.client.get<ApiResponse<Student[]>>(`/api/v1/students/school/${schoolId}`, {
      params: { limit, offset },
    })
    return {
      items: response.data.data || [],
      meta: response.data.meta,
    }
  }

  async getStudentsByParent(parentId: string, limit?: number, offset?: number): Promise<ListResponse<Student>> {
    const response = await this.client.get<ApiResponse<Student[]>>(`/api/v1/students/parent/${parentId}`, {
      params: { limit, offset },
    })
    return {
      items: response.data.data || [],
      meta: response.data.meta,
    }
  }

  async updateStudent(id: string, data: UpdateStudentRequest): Promise<Student> {
    const response = await this.client.put<ApiResponse<Student>>(`/api/v1/students/${id}`, data)
    return response.data.data!
  }

  async deleteStudent(id: string): Promise<void> {
    await this.client.delete(`/api/v1/students/${id}`)
  }

  // ============================================================================
  // MEALS
  // ============================================================================

  async createMeal(data: CreateMealRequest): Promise<Meal> {
    const response = await this.client.post<ApiResponse<Meal>>("/api/v1/meals", data)
    return response.data.data!
  }

  async getMeal(id: string): Promise<Meal> {
    const response = await this.client.get<ApiResponse<Meal>>(`/api/v1/meals/${id}`)
    return response.data.data!
  }

  async getMealsBySchool(schoolId: string, limit?: number, offset?: number): Promise<ListResponse<Meal>> {
    const response = await this.client.get<ApiResponse<Meal[]>>(`/api/v1/meals/school/${schoolId}`, {
      params: { limit, offset },
    })
    return {
      items: response.data.data || [],
      meta: response.data.meta,
    }
  }

  async listMeals(limit?: number, offset?: number): Promise<ListResponse<Meal>> {
    const response = await this.client.get<ApiResponse<Meal[]>>("/api/v1/meals", {
      params: { limit, offset },
    })
    return {
      items: response.data.data || [],
      meta: response.data.meta,
    }
  }

  async updateMeal(id: string, data: UpdateMealRequest): Promise<Meal> {
    const response = await this.client.put<ApiResponse<Meal>>(`/api/v1/meals/${id}`, data)
    return response.data.data!
  }

  async deleteMeal(id: string): Promise<void> {
    await this.client.delete(`/api/v1/meals/${id}`)
  }

  // ============================================================================
  // MEAL PLANS
  // ============================================================================

  async createMealPlan(data: CreateMealPlanRequest): Promise<MealPlan> {
    const response = await this.client.post<ApiResponse<MealPlan>>("/api/v1/meal-plans", data)
    return response.data.data!
  }

  async getMealPlan(id: string): Promise<MealPlan> {
    const response = await this.client.get<ApiResponse<MealPlan>>(`/api/v1/meal-plans/${id}`)
    return response.data.data!
  }

  async getMealPlansByStudent(studentId: string, limit?: number, offset?: number): Promise<ListResponse<MealPlan>> {
    const response = await this.client.get<ApiResponse<MealPlan[]>>(`/api/v1/meal-plans/student/${studentId}`, {
      params: { limit, offset },
    })
    return {
      items: response.data.data || [],
      meta: response.data.meta,
    }
  }

  async listMealPlans(limit?: number, offset?: number): Promise<ListResponse<MealPlan>> {
    const response = await this.client.get<ApiResponse<MealPlan[]>>("/api/v1/meal-plans", {
      params: { limit, offset },
    })
    return {
      items: response.data.data || [],
      meta: response.data.meta,
    }
  }

  async updateMealPlan(id: string, data: UpdateMealPlanRequest): Promise<MealPlan> {
    const response = await this.client.put<ApiResponse<MealPlan>>(`/api/v1/meal-plans/${id}`, data)
    return response.data.data!
  }

  async deleteMealPlan(id: string): Promise<void> {
    await this.client.delete(`/api/v1/meal-plans/${id}`)
  }

  // ============================================================================
  // ORDERS
  // ============================================================================

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await this.client.post<ApiResponse<Order>>("/api/v1/orders", data)
    return response.data.data!
  }

  async getOrder(id: string): Promise<Order> {
    const response = await this.client.get<ApiResponse<Order>>(`/api/v1/orders/${id}`)
    return response.data.data!
  }

  async listOrders(limit?: number, offset?: number): Promise<ListResponse<Order>> {
    const response = await this.client.get<ApiResponse<Order[]>>("/api/v1/orders", {
      params: { limit, offset },
    })
    return {
      items: response.data.data || [],
      meta: response.data.meta,
    }
  }

  async getOrdersBySupplier(supplierId: string, limit?: number, offset?: number): Promise<ListResponse<Order>> {
    const response = await this.client.get<ApiResponse<Order[]>>(`/api/v1/orders/supplier/${supplierId}`, {
      params: { limit, offset },
    })
    return {
      items: response.data.data || [],
      meta: response.data.meta,
    }
  }

  async getOrdersBySchool(schoolId: string, limit?: number, offset?: number): Promise<ListResponse<Order>> {
    const response = await this.client.get<ApiResponse<Order[]>>(`/api/v1/orders/school/${schoolId}`, {
      params: { limit, offset },
    })
    return {
      items: response.data.data || [],
      meta: response.data.meta,
    }
  }

  async updateOrder(id: string, data: UpdateOrderRequest): Promise<Order> {
    const response = await this.client.put<ApiResponse<Order>>(`/api/v1/orders/${id}`, data)
    return response.data.data!
  }

  async updateOrderStatus(id: string, data: UpdateOrderStatusRequest): Promise<Order> {
    const response = await this.client.patch<ApiResponse<Order>>(`/api/v1/orders/${id}/status`, data)
    return response.data.data!
  }

  async deleteOrder(id: string): Promise<void> {
    await this.client.delete(`/api/v1/orders/${id}`)
  }

  // ============================================================================
  // SUPPLIERS
  // ============================================================================

  async createSupplier(data: CreateSupplierRequest): Promise<Supplier> {
    const response = await this.client.post<ApiResponse<Supplier>>("/api/v1/suppliers", data)
    return response.data.data!
  }

  async getSupplier(id: string): Promise<Supplier> {
    const response = await this.client.get<ApiResponse<Supplier>>(`/api/v1/suppliers/${id}`)
    return response.data.data!
  }

  async listSuppliers(limit?: number, offset?: number): Promise<ListResponse<Supplier>> {
    const response = await this.client.get<ApiResponse<Supplier[]>>("/api/v1/suppliers", {
      params: { limit, offset },
    })
    return {
      items: response.data.data || [],
      meta: response.data.meta,
    }
  }

  async updateSupplier(id: string, data: UpdateSupplierRequest): Promise<Supplier> {
    const response = await this.client.put<ApiResponse<Supplier>>(`/api/v1/suppliers/${id}`, data)
    return response.data.data!
  }

  async deleteSupplier(id: string): Promise<void> {
    await this.client.delete(`/api/v1/suppliers/${id}`)
  }

  // ============================================================================
  // ANNOUNCEMENTS
  // ============================================================================

  async createAnnouncement(data: CreateAnnouncementRequest): Promise<Announcement> {
    const response = await this.client.post<ApiResponse<Announcement>>("/api/v1/announcements", data)
    return response.data.data!
  }

  async getAnnouncement(id: string): Promise<Announcement> {
    const response = await this.client.get<ApiResponse<Announcement>>(`/api/v1/announcements/${id}`)
    return response.data.data!
  }

  async getAnnouncementsBySchool(schoolId: string, limit?: number, offset?: number): Promise<ListResponse<Announcement>> {
    const response = await this.client.get<ApiResponse<Announcement[]>>(`/api/v1/announcements/school/${schoolId}`, {
      params: { limit, offset },
    })
    return {
      items: response.data.data || [],
      meta: response.data.meta,
    }
  }

  async listAnnouncements(limit?: number, offset?: number): Promise<ListResponse<Announcement>> {
    const response = await this.client.get<ApiResponse<Announcement[]>>("/api/v1/announcements", {
      params: { limit, offset },
    })
    return {
      items: response.data.data || [],
      meta: response.data.meta,
    }
  }

  async updateAnnouncement(id: string, data: UpdateAnnouncementRequest): Promise<Announcement> {
    const response = await this.client.put<ApiResponse<Announcement>>(`/api/v1/announcements/${id}`, data)
    return response.data.data!
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await this.client.delete(`/api/v1/announcements/${id}`)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// User API namespace for easier imports
export const userApi = {
  getProfile: () => apiClient.getProfile(),
  updateProfile: (data: ProfileUpdateRequest) => apiClient.updateProfile(data),
  getProfileById: (userId: string) => apiClient.getProfileById(userId),
  deactivateUser: (userId: string) => apiClient.deactivateUser(userId),
  changePassword: (data: ChangePasswordRequest) => apiClient.changePassword(data),
}

// School API namespace
export const schoolApi = {
  listSchools: (limit?: number, offset?: number) => apiClient.listSchools(limit, offset),
  getSchool: (id: string) => apiClient.getSchool(id),
  createSchool: (data: CreateSchoolRequest) => apiClient.createSchool(data),
  updateSchool: (id: string, data: UpdateSchoolRequest) => apiClient.updateSchool(id, data),
  deleteSchool: (id: string) => apiClient.deleteSchool(id),
}

// Student API namespace
export const studentApi = {
  listStudents: (limit?: number, offset?: number) => apiClient.listStudents(limit, offset),
  getStudentsBySchool: (schoolId: string, limit?: number, offset?: number) => apiClient.getStudentsBySchool(schoolId, limit, offset),
  getStudentsByParent: (parentId: string, limit?: number, offset?: number) => apiClient.getStudentsByParent(parentId, limit, offset),
  getStudent: (id: string) => apiClient.getStudent(id),
  createStudent: (data: CreateStudentRequest) => apiClient.createStudent(data),
  updateStudent: (id: string, data: UpdateStudentRequest) => apiClient.updateStudent(id, data),
  deleteStudent: (id: string) => apiClient.deleteStudent(id),
}

// Meal API namespace
export const mealApi = {
  listMeals: (limit?: number, offset?: number) => apiClient.listMeals(limit, offset),
  getMealsBySchool: (schoolId: string, limit?: number, offset?: number) => apiClient.getMealsBySchool(schoolId, limit, offset),
  getMeal: (id: string) => apiClient.getMeal(id),
  createMeal: (data: CreateMealRequest) => apiClient.createMeal(data),
  updateMeal: (id: string, data: UpdateMealRequest) => apiClient.updateMeal(id, data),
  deleteMeal: (id: string) => apiClient.deleteMeal(id),
}

// MealPlan API namespace
export const mealPlanApi = {
  listMealPlans: (limit?: number, offset?: number) => apiClient.listMealPlans(limit, offset),
  getMealPlansByStudent: (studentId: string, limit?: number, offset?: number) => apiClient.getMealPlansByStudent(studentId, limit, offset),
  getMealPlan: (id: string) => apiClient.getMealPlan(id),
  createMealPlan: (data: CreateMealPlanRequest) => apiClient.createMealPlan(data),
  updateMealPlan: (id: string, data: UpdateMealPlanRequest) => apiClient.updateMealPlan(id, data),
  deleteMealPlan: (id: string) => apiClient.deleteMealPlan(id),
}

// Order API namespace
export const orderApi = {
  listOrders: (limit?: number, offset?: number) => apiClient.listOrders(limit, offset),
  getOrdersBySupplier: (supplierId: string, limit?: number, offset?: number) => apiClient.getOrdersBySupplier(supplierId, limit, offset),
  getOrdersBySchool: (schoolId: string, limit?: number, offset?: number) => apiClient.getOrdersBySchool(schoolId, limit, offset),
  getOrder: (id: string) => apiClient.getOrder(id),
  createOrder: (data: CreateOrderRequest) => apiClient.createOrder(data),
  updateOrder: (id: string, data: UpdateOrderRequest) => apiClient.updateOrder(id, data),
  updateOrderStatus: (id: string, data: UpdateOrderStatusRequest) => apiClient.updateOrderStatus(id, data),
  deleteOrder: (id: string) => apiClient.deleteOrder(id),
}

// Supplier API namespace
export const supplierApi = {
  listSuppliers: (limit?: number, offset?: number) => apiClient.listSuppliers(limit, offset),
  getSupplier: (id: string) => apiClient.getSupplier(id),
  createSupplier: (data: CreateSupplierRequest) => apiClient.createSupplier(data),
  updateSupplier: (id: string, data: UpdateSupplierRequest) => apiClient.updateSupplier(id, data),
  deleteSupplier: (id: string) => apiClient.deleteSupplier(id),
}

// Announcement API namespace
export const announcementApi = {
  listAnnouncements: (limit?: number, offset?: number) => apiClient.listAnnouncements(limit, offset),
  getAnnouncementsBySchool: (schoolId: string, limit?: number, offset?: number) => apiClient.getAnnouncementsBySchool(schoolId, limit, offset),
  getAnnouncement: (id: string) => apiClient.getAnnouncement(id),
  createAnnouncement: (data: CreateAnnouncementRequest) => apiClient.createAnnouncement(data),
  updateAnnouncement: (id: string, data: UpdateAnnouncementRequest) => apiClient.updateAnnouncement(id, data),
  deleteAnnouncement: (id: string) => apiClient.deleteAnnouncement(id),
}

export default ApiClient
