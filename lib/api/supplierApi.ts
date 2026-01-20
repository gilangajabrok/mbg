import { axiosInstance } from "../axios";

export interface Supplier {
    id: string; // UUID
    name: string;
    address?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    category?: string;
    organizationId?: string;
    branchId?: string;
}

export const supplierApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            const response = await axiosInstance.get(`/suppliers?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch suppliers", error);
            throw error;
        }
    },

    getById: async (id: string) => {
        try {
            const response = await axiosInstance.get(`/suppliers/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: Partial<Supplier>) => {
        try {
            const response = await axiosInstance.post("/suppliers", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: string, data: Partial<Supplier>) => {
        try {
            const response = await axiosInstance.put(`/suppliers/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            await axiosInstance.delete(`/suppliers/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    },
};
