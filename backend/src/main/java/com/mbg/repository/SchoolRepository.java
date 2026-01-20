package com.mbg.repository;

import com.mbg.entity.School;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchoolRepository extends JpaRepository<School, UUID> {
    
    Optional<School> findByEmail(String email);
    
    Page<School> findByOrganizationId(UUID organizationId, Pageable pageable);
    
    Page<School> findByOrganizationIdAndBranchId(UUID organizationId, UUID branchId, Pageable pageable);
}
