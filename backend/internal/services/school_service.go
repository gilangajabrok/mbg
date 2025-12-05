package services

import (
	"context"
	"errors"
	"fmt"
	"mbg-backend/internal/models"
	"strings"
)

// SchoolService handles business logic for schools
type SchoolService struct {
	repo models.SchoolRepository
}

// NewSchoolService creates a new school service
func NewSchoolService(repo models.SchoolRepository) *SchoolService {
	return &SchoolService{repo: repo}
}

// Create validates and creates a new school
func (s *SchoolService) Create(ctx context.Context, req *models.SchoolCreateRequest) (*models.School, error) {
	if err := s.validateCreate(req); err != nil {
		return nil, err
	}

	school := &models.School{
		Name:          strings.TrimSpace(req.Name),
		Email:         strings.ToLower(strings.TrimSpace(req.Email)),
		Phone:         strings.TrimSpace(req.Phone),
		Address:       strings.TrimSpace(req.Address),
		Principal:     strings.TrimSpace(req.Principal),
		StudentsCount: 0,
	}

	if err := school.BeforeCreate(nil); err != nil {
		return nil, err
	}

	if err := s.repo.Create(ctx, school); err != nil {
		return nil, fmt.Errorf("failed to create school: %w", err)
	}

	return school, nil
}

// GetByID retrieves a school by ID
func (s *SchoolService) GetByID(ctx context.Context, id string) (*models.School, error) {
	if id == "" {
		return nil, errors.New("school id is required")
	}

	school, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return school, nil
}

// List retrieves all schools
func (s *SchoolService) List(ctx context.Context, limit, offset int) ([]models.School, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	}

	schools, err := s.repo.List(ctx, limit, offset)
	if err != nil {
		return nil, err
	}

	return schools, nil
}

// Update modifies a school
func (s *SchoolService) Update(ctx context.Context, id string, req *models.SchoolUpdateRequest) (*models.School, error) {
	if id == "" {
		return nil, errors.New("school id is required")
	}

	if err := s.validateUpdate(req); err != nil {
		return nil, err
	}

	if req.Name != "" {
		req.Name = strings.TrimSpace(req.Name)
	}
	if req.Email != "" {
		req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	}
	if req.Phone != "" {
		req.Phone = strings.TrimSpace(req.Phone)
	}
	if req.Address != "" {
		req.Address = strings.TrimSpace(req.Address)
	}
	if req.Principal != "" {
		req.Principal = strings.TrimSpace(req.Principal)
	}

	school, err := s.repo.Update(ctx, id, req)
	if err != nil {
		return nil, err
	}

	return school, nil
}

// Delete soft-deletes a school
func (s *SchoolService) Delete(ctx context.Context, id string) error {
	if id == "" {
		return errors.New("school id is required")
	}

	return s.repo.Delete(ctx, id)
}

func (s *SchoolService) validateCreate(req *models.SchoolCreateRequest) error {
	if req == nil {
		return errors.New("request is required")
	}

	name := strings.TrimSpace(req.Name)
	if name == "" {
		return errors.New("school name is required")
	}
	if len(name) > 255 {
		return errors.New("school name must be 255 characters or less")
	}

	email := strings.TrimSpace(req.Email)
	if email == "" {
		return errors.New("school email is required")
	}
	if !isValidEmail(email) {
		return errors.New("invalid email format")
	}

	if req.Phone != "" && len(req.Phone) > 20 {
		return errors.New("phone must be 20 characters or less")
	}

	if req.Address != "" && len(req.Address) > 500 {
		return errors.New("address must be 500 characters or less")
	}

	if req.Principal != "" && len(req.Principal) > 255 {
		return errors.New("principal must be 255 characters or less")
	}

	return nil
}

func (s *SchoolService) validateUpdate(req *models.SchoolUpdateRequest) error {
	if req == nil {
		return errors.New("request is required")
	}

	if req.Name != "" && len(req.Name) > 255 {
		return errors.New("school name must be 255 characters or less")
	}

	if req.Email != "" && !isValidEmail(req.Email) {
		return errors.New("invalid email format")
	}

	if req.Phone != "" && len(req.Phone) > 20 {
		return errors.New("phone must be 20 characters or less")
	}

	if req.Address != "" && len(req.Address) > 500 {
		return errors.New("address must be 500 characters or less")
	}

	if req.Principal != "" && len(req.Principal) > 255 {
		return errors.New("principal must be 255 characters or less")
	}

	return nil
}

func isValidEmail(email string) bool {
	email = strings.TrimSpace(email)
	return strings.Contains(email, "@") && strings.Contains(email, ".") && len(email) > 5
}
