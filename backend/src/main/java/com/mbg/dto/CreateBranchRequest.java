package com.mbg.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateBranchRequest {
    
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Code is required")
    private String code;

    private String address;
    private String city;
    private String phone;
    private String email;
    private Boolean isHeadquarters;
    private UUID managerId;
}
