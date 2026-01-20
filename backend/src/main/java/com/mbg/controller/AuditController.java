package com.mbg.controller;

import com.mbg.dto.AuditAnalyticsDTO;
import com.mbg.dto.AuditLogDTO;
import com.mbg.dto.ApiResponse;
import com.mbg.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/governance/audit-logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('GREAT_ADMIN')")
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AuditLogDTO>>> getAuditLogs(Pageable pageable) {
        Page<AuditLogDTO> logs = auditService.getAuditLogs(pageable);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Page<AuditLogDTO>>> getAuditLogsByUser(
            @PathVariable UUID userId,
            Pageable pageable
    ) {
        Page<AuditLogDTO> logs = auditService.getAuditLogsByUser(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @GetMapping("/range")
    public ResponseEntity<ApiResponse<Page<AuditLogDTO>>> getAuditLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            Pageable pageable
    ) {
        Page<AuditLogDTO> logs = auditService.getAuditLogsByDateRange(start, end, pageable);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AuditAnalyticsDTO>> getAnalytics() {
        AuditAnalyticsDTO analytics = auditService.getAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }
}
