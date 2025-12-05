package services

import (
	"context"
	"errors"
	"fmt"
	"mbg-backend/internal/models"
	"strings"
	"time"
)

// StudentService handles business logic for students
type StudentService struct {
	repo models.StudentRepository
}

// NewStudentService creates a new student service
func NewStudentService(repo models.StudentRepository) *StudentService {
	return &StudentService{repo: repo}
}

// Create validates and creates a new student
func (s *StudentService) Create(ctx context.Context, req *models.StudentCreateRequest) (*models.Student, error) {
	if err := s.validateCreate(req); err != nil {
		return nil, err
	}

	student := &models.Student{
		FirstName:    strings.TrimSpace(req.FirstName),
		LastName:     strings.TrimSpace(req.LastName),
		SchoolID:     req.SchoolID,
		ParentID:     req.ParentID,
		DateOfBirth:  req.DateOfBirth,
		Grade:        strings.TrimSpace(req.Grade),
		Allergies:    strings.TrimSpace(req.Allergies),
		DietaryNeeds: strings.TrimSpace(req.DietaryNeeds),
	}

	if err := student.BeforeCreate(nil); err != nil {
		return nil, err
	}

	if err := s.repo.Create(ctx, student); err != nil {
		return nil, fmt.Errorf("failed to create student: %w", err)
	}

	return student, nil
}

// GetByID retrieves a student by ID
func (s *StudentService) GetByID(ctx context.Context, id string) (*models.Student, error) {
	if id == "" {
		return nil, errors.New("student id is required")
	}

	student, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return student, nil
}

// GetBySchool retrieves students for a school
func (s *StudentService) GetBySchool(ctx context.Context, schoolID string, limit, offset int) ([]models.Student, error) {
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

	students, err := s.repo.GetBySchool(ctx, schoolID, limit, offset)
	if err != nil {
		return nil, err
	}

	return students, nil
}

// GetByParent retrieves students for a parent
func (s *StudentService) GetByParent(ctx context.Context, parentID string, limit, offset int) ([]models.Student, error) {
	if parentID == "" {
		return nil, errors.New("parent id is required")
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

	students, err := s.repo.GetByParent(ctx, parentID, limit, offset)
	if err != nil {
		return nil, err
	}

	return students, nil
}

// List retrieves all students
func (s *StudentService) List(ctx context.Context, limit, offset int) ([]models.Student, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	}

	students, err := s.repo.List(ctx, limit, offset)
	if err != nil {
		return nil, err
	}

	return students, nil
}

// Update modifies a student
func (s *StudentService) Update(ctx context.Context, id string, req *models.StudentUpdateRequest) (*models.Student, error) {
	if id == "" {
		return nil, errors.New("student id is required")
	}

	if err := s.validateUpdate(req); err != nil {
		return nil, err
	}

	student, err := s.repo.Update(ctx, id, req)
	if err != nil {
		return nil, err
	}

	return student, nil
}

// Delete removes a student
func (s *StudentService) Delete(ctx context.Context, id string) error {
	if id == "" {
		return errors.New("student id is required")
	}

	return s.repo.Delete(ctx, id)
}

func (s *StudentService) validateCreate(req *models.StudentCreateRequest) error {
	if req == nil {
		return errors.New("request is required")
	}

	if req.FirstName == "" {
		return errors.New("first name is required")
	}

	if len(req.FirstName) > 100 {
		return errors.New("first name must be 100 characters or less")
	}

	if req.LastName == "" {
		return errors.New("last name is required")
	}

	if len(req.LastName) > 100 {
		return errors.New("last name must be 100 characters or less")
	}

	if req.SchoolID == "" {
		return errors.New("school id is required")
	}

	if req.ParentID == "" {
		return errors.New("parent id is required")
	}

	if req.DateOfBirth.IsZero() {
		return errors.New("date of birth is required")
	}

	if req.DateOfBirth.After(time.Now()) {
		return errors.New("date of birth cannot be in the future")
	}

	if req.Grade == "" {
		return errors.New("grade is required")
	}

	if len(req.Grade) > 50 {
		return errors.New("grade must be 50 characters or less")
	}

	if len(req.Allergies) > 500 {
		return errors.New("allergies must be 500 characters or less")
	}

	if len(req.DietaryNeeds) > 500 {
		return errors.New("dietary needs must be 500 characters or less")
	}

	return nil
}

func (s *StudentService) validateUpdate(req *models.StudentUpdateRequest) error {
	if req == nil {
		return errors.New("request is required")
	}

	if req.FirstName != nil && *req.FirstName == "" {
		return errors.New("first name cannot be empty")
	}

	if req.FirstName != nil && len(*req.FirstName) > 100 {
		return errors.New("first name must be 100 characters or less")
	}

	if req.LastName != nil && *req.LastName == "" {
		return errors.New("last name cannot be empty")
	}

	if req.LastName != nil && len(*req.LastName) > 100 {
		return errors.New("last name must be 100 characters or less")
	}

	if req.Grade != nil && *req.Grade == "" {
		return errors.New("grade cannot be empty")
	}

	if req.Grade != nil && len(*req.Grade) > 50 {
		return errors.New("grade must be 50 characters or less")
	}

	if req.Allergies != nil && len(*req.Allergies) > 500 {
		return errors.New("allergies must be 500 characters or less")
	}

	if req.DietaryNeeds != nil && len(*req.DietaryNeeds) > 500 {
		return errors.New("dietary needs must be 500 characters or less")
	}

	return nil
}
