package com.mbg.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BranchDTO {
    private UUID id;
    private UUID organizationId;
    private String name;
    private String code;
    private String address;
    private String city;
    private String phone;
    private String email;
    private Boolean isActive;
    private Boolean isHeadquarters;
    private UUID managerId;
    private String managerName;
}
