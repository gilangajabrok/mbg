import { axiosInstance } from "../axios";
import { School } from "./schoolApi";
import { Meal } from "./mealApi";

export interface QualityCheck {
    id: string;
    school?: Partial<School>;
    meal?: Partial<Meal>;
    inspectorName?: string;
    result: "PASSED" | "WARNING" | "FAILED";
    rating?: number;
    comments?: string;
    checkDate: string;
}

export const qualityApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            const response = await axiosInstance.get(`/quality?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: Partial<QualityCheck>) => {
        try {
            const response = await axiosInstance.post("/quality", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            await axiosInstance.delete(`/quality/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    }
};
