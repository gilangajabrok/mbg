package services

import (
	"context"
	"errors"
	"fmt"
	"mbg-backend/internal/models"
	"strings"
)

// MealService handles business logic for meals
type MealService struct {
	repo models.MealRepository
}

// NewMealService creates a new meal service
func NewMealService(repo models.MealRepository) *MealService {
	return &MealService{repo: repo}
}

// Create validates and creates a new meal
func (s *MealService) Create(ctx context.Context, req *models.MealCreateRequest) (*models.Meal, error) {
	if err := s.validateCreate(req); err != nil {
		return nil, err
	}

	meal := &models.Meal{
		Name:        strings.TrimSpace(req.Name),
		Description: strings.TrimSpace(req.Description),
		Calories:    req.Calories,
		Protein:     req.Protein,
		Carbs:       req.Carbs,
		Fat:         req.Fat,
		Allergens:   strings.TrimSpace(req.Allergens),
		SchoolID:    req.SchoolID,
	}

	if err := meal.BeforeCreate(nil); err != nil {
		return nil, err
	}

	if err := s.repo.Create(ctx, meal); err != nil {
		return nil, fmt.Errorf("failed to create meal: %w", err)
	}

	return meal, nil
}

// GetByID retrieves a meal by ID
func (s *MealService) GetByID(ctx context.Context, id string) (*models.Meal, error) {
	if id == "" {
		return nil, errors.New("meal id is required")
	}

	meal, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return meal, nil
}

// GetBySchool retrieves meals for a school
func (s *MealService) GetBySchool(ctx context.Context, schoolID string, limit, offset int) ([]models.Meal, error) {
	if schoolID == "" {
		return nil, errors.New("school id is required")
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

	meals, err := s.repo.GetBySchool(ctx, schoolID, limit, offset)
	if err != nil {
		return nil, err
	}

	return meals, nil
}

// List retrieves all meals
func (s *MealService) List(ctx context.Context, limit, offset int) ([]models.Meal, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	}

	meals, err := s.repo.List(ctx, limit, offset)
	if err != nil {
		return nil, err
	}

	return meals, nil
}

// Update modifies a meal
func (s *MealService) Update(ctx context.Context, id string, req *models.MealUpdateRequest) (*models.Meal, error) {
	if id == "" {
		return nil, errors.New("meal id is required")
	}

	if err := s.validateUpdate(req); err != nil {
		return nil, err
	}

	meal, err := s.repo.Update(ctx, id, req)
	if err != nil {
		return nil, err
	}

	return meal, nil
}

// Delete removes a meal
func (s *MealService) Delete(ctx context.Context, id string) error {
	if id == "" {
		return errors.New("meal id is required")
	}

	return s.repo.Delete(ctx, id)
}

func (s *MealService) validateCreate(req *models.MealCreateRequest) error {
	if req == nil {
		return errors.New("request is required")
	}

	if req.Name == "" {
		return errors.New("name is required")
	}

	if len(req.Name) > 255 {
		return errors.New("name must be 255 characters or less")
	}

	if req.Calories < 0 {
		return errors.New("calories cannot be negative")
	}

	if req.Calories > 5000 {
		return errors.New("calories must be 5000 or less")
	}

	if req.SchoolID == "" {
		return errors.New("school id is required")
	}

	if req.Protein < 0 {
		return errors.New("protein cannot be negative")
	}

	if req.Carbs < 0 {
		return errors.New("carbs cannot be negative")
	}

	if req.Fat < 0 {
		return errors.New("fat cannot be negative")
	}

	if len(req.Description) > 1000 {
		return errors.New("description must be 1000 characters or less")
	}

	if len(req.Allergens) > 500 {
		return errors.New("allergens must be 500 characters or less")
	}

	return nil
}

func (s *MealService) validateUpdate(req *models.MealUpdateRequest) error {
	if req == nil {
		return errors.New("request is required")
	}

	if req.Name != nil && *req.Name == "" {
		return errors.New("name cannot be empty")
	}

	if req.Name != nil && len(*req.Name) > 255 {
		return errors.New("name must be 255 characters or less")
	}

	if req.Calories != nil && *req.Calories < 0 {
		return errors.New("calories cannot be negative")
	}

	if req.Calories != nil && *req.Calories > 5000 {
		return errors.New("calories must be 5000 or less")
	}

	if req.Protein != nil && *req.Protein < 0 {
		return errors.New("protein cannot be negative")
	}

	if req.Carbs != nil && *req.Carbs < 0 {
		return errors.New("carbs cannot be negative")
	}

	if req.Fat != nil && *req.Fat < 0 {
		return errors.New("fat cannot be negative")
	}

	if req.Description != nil && len(*req.Description) > 1000 {
		return errors.New("description must be 1000 characters or less")
	}

	if req.Allergens != nil && len(*req.Allergens) > 500 {
		return errors.New("allergens must be 500 characters or less")
	}

	return nil
}
