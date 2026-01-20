import { axiosInstance } from "../axios";

export interface Student {
    id: string;
    name: string;
    age?: number;
    grade?: string;
    parentId: string;
    organizationId?: string;
    school: {
        id: string;
        name: string;
    };
}

export const studentApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            const response = await axiosInstance.get(`/students?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch students", error);
            throw error;
        }
    },

    getById: async (id: string) => {
        try {
            const response = await axiosInstance.get(`/students/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: Partial<Student>) => {
        try {
            const response = await axiosInstance.post("/students", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: string, data: Partial<Student>) => {
        try {
            const response = await axiosInstance.put(`/students/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            await axiosInstance.delete(`/students/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    },
};
