package services

import (
	"context"
	"errors"
	"fmt"
	"mbg-backend/internal/models"
	"time"
)

// MealPlanService handles business logic for meal plans
type MealPlanService struct {
	repo models.MealPlanRepository
}

// NewMealPlanService creates a new meal plan service
func NewMealPlanService(repo models.MealPlanRepository) *MealPlanService {
	return &MealPlanService{repo: repo}
}

// Create validates and creates a new meal plan
func (s *MealPlanService) Create(ctx context.Context, req *models.MealPlanCreateRequest) (*models.MealPlan, error) {
	if err := s.validateCreate(req); err != nil {
		return nil, err
	}

	mealPlan := &models.MealPlan{
		StudentID: req.StudentID,
		MealID:    req.MealID,
		StartDate: req.StartDate,
		EndDate:   req.EndDate,
	}

	if err := mealPlan.BeforeCreate(nil); err != nil {
		return nil, err
	}

	if err := s.repo.Create(ctx, mealPlan); err != nil {
		return nil, fmt.Errorf("failed to create meal plan: %w", err)
	}

	return mealPlan, nil
}

// GetByID retrieves a meal plan by ID
func (s *MealPlanService) GetByID(ctx context.Context, id string) (*models.MealPlan, error) {
	if id == "" {
		return nil, errors.New("meal plan id is required")
	}

	mealPlan, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return mealPlan, nil
}

// GetByStudent retrieves meal plans for a student
func (s *MealPlanService) GetByStudent(ctx context.Context, studentID string, limit, offset int) ([]models.MealPlan, error) {
	if studentID == "" {
		return nil, errors.New("student id is required")
	}

	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	}

	mealPlans, err := s.repo.GetByStudent(ctx, studentID, limit, offset)
	if err != nil {
		return nil, err
	}

	return mealPlans, nil
}

// GetByMeal retrieves meal plans for a meal
func (s *MealPlanService) GetByMeal(ctx context.Context, mealID string, limit, offset int) ([]models.MealPlan, error) {
	if mealID == "" {
		return nil, errors.New("meal id is required")
	}

	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	}

	mealPlans, err := s.repo.GetByMeal(ctx, mealID, limit, offset)
	if err != nil {
		return nil, err
	}

	return mealPlans, nil
}

// List retrieves all meal plans
func (s *MealPlanService) List(ctx context.Context, limit, offset int) ([]models.MealPlan, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	}

	mealPlans, err := s.repo.List(ctx, limit, offset)
	if err != nil {
		return nil, err
	}

	return mealPlans, nil
}

// Update modifies a meal plan
func (s *MealPlanService) Update(ctx context.Context, id string, req *models.MealPlanUpdateRequest) (*models.MealPlan, error) {
	if id == "" {
		return nil, errors.New("meal plan id is required")
	}

	if err := s.validateUpdate(req); err != nil {
		return nil, err
	}

	mealPlan, err := s.repo.Update(ctx, id, req)
	if err != nil {
		return nil, err
	}

	return mealPlan, nil
}

// Delete removes a meal plan
func (s *MealPlanService) Delete(ctx context.Context, id string) error {
	if id == "" {
		return errors.New("meal plan id is required")
	}

	return s.repo.Delete(ctx, id)
}

func (s *MealPlanService) validateCreate(req *models.MealPlanCreateRequest) error {
	if req == nil {
		return errors.New("request is required")
	}

	if req.StudentID == "" {
		return errors.New("student id is required")
	}

	if req.MealID == "" {
		return errors.New("meal id is required")
	}

	if req.StartDate.IsZero() {
		return errors.New("start date is required")
	}

	if req.EndDate.IsZero() {
		return errors.New("end date is required")
	}

	if req.EndDate.Before(req.StartDate) {
		return errors.New("end date must be after start date")
	}

	// Check if dates are not in the past
	if req.StartDate.Before(time.Now().AddDate(0, 0, -1)) {
		return errors.New("start date cannot be in the past")
	}

	return nil
}

func (s *MealPlanService) validateUpdate(req *models.MealPlanUpdateRequest) error {
	if req == nil {
		return errors.New("request is required")
	}

	if !req.StartDate.IsZero() && !req.EndDate.IsZero() {
		if req.EndDate.Before(req.StartDate) {
			return errors.New("end date must be after start date")
		}
	}

	return nil
}
