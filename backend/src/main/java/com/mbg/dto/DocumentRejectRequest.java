package com.mbg.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DocumentRejectRequest {
    
    @NotBlank(message = "Rejection reason is required")
    private String rejectionReason;
}
