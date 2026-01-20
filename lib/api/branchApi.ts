import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Branch {
    id: string;
    organizationId: string;
    name: string;
    code: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
    isActive: boolean;
    isHeadquarters: boolean;
    managerId?: string;
    managerName?: string;
}

export interface CreateBranchRequest {
    name: string;
    code: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
    isHeadquarters?: boolean;
    managerId?: string;
}

export const branchApi = {
    getAll: async (orgId: string) => {
        const response = await api.get(`/organizations/${orgId}/branches`);
        return response.data;
    },

    getById: async (branchId: string) => {
        const response = await api.get(`/organizations/_/branches/${branchId}`);
        return response.data;
    },

    create: async (orgId: string, data: CreateBranchRequest) => {
        const response = await api.post(`/organizations/${orgId}/branches`, data);
        return response.data;
    },

    update: async (orgId: string, branchId: string, data: CreateBranchRequest) => {
        const response = await api.put(`/organizations/${orgId}/branches/${branchId}`, data);
        return response.data;
    },

    delete: async (orgId: string, branchId: string) => {
        const response = await api.delete(`/organizations/${orgId}/branches/${branchId}`);
        return response.data;
    },
};
