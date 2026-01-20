package com.mbg.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateOrganizationRequest {
    
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Code is required")
    @Size(max = 50, message = "Code must not exceed 50 characters")
    private String code;

    private String description;
    private String website;

    @Email(message = "Email should be valid")
    private String email;

    private String phone;
    private String address;
    private String subscriptionType;
    private Integer maxBranches;
    private Integer maxUsers;
}
