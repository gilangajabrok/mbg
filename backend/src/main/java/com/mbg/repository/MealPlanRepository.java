package com.mbg.repository;

import com.mbg.entity.MealPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MealPlanRepository extends JpaRepository<MealPlan, UUID> {
    
    Page<MealPlan> findByOrganizationId(UUID organizationId, Pageable pageable);
    
    Page<MealPlan> findByStudentId(UUID studentId, Pageable pageable);
}
