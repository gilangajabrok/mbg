package com.mbg.service;

import com.mbg.dto.AuditAnalyticsDTO;
import com.mbg.dto.AuditLogDTO;
import com.mbg.entity.AuditLog;
import com.mbg.entity.User;
import com.mbg.repository.AuditLogRepository;
import com.mbg.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Transactional
    public void log(String action, String resourceType, UUID resourceId, String details) {
        try {
            User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();

            AuditLog auditLog = AuditLog.builder()
                    .userId(currentUser.getId())
                    .action(action)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .details(details)
                    .ipAddress(getClientIp(request))
                    .userAgent(request.getHeader("User-Agent"))
                    .build();

            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to create audit log", e);
        }
    }

    public Page<AuditLogDTO> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToDTO);
    }

    public Page<AuditLogDTO> getAuditLogsByUser(UUID userId, Pageable pageable) {
        List<AuditLog> logs = auditLogRepository.findByUserId(userId);
        // Convert to page manually or use pageable
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToDTO);
    }

    public Page<AuditLogDTO> getAuditLogsByDateRange(LocalDateTime start, LocalDateTime end, Pageable pageable) {
        return auditLogRepository.findByCreatedAtBetween(start, end, pageable)
                .map(this::mapToDTO);
    }

    public AuditAnalyticsDTO getAnalytics() {
        List<AuditLog> allLogs = auditLogRepository.findAll();

        // Actions by type
        Map<String, Long> actionsByType = allLogs.stream()
                .collect(Collectors.groupingBy(AuditLog::getAction, Collectors.counting()));

        // Actions by resource
        Map<String, Long> actionsByResource = allLogs.stream()
                .filter(log -> log.getResourceType() != null)
                .collect(Collectors.groupingBy(AuditLog::getResourceType, Collectors.counting()));

        // Most active users
        Map<String, Long> mostActiveUsers = allLogs.stream()
                .filter(log -> log.getUserId() != null)
                .collect(Collectors.groupingBy(
                        log -> log.getUserId().toString(),
                        Collectors.counting()
                ));

        // Actions per day (simplified)
        Map<String, Long> actionsPerDay = new HashMap<>();

        return AuditAnalyticsDTO.builder()
                .totalActions((long) allLogs.size())
                .actionsByType(actionsByType)
                .actionsByResource(actionsByResource)
                .mostActiveUsers(mostActiveUsers)
                .actionsPerDay(actionsPerDay)
                .build();
    }

    private AuditLogDTO mapToDTO(AuditLog auditLog) {
        String userEmail = null;
        if (auditLog.getUserId() != null) {
            userEmail = userRepository.findById(auditLog.getUserId())
                    .map(User::getEmail)
                    .orElse(null);
        }

        return AuditLogDTO.builder()
                .id(auditLog.getId())
                .userId(auditLog.getUserId())
                .userEmail(userEmail)
                .action(auditLog.getAction())
                .resourceType(auditLog.getResourceType())
                .resourceId(auditLog.getResourceId())
                .details(auditLog.getDetails())
                .ipAddress(auditLog.getIpAddress())
                .createdAt(auditLog.getCreatedAt())
                .build();
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0];
        }
        return request.getRemoteAddr();
    }
}
