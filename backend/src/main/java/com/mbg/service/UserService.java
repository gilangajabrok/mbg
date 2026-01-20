package com.mbg.service;

import com.mbg.dto.CreateUserRequest;
import com.mbg.dto.UpdateUserRoleRequest;
import com.mbg.dto.UserDTO;
import com.mbg.entity.Role;
import com.mbg.entity.User;
import com.mbg.exception.MbgException;
import com.mbg.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    @Transactional
    public UserDTO createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw MbgException.conflict("Email already exists");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw MbgException.badRequest("Invalid role: " + request.getRole());
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .isActive(true)
                .build();

        user = userRepository.save(user);
        log.info("User created: {}", user.getEmail());

        auditService.log("USER_CREATE", "USER", user.getId(),
                "User created: " + user.getEmail() + " with role: " + role);

        return mapToDTO(user);
    }

    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToDTO);
    }

    public UserDTO getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> MbgException.notFound("User"));
        return mapToDTO(user);
    }

    public List<UserDTO> getUsersByRole(Role role) {
        return userRepository.findByRole(role).stream()
               .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDTO updateUserRole(UUID id, UpdateUserRoleRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> MbgException.notFound("User"));

        Role newRole;
        try {
            newRole = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw MbgException.badRequest("Invalid role: " + request.getRole());
        }

        Role oldRole = user.getRole();
        user.setRole(newRole);
        user = userRepository.save(user);

        log.info("User role updated: {} from {} to {}", user.getEmail(), oldRole, newRole);

        auditService.log("USER_ROLE_UPDATE", "USER", user.getId(),
                "Role changed from " + oldRole + " to " + newRole);

        return mapToDTO(user);
    }

    @Transactional
    public UserDTO activateUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> MbgException.notFound("User"));

        user.setIsActive(true);
        user = userRepository.save(user);

        log.info("User activated: {}", user.getEmail());

        auditService.log("USER_ACTIVATE", "USER", user.getId(),
                "User activated: " + user.getEmail());

        return mapToDTO(user);
    }

    @Transactional
    public UserDTO deactivateUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> MbgException.notFound("User"));

        user.setIsActive(false);
        user = userRepository.save(user);

        log.info("User deactivated: {}", user.getEmail());

        auditService.log("USER_DEACTIVATE", "USER", user.getId(),
                "User deactivated: " + user.getEmail());

        return mapToDTO(user);
    }

    @Transactional
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> MbgException.notFound("User"));

        String email = user.getEmail();
        userRepository.delete(user);

        log.info("User deleted: {}", email);

        auditService.log("USER_DELETE", "USER", id,
                "User deleted: " + email);
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
