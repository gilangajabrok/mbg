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
public class DocumentDTO {
    private UUID id;
    private String title;
    private String description;
    private String documentType;
    private String status;
    private UUID submittedBy;
    private UUID reviewedBy;
    private UUID approvedBy;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private String relatedEntityType;
    private UUID relatedEntityId;
    private String documentUrl;
    private String rejectionReason;
    private LocalDateTime createdAt;
}
