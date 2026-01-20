package com.mbg.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class DocumentSubmitRequest {
    
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Document type is required")
    private String documentType; // Will be converted to enum

    private String relatedEntityType;
    private UUID relatedEntityId;

    @NotBlank(message = "Document URL is required")
    private String documentUrl;
}
