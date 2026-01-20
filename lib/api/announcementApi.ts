import { axiosInstance } from "../axios";
import { School } from "./schoolApi";

export interface Announcement {
    id: string;
    title: string;
    content: string;
    school?: Partial<School>;
    createdBy?: string;
    createdAt?: string;
    organizationId?: string;
}

export const announcementApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            const response = await axiosInstance.get(`/announcements?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: Partial<Announcement>) => {
        try {
            const response = await axiosInstance.post("/announcements", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: string, data: Partial<Announcement>) => {
        try {
            const response = await axiosInstance.put(`/announcements/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            await axiosInstance.delete(`/announcements/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    }
};
