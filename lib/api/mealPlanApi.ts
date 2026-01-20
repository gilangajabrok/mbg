import { axiosInstance } from "../axios";
import { Student } from "./studentApi";
import { Meal } from "./mealApi";

export interface MealPlan {
    id: string;
    student: Partial<Student>;
    meal: Partial<Meal>;
    startDate: string;
    endDate: string;
    daysOfWeek?: string;
    organizationId?: string;
}

export const mealPlanApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            const response = await axiosInstance.get(`/meal-plans?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (data: Partial<MealPlan>) => {
        try {
            const response = await axiosInstance.post("/meal-plans", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // other methods omitted for brevity
};
