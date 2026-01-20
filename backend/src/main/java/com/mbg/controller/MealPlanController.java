package com.mbg.controller;

import com.mbg.entity.MealPlan;
import com.mbg.service.MealPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/meal-plans")
@RequiredArgsConstructor
public class MealPlanController {

    private final MealPlanService mealPlanService;

    @GetMapping
    public ResponseEntity<Page<MealPlan>> getAllMealPlans(Pageable pageable) {
        return ResponseEntity.ok(mealPlanService.getAllMealPlans(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MealPlan> getMealPlanById(@PathVariable UUID id) {
        return ResponseEntity.ok(mealPlanService.getMealPlanById(id));
    }

    @PostMapping
    public ResponseEntity<MealPlan> createMealPlan(@RequestBody MealPlan mealPlan) {
        return ResponseEntity.ok(mealPlanService.createMealPlan(mealPlan));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MealPlan> updateMealPlan(@PathVariable UUID id, @RequestBody MealPlan mealPlan) {
        return ResponseEntity.ok(mealPlanService.updateMealPlan(id, mealPlan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMealPlan(@PathVariable UUID id) {
        mealPlanService.deleteMealPlan(id);
        return ResponseEntity.noContent().build();
    }
}
