package com.mbg.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuditLogDTO {
    private UUID id;
    private UUID userId;
    private String userEmail;
    private String action;
    private String resourceType;
    private UUID resourceId;
    private String details;
    private String ipAddress;
    private LocalDateTime createdAt;
}
