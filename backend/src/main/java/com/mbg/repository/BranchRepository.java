package com.mbg.repository;

import com.mbg.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BranchRepository extends JpaRepository<Branch, UUID> {
    
    List<Branch> findByOrganizationId(UUID organizationId);
    
    List<Branch> findByOrganizationIdAndIsActive(UUID organizationId, Boolean isActive);
    
    Optional<Branch> findByOrganizationIdAndCode(UUID organizationId, String code);
    
    Optional<Branch> findByOrganizationIdAndIsHeadquarters(UUID organizationId, Boolean isHeadquarters);
    
    long countByOrganizationId(UUID organizationId);
}
