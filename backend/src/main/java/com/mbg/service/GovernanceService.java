package com.mbg.service;

import com.mbg.dto.GovernanceDashboardDTO;
import com.mbg.entity.Role;
import com.mbg.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GovernanceService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final StudentRepository studentRepository;
    private final MealRepository mealRepository;
    private final OrderRepository orderRepository;
    private final SupplierRepository supplierRepository;
    private final DocumentRepository documentRepository;
    private final AuditLogRepository auditLogRepository;

    public GovernanceDashboardDTO getDashboard() {
        // User statistics
        GovernanceDashboardDTO.UserStatistics userStats = GovernanceDashboardDTO.UserStatistics.builder()
                .totalUsers(userRepository.count())
                .activeUsers(userRepository.findByIsActive(true).size())
                .inactiveUsers(userRepository.findByIsActive(false).size())
                .superAdmins(userRepository.findByRole(Role.SUPER_ADMIN).size())
                .admins(userRepository.findByRole(Role.ADMIN).size())
                .suppliers(userRepository.findByRole(Role.SUPPLIER).size())
                .parents(userRepository.findByRole(Role.PARENT).size())
                .build();

        // Platform statistics
        GovernanceDashboardDTO.PlatformStatistics platformStats = GovernanceDashboardDTO.PlatformStatistics.builder()
                .totalSchools(schoolRepository.count())
                .totalStudents(studentRepository.count())
                .totalMeals(mealRepository.count())
                .totalOrders(orderRepository.count())
                .totalSuppliers(supplierRepository.count())
                .build();

        // Pending approvals
        long pendingApprovals = documentRepository.countByStatus(com.mbg.entity.Document.DocumentStatus.PENDING);

        // Recent audit actions (last 24 hours)
        long recentAuditActions = auditLogRepository.count(); // Simplified

        return GovernanceDashboardDTO.builder()
                .userStats(userStats)
                .platformStats(platformStats)
                .pendingApprovals(pendingApprovals)
                .recentAuditActions(recentAuditActions)
                .build();
    }
}
