package com.mbg.repository;

import com.mbg.entity.QualityCheck;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QualityCheckRepository extends JpaRepository<QualityCheck, UUID> {
    
    Page<QualityCheck> findByOrganizationId(UUID organizationId, Pageable pageable);
    
    Page<QualityCheck> findBySchoolId(UUID schoolId, Pageable pageable);
}
