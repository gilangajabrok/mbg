package com.mbg.repository;

import com.mbg.entity.Meal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MealRepository extends JpaRepository<Meal, UUID> {
    
    Page<Meal> findByOrganizationId(UUID organizationId, Pageable pageable);
    
    // Meals might not be strictly branch-scoped if they are shared menus, 
    // but allowing branch scope is flexible.
    Page<Meal> findByOrganizationIdAndBranchId(UUID organizationId, UUID branchId, Pageable pageable);    
}
