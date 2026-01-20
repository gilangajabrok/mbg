import { axiosInstance } from "../axios";

export interface Parent { // Reusing user structure essentially
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    role: "PARENT";
    organizationId?: string;
    branchId?: string;
    passwordHash?: string; // Only for creation
}

export const parentApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            const response = await axiosInstance.get(`/parents?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: Partial<Parent>) => {
        try {
            // In real scenario map 'password' to 'passwordHash' or update backend to accept password DTO
            // For this prototype we send passwordHash as the plain password to be encoded by backend
            const response = await axiosInstance.post("/parents", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: string, data: Partial<Parent>) => {
        try {
            const response = await axiosInstance.put(`/parents/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            await axiosInstance.delete(`/parents/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    }
};
