import { axiosInstance } from "../axios";

export interface Meal {
    id: string; // UUID
    name: string;
    description?: string;
    nutritionalInfo?: string; // JSON or text
    organizationId?: string;
    branchId?: string;
}

export const mealApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            const response = await axiosInstance.get(`/meals?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch meals", error);
            throw error;
        }
    },

    getById: async (id: string) => {
        try {
            const response = await axiosInstance.get(`/meals/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: Partial<Meal>) => {
        try {
            const response = await axiosInstance.post("/meals", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: string, data: Partial<Meal>) => {
        try {
            const response = await axiosInstance.put(`/meals/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            await axiosInstance.delete(`/meals/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    },
};
