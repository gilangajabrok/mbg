import { axiosInstance } from "../axios";

export interface Document {
    id: string;
    title: string;
    type: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    submittedBy: string;
    submittedAt: string;
    approvedBy?: string;
    approvedAt?: string;
    documentUrl?: string; // Optional if file download is needed
}

export interface DocumentStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

export const documentApi = {
    getAll: async (page = 0, size = 10) => {
        const response = await axiosInstance.get(`/governance/documents?page=${page}&size=${size}`);
        return response.data; // Wrapper ApiResponse handled? The backend returns ApiResponse<Page>, so we return that.
    },

    getPending: async (page = 0, size = 10) => {
        const response = await axiosInstance.get(`/governance/documents/pending?page=${page}&size=${size}`);
        return response.data;
    },

    approve: async (id: string) => {
        const response = await axiosInstance.put(`/governance/documents/${id}/approve`);
        return response.data;
    },

    reject: async (id: string, reason: string) => {
        const response = await axiosInstance.put(`/governance/documents/${id}/reject`, { reason });
        return response.data;
    },

    getStats: async () => {
        const response = await axiosInstance.get("/governance/documents/stats");
        return response.data;
    }
};
