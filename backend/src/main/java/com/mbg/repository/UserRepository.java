package com.mbg.repository;

import com.mbg.entity.User;
import com.mbg.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(Role role);
    
    List<User> findByIsActive(Boolean isActive);

    Page<User> findByRoleAndOrganizationId(Role role, UUID organizationId, Pageable pageable);

    Page<User> findByRoleAndOrganizationIdAndBranchId(Role role, UUID organizationId, UUID branchId, Pageable pageable);
}
