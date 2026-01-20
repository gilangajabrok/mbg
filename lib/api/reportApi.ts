import { axiosInstance } from "../axios";

export interface GovernanceDashboard {
    tenantCount: number;
    activeTenants: number;
    totalUsers: number;
    totalSchools: number;
    complianceScore: number;
    pendingDocuments: number;
    activeAlerts: number;
}

export const reportApi = {
    getDashboard: async () => {
        const response = await axiosInstance.get("/governance/dashboard/dashboard");
        // Unwrap ApiResponse
        return response.data.data as GovernanceDashboard;
    }
};
