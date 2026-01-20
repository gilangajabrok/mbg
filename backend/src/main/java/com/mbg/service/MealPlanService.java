package com.mbg.service;

import com.mbg.entity.MealPlan;
import com.mbg.entity.Student;
import com.mbg.entity.Meal;
import com.mbg.repository.MealPlanRepository;
import com.mbg.repository.StudentRepository;
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
public class MealPlanService {

    private final MealPlanRepository mealPlanRepository;
    private final StudentRepository studentRepository;
    private final MealRepository mealRepository;

    @Transactional(readOnly = true)
    public Page<MealPlan> getAllMealPlans(Pageable pageable) {
        UUID organizationId = TenantContext.getTenantId();
        // MealPlans are per student, who is in Org. Branch logic via Student if needed, currently Org level.
        return mealPlanRepository.findByOrganizationId(organizationId, pageable);
    }

    @Transactional(readOnly = true)
    public MealPlan getMealPlanById(UUID id) {
        return mealPlanRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("MealPlan not found with id: " + id));
    }

    public MealPlan createMealPlan(MealPlan mealPlan) {
        if (mealPlan.getOrganizationId() == null) {
            mealPlan.setOrganizationId(TenantContext.getTenantId());
        }
        
        // Validate Student
        if (mealPlan.getStudent() != null && mealPlan.getStudent().getId() != null) {
             Student student = studentRepository.findById(mealPlan.getStudent().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Student not found"));
             mealPlan.setStudent(student);
        } else {
             throw new IllegalArgumentException("Student is required");
        }

        // Validate Meal
        if (mealPlan.getMeal() != null && mealPlan.getMeal().getId() != null) {
             Meal meal = mealRepository.findById(mealPlan.getMeal().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Meal not found"));
             mealPlan.setMeal(meal);
        } else {
             throw new IllegalArgumentException("Meal is required");
        }

        return mealPlanRepository.save(mealPlan);
    }

    public MealPlan updateMealPlan(UUID id, MealPlan details) {
        MealPlan mealPlan = getMealPlanById(id);
        
        mealPlan.setStartDate(details.getStartDate());
        mealPlan.setEndDate(details.getEndDate());
        mealPlan.setDaysOfWeek(details.getDaysOfWeek());
        
        if (details.getMeal() != null && details.getMeal().getId() != null) {
             Meal meal = mealRepository.findById(details.getMeal().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Meal not found"));
             mealPlan.setMeal(meal);
        }

        return mealPlanRepository.save(mealPlan);
    }

    public void deleteMealPlan(UUID id) {
        MealPlan mealPlan = getMealPlanById(id);
        mealPlanRepository.delete(mealPlan);
    }
}
