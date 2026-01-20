package com.mbg.controller;

import com.mbg.dto.ApiResponse;
import com.mbg.dto.CreateUserRequest;
import com.mbg.dto.UpdateUserRoleRequest;
import com.mbg.dto.UserDTO;
import com.mbg.entity.Role;
import com.mbg.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/governance/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('GREAT_ADMIN')")
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<UserDTO>> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDTO user = userService.createUser(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", user));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserDTO>>> getAllUsers(Pageable pageable) {
        Page<UserDTO> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getUser(@PathVariable UUID id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getUsersByRole(@PathVariable String role) {
        Role roleEnum = Role.valueOf(role.toUpperCase());
        List<UserDTO> users = userService.getUsersByRole(roleEnum);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<ApiResponse<UserDTO>> updateUserRole(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        UserDTO user = userService.updateUserRole(id, request);
        return ResponseEntity.ok(ApiResponse.success("User role updated", user));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<UserDTO>> activateUser(@PathVariable UUID id) {
        UserDTO user = userService.activateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User activated", user));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<UserDTO>> deactivateUser(@PathVariable UUID id) {
        UserDTO user = userService.deactivateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deactivated", user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted", null));
    }
}
