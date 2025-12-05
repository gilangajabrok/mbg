package services

import (
	"context"
	"errors"
	"fmt"
	"mbg-backend/internal/models"
	"strings"
)

// SupplierService handles business logic for suppliers
type SupplierService struct {
	repo models.SupplierRepository
}

// NewSupplierService creates a new supplier service
func NewSupplierService(repo models.SupplierRepository) *SupplierService {
	return &SupplierService{repo: repo}
}

// Create validates and creates a new supplier
func (s *SupplierService) Create(ctx context.Context, req *models.SupplierCreateRequest) (*models.Supplier, error) {
	if err := s.validateCreate(req); err != nil {
		return nil, err
	}

	supplier := &models.Supplier{
		Name:          strings.TrimSpace(req.Name),
		Email:         strings.ToLower(strings.TrimSpace(req.Email)),
		Phone:         strings.TrimSpace(req.Phone),
		Address:       strings.TrimSpace(req.Address),
		ContactPerson: strings.TrimSpace(req.ContactPerson),
		UserID:        req.UserID,
		Rating:        0,
		IsActive:      true,
	}

	if err := supplier.BeforeCreate(nil); err != nil {
		return nil, err
	}

	if err := s.repo.Create(ctx, supplier); err != nil {
		return nil, fmt.Errorf("failed to create supplier: %w", err)
	}

	return supplier, nil
}

// GetByID retrieves a supplier by ID
func (s *SupplierService) GetByID(ctx context.Context, id string) (*models.Supplier, error) {
	if id == "" {
		return nil, errors.New("supplier id is required")
	}

	supplier, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return supplier, nil
}

// GetByEmail retrieves a supplier by email
func (s *SupplierService) GetByEmail(ctx context.Context, email string) (*models.Supplier, error) {
	if email == "" {
		return nil, errors.New("email is required")
	}

	supplier, err := s.repo.GetByEmail(ctx, strings.ToLower(email))
	if err != nil {
		return nil, err
	}

	return supplier, nil
}

// List retrieves all suppliers
func (s *SupplierService) List(ctx context.Context, limit, offset int) ([]models.Supplier, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	}

	suppliers, err := s.repo.List(ctx, limit, offset)
	if err != nil {
		return nil, err
	}

	return suppliers, nil
}

// Update modifies a supplier
func (s *SupplierService) Update(ctx context.Context, id string, req *models.SupplierUpdateRequest) (*models.Supplier, error) {
	if id == "" {
		return nil, errors.New("supplier id is required")
	}

	if err := s.validateUpdate(req); err != nil {
		return nil, err
	}

	supplier, err := s.repo.Update(ctx, id, req)
	if err != nil {
		return nil, err
	}

	return supplier, nil
}

// Delete removes a supplier
func (s *SupplierService) Delete(ctx context.Context, id string) error {
	if id == "" {
		return errors.New("supplier id is required")
	}

	return s.repo.Delete(ctx, id)
}

func (s *SupplierService) validateCreate(req *models.SupplierCreateRequest) error {
	if req == nil {
		return errors.New("request is required")
	}

	if req.Name == "" {
		return errors.New("name is required")
	}

	if len(req.Name) > 255 {
		return errors.New("name must be 255 characters or less")
	}

	if req.Email == "" {
		return errors.New("email is required")
	}

	if !isValidEmail(req.Email) {
		return errors.New("invalid email format")
	}

	if req.UserID == "" {
		return errors.New("user id is required")
	}

	if req.Phone != "" && len(req.Phone) > 20 {
		return errors.New("phone must be 20 characters or less")
	}

	if req.Address != "" && len(req.Address) > 500 {
		return errors.New("address must be 500 characters or less")
	}

	if req.ContactPerson != "" && len(req.ContactPerson) > 255 {
		return errors.New("contact person must be 255 characters or less")
	}

	return nil
}

func (s *SupplierService) validateUpdate(req *models.SupplierUpdateRequest) error {
	if req == nil {
		return errors.New("request is required")
	}

	if req.Name != nil && *req.Name == "" {
		return errors.New("name cannot be empty")
	}

	if req.Name != nil && len(*req.Name) > 255 {
		return errors.New("name must be 255 characters or less")
	}

	if req.Email != nil && *req.Email == "" {
		return errors.New("email cannot be empty")
	}

	if req.Email != nil && !isValidEmail(*req.Email) {
		return errors.New("invalid email format")
	}

	if req.Phone != nil && len(*req.Phone) > 20 {
		return errors.New("phone must be 20 characters or less")
	}

	if req.Address != nil && len(*req.Address) > 500 {
		return errors.New("address must be 500 characters or less")
	}

	if req.ContactPerson != nil && len(*req.ContactPerson) > 255 {
		return errors.New("contact person must be 255 characters or less")
	}

	if req.Rating != nil && (*req.Rating < 0 || *req.Rating > 5) {
		return errors.New("rating must be between 0 and 5")
	}

	return nil
}

