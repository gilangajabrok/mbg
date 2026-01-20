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
public class UserDTO {
    private UUID id;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
