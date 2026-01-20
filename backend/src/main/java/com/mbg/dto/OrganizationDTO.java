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
public class OrganizationDTO {
    private UUID id;
    private String name;
    private String code;
    private String description;
    private String website;
    private String email;
    private String phone;
    private String address;
    private Boolean isActive;
    private String subscriptionType;
    private LocalDateTime subscriptionExpiresAt;
    private Integer maxBranches;
    private Integer maxUsers;
    private LocalDateTime createdAt;
    
    // Stats
    private Long currentBranches;
    private Long currentUsers;
}
