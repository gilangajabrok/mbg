package com.mbg.repository;

import com.mbg.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, UUID> {
    
    Page<Supplier> findByOrganizationId(UUID organizationId, Pageable pageable);
    
    Page<Supplier> findByOrganizationIdAndBranchId(UUID organizationId, UUID branchId, Pageable pageable);
}
