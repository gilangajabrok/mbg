/**
 * Integrated API hooks for MBG Backend
 * Provides typed CRUD operations for all modules with automatic token injection
 */

import { useCallback } from "react"
import {
  School,
  CreateSchoolRequest,
  UpdateSchoolRequest,
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  Meal,
  CreateMealRequest,
  UpdateMealRequest,
  MealPlan,
  CreateMealPlanRequest,
  UpdateMealPlanRequest,
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  Supplier,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  Announcement,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
  ListResponse,
} from "@/lib/api-types"
import { apiClient } from "@/lib/api-client"
import { useApiList, useApiCreate, useApiUpdate, useApiDelete } from "./use-api"

// ============================================================================
// SCHOOLS HOOKS
// ============================================================================

export function useSchoolsList() {
  return useApiList((limit, offset) => apiClient.listSchools(limit, offset))
}

export function useSchoolCreate() {
  return useApiCreate<CreateSchoolRequest, School>((data) =>
    apiClient.createSchool(data)
  )
}

export function useSchoolUpdate() {
  return useApiUpdate<School, School>((id, data) =>
    apiClient.updateSchool(id, data as UpdateSchoolRequest)
  )
}

export function useSchoolDelete() {
  return useApiDelete((id) => apiClient.deleteSchool(id))
}

// ============================================================================
// STUDENTS HOOKS
// ============================================================================

export function useStudentsList() {
  return useApiList((limit, offset) =>
    apiClient.listStudents ? apiClient.listStudents(limit, offset) : Promise.resolve({ items: [] })
  )
}

export function useStudentsBySchool(schoolId: string) {
  return useApiList((limit, offset) =>
    apiClient.getStudentsBySchool(schoolId, limit, offset)
  )
}

export function useStudentsByParent(parentId: string) {
  return useApiList((limit, offset) =>
    apiClient.getStudentsByParent(parentId, limit, offset)
  )
}

export function useStudentCreate() {
  return useApiCreate<CreateStudentRequest, Student>((data) =>
    apiClient.createStudent(data)
  )
}

export function useStudentUpdate() {
  return useApiUpdate<Student, Student>((id, data) =>
    apiClient.updateStudent(id, data as UpdateStudentRequest)
  )
}

export function useStudentDelete() {
  return useApiDelete((id) => apiClient.deleteStudent(id))
}

// ============================================================================
// MEALS HOOKS
// ============================================================================

export function useMealsList() {
  return useApiList((limit, offset) => apiClient.listMeals(limit, offset))
}

export function useMealsBySchool(schoolId: string) {
  return useApiList((limit, offset) =>
    apiClient.getMealsBySchool(schoolId, limit, offset)
  )
}

export function useMealCreate() {
  return useApiCreate<CreateMealRequest, Meal>((data) =>
    apiClient.createMeal(data)
  )
}

export function useMealUpdate() {
  return useApiUpdate<Meal, Meal>((id, data) =>
    apiClient.updateMeal(id, data as UpdateMealRequest)
  )
}

export function useMealDelete() {
  return useApiDelete((id) => apiClient.deleteMeal(id))
}

// ============================================================================
// MEAL PLANS HOOKS
// ============================================================================

export function useMealPlansList() {
  return useApiList((limit, offset) => apiClient.listMealPlans(limit, offset))
}

export function useMealPlansByStudent(studentId: string) {
  return useApiList((limit, offset) =>
    apiClient.getMealPlansByStudent(studentId, limit, offset)
  )
}

export function useMealPlanCreate() {
  return useApiCreate<CreateMealPlanRequest, MealPlan>((data) =>
    apiClient.createMealPlan(data)
  )
}

export function useMealPlanUpdate() {
  return useApiUpdate<MealPlan, MealPlan>((id, data) =>
    apiClient.updateMealPlan(id, data as UpdateMealPlanRequest)
  )
}

export function useMealPlanDelete() {
  return useApiDelete((id) => apiClient.deleteMealPlan(id))
}

// ============================================================================
// ORDERS HOOKS
// ============================================================================

export function useOrdersList() {
  return useApiList((limit, offset) => apiClient.listOrders(limit, offset))
}

export function useOrdersBySupplier(supplierId: string) {
  return useApiList((limit, offset) =>
    apiClient.getOrdersBySupplier(supplierId, limit, offset)
  )
}

export function useOrdersBySchool(schoolId: string) {
  return useApiList((limit, offset) =>
    apiClient.getOrdersBySchool(schoolId, limit, offset)
  )
}

export function useOrderCreate() {
  return useApiCreate<CreateOrderRequest, Order>((data) =>
    apiClient.createOrder(data)
  )
}

export function useOrderUpdate() {
  return useApiUpdate<Order, Order>((id, data) =>
    apiClient.updateOrder(id, data as UpdateOrderRequest)
  )
}

export function useOrderDelete() {
  return useApiDelete((id) => apiClient.deleteOrder(id))
}

// ============================================================================
// SUPPLIERS HOOKS
// ============================================================================

export function useSuppliersList() {
  return useApiList((limit, offset) => apiClient.listSuppliers(limit, offset))
}

export function useSupplierCreate() {
  return useApiCreate<CreateSupplierRequest, Supplier>((data) =>
    apiClient.createSupplier(data)
  )
}

export function useSupplierUpdate() {
  return useApiUpdate<Supplier, Supplier>((id, data) =>
    apiClient.updateSupplier(id, data as UpdateSupplierRequest)
  )
}

export function useSupplierDelete() {
  return useApiDelete((id) => apiClient.deleteSupplier(id))
}

// ============================================================================
// ANNOUNCEMENTS HOOKS
// ============================================================================

export function useAnnouncementsList() {
  return useApiList((limit, offset) => apiClient.listAnnouncements(limit, offset))
}

export function useAnnouncementsBySchool(schoolId: string) {
  return useApiList((limit, offset) =>
    apiClient.getAnnouncementsBySchool(schoolId, limit, offset)
  )
}

export function useAnnouncementCreate() {
  return useApiCreate<CreateAnnouncementRequest, Announcement>((data) =>
    apiClient.createAnnouncement(data)
  )
}

export function useAnnouncementUpdate() {
  return useApiUpdate<Announcement, Announcement>((id, data) =>
    apiClient.updateAnnouncement(id, data as UpdateAnnouncementRequest)
  )
}

export function useAnnouncementDelete() {
  return useApiDelete((id) => apiClient.deleteAnnouncement(id))
}
