package com.mbg.controller;

import com.mbg.entity.Meal;
import com.mbg.service.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealController {

    private final MealService mealService;

    @GetMapping
    public ResponseEntity<Page<Meal>> getAllMeals(Pageable pageable) {
        return ResponseEntity.ok(mealService.getAllMeals(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Meal> getMealById(@PathVariable UUID id) {
        return ResponseEntity.ok(mealService.getMealById(id));
    }

    @PostMapping
    public ResponseEntity<Meal> createMeal(@RequestBody Meal meal) {
        return ResponseEntity.ok(mealService.createMeal(meal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Meal> updateMeal(@PathVariable UUID id, @RequestBody Meal meal) {
        return ResponseEntity.ok(mealService.updateMeal(id, meal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable UUID id) {
        mealService.deleteMeal(id);
        return ResponseEntity.noContent().build();
    }
}
