package com.mbg.service;

import com.mbg.entity.Meal;
import com.mbg.repository.MealRepository;
import com.mbg.config.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MealService {

    private final MealRepository mealRepository;

    @Transactional(readOnly = true)
    public Page<Meal> getAllMeals(Pageable pageable) {
        UUID organizationId = TenantContext.getTenantId();
        UUID branchId = TenantContext.getBranchId();

        // Optional: Allow fetching all org meals if branch doesn't override?
        // For now strict filtering
        if (branchId != null) {
            return mealRepository.findByOrganizationIdAndBranchId(organizationId, branchId, pageable);
        } else {
            return mealRepository.findByOrganizationId(organizationId, pageable);
        }
    }

    @Transactional(readOnly = true)
    public Meal getMealById(UUID id) {
        return mealRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Meal not found with id: " + id));
    }

    public Meal createMeal(Meal meal) {
        if (meal.getOrganizationId() == null) {
            meal.setOrganizationId(TenantContext.getTenantId());
        }
        if (meal.getBranchId() == null) {
            meal.setBranchId(TenantContext.getBranchId());
        }
        return mealRepository.save(meal);
    }

    public Meal updateMeal(UUID id, Meal details) {
        Meal meal = getMealById(id);
        
        meal.setName(details.getName());
        meal.setDescription(details.getDescription());
        meal.setNutritionalInfo(details.getNutritionalInfo());
        // meal.setPrice(details.getPrice()); // Assuming price exists or added later
        
        return mealRepository.save(meal);
    }

    public void deleteMeal(UUID id) {
        Meal meal = getMealById(id);
        mealRepository.delete(meal);
    }
}
