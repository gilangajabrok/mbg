package com.mbg.service;

import com.mbg.entity.User;
import com.mbg.entity.Role;
import com.mbg.repository.UserRepository;
import com.mbg.config.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ParentService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<User> getAllParents(Pageable pageable) {
        UUID organizationId = TenantContext.getTenantId();
        UUID branchId = TenantContext.getBranchId();

        if (branchId != null) {
            return userRepository.findByRoleAndOrganizationIdAndBranchId(Role.PARENT, organizationId, branchId, pageable);
        } else {
            return userRepository.findByRoleAndOrganizationId(Role.PARENT, organizationId, pageable);
        }
    }

    @Transactional(readOnly = true)
    public User getParentById(UUID id) {
        return userRepository.findById(id)
                .filter(u -> u.getRole() == Role.PARENT)
                .orElseThrow(() -> new EntityNotFoundException("Parent not found with id: " + id));
    }

    public User createParent(User parent) {
        if (userRepository.existsByEmail(parent.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        parent.setRole(Role.PARENT);
        parent.setPasswordHash(passwordEncoder.encode(parent.getPasswordHash())); // Assume frontend sends raw password in passwordHash field field temporally or use DTO 
        // Note: Entity has passwordHash, usually DTO has password. For simplicity assuming mapping happens before or reusing field.
        
        if (parent.getOrganizationId() == null) {
            parent.setOrganizationId(TenantContext.getTenantId());
        }
        if (parent.getBranchId() == null) {
            parent.setBranchId(TenantContext.getBranchId());
        }
        
        return userRepository.save(parent);
    }

    public User updateParent(UUID id, User details) {
        User parent = getParentById(id);
        
        parent.setFirstName(details.getFirstName());
        parent.setLastName(details.getLastName());
        parent.setPhone(details.getPhone());
        parent.setAddress(details.getAddress());
        parent.setEmail(details.getEmail());
        
        // Password update should be separate specialized method usually, skipping for basic update
        
        return userRepository.save(parent);
    }

    public void deleteParent(UUID id) {
        User parent = getParentById(id);
        // Soft delete preferred? For now hard delete
        userRepository.delete(parent);
    }
}
