import { axiosInstance } from "../axios";
import { Supplier } from "./supplierApi";
import { School } from "./schoolApi";
import { Meal } from "./mealApi";

export interface Order {
    id: string;
    supplier: Partial<Supplier>;
    school: Partial<School>;
    meal: Partial<Meal>;
    quantity: number;
    totalPrice: number;
    status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED";
    organizationId?: string;
}

export const orderApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            const response = await axiosInstance.get(`/orders?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: Partial<Order>) => {
        try {
            const response = await axiosInstance.post("/orders", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateStatus: async (id: string, status: string) => {
        try {
            const response = await axiosInstance.put(`/orders/${id}/status?status=${status}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
