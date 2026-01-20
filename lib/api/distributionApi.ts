import { axiosInstance } from "../axios";
import { Order } from "./orderApi";

export interface Delivery {
    id: string;
    order: Partial<Order>;
    driverName?: string;
    vehicleNumber?: string;
    deliveryNotes?: string;
    status: "PENDING" | "DISPATCHED" | "DELIVERED" | "FAILED";
    deliveredAt?: string;
    organizationId?: string;
}

export const distributionApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            const response = await axiosInstance.get(`/deliveries?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: Partial<Delivery>) => {
        try {
            const response = await axiosInstance.post("/deliveries", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateStatus: async (id: string, status: string) => {
        try {
            const response = await axiosInstance.put(`/deliveries/${id}/status?status=${status}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
