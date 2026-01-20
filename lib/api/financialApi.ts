import { axiosInstance } from "../axios";

export interface FinancialRecord {
    id: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
    category: string;
    description?: string;
    transactionDate?: string;
    referenceId?: string;
}

export interface FinancialSummary {
    income: number;
    expense: number;
    balance: number;
}

export const financialApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            const response = await axiosInstance.get(`/finance?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getSummary: async () => {
        try {
            const response = await axiosInstance.get("/finance/summary");
            return response.data as FinancialSummary;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: Partial<FinancialRecord>) => {
        try {
            const response = await axiosInstance.post("/finance", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            await axiosInstance.delete(`/finance/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    }
};
