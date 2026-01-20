package com.mbg.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GovernanceDashboardDTO {
    private UserStatistics userStats;
    private PlatformStatistics platformStats;
    private long pendingApprovals;
    private long recentAuditActions;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserStatistics {
        private long totalUsers;
        private long activeUsers;
        private long inactiveUsers;
        private long superAdmins;
        private long admins;
        private long suppliers;
        private long parents;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PlatformStatistics {
        private long totalSchools;
        private long totalStudents;
        private long totalMeals;
        private long totalOrders;
        private long totalSuppliers;
    }
}
