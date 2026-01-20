import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Organization {
  id: string;
  name: string;
  code: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  subscriptionType: string;
  subscriptionExpiresAt?: string;
  maxBranches: number;
  maxUsers: number;
  createdAt: string;
  currentBranches?: number;
  currentUsers?: number;
}

export interface CreateOrganizationRequest {
  name: string;
  code: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  subscriptionType?: string;
  maxBranches?: number;
  maxUsers?: number;
}

export const organizationApi = {
  getAll: async (page = 0, size = 10) => {
    const response = await api.get(`/governance/organizations?page=${page}&size=${size}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/governance/organizations/${id}`);
    return response.data;
  },

  create: async (data: CreateOrganizationRequest) => {
    const response = await api.post('/governance/organizations', data);
    return response.data;
  },

  update: async (id: string, data: CreateOrganizationRequest) => {
    const response = await api.put(`/governance/organizations/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/governance/organizations/${id}`);
    return response.data;
  },

  activate: async (id: string) => {
    const response = await api.put(`/governance/organizations/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: string) => {
    const response = await api.put(`/governance/organizations/${id}/deactivate`);
    return response.data;
  },
};
