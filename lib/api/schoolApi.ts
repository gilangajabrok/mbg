import { axiosInstance } from "../axios";

export interface School {
    id: string; // UUID
    name: string;
    address?: string;
    city?: string;
    district?: string;
    phone?: string;
    email?: string;
    organizationId?: string;
    branchId?: string;
}

export const schoolApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            const response = await axiosInstance.get(`/schools?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch schools", error);
            throw error;
        }
    },

    getById: async (id: string) => {
        try {
            const response = await axiosInstance.get(`/schools/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch school ${id}`, error);
            throw error;
        }
    },

    create: async (data: Partial<School>) => {
        try {
            const response = await axiosInstance.post("/schools", data);
            return response.data;
        } catch (error) {
            console.error("Failed to create school", error);
            throw error;
        }
    },

    update: async (id: string, data: Partial<School>) => {
        try {
            const response = await axiosInstance.put(`/schools/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Failed to update school ${id}`, error);
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            await axiosInstance.delete(`/schools/${id}`);
            return true;
        } catch (error) {
            console.error(`Failed to delete school ${id}`, error);
            throw error;
        }
    },
};
