package services

import (
	"context"
	"errors"
	"fmt"
	"mbg-backend/internal/models"
	"strings"
	"time"
)

// OrderService handles business logic for orders
type OrderService struct {
	repo models.OrderRepository
}

// NewOrderService creates a new order service
func NewOrderService(repo models.OrderRepository) *OrderService {
	return &OrderService{repo: repo}
}

// Create validates and creates a new order
func (s *OrderService) Create(ctx context.Context, req *models.OrderCreateRequest) (*models.Order, error) {
	if err := s.validateCreate(req); err != nil {
		return nil, err
	}

	order := &models.Order{
		SupplierID:  req.SupplierID,
		SchoolID:    req.SchoolID,
		Status:      "pending",
		TotalAmount: req.TotalAmount,
		OrderDate:   time.Now(),
		Notes:       strings.TrimSpace(req.Notes),
	}

	if req.DeliveryDate != nil {
		order.DeliveryDate = req.DeliveryDate
	}

	if err := order.BeforeCreate(nil); err != nil {
		return nil, err
	}

	if err := s.repo.Create(ctx, order); err != nil {
		return nil, fmt.Errorf("failed to create order: %w", err)
	}

	return order, nil
}

// GetByID retrieves an order by ID
func (s *OrderService) GetByID(ctx context.Context, id string) (*models.Order, error) {
	if id == "" {
		return nil, errors.New("order id is required")
	}

	order, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return order, nil
}

// GetBySupplier retrieves orders for a supplier
func (s *OrderService) GetBySupplier(ctx context.Context, supplierID string, limit, offset int) ([]models.Order, error) {
	if supplierID == "" {
		return nil, errors.New("supplier id is required")
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

	orders, err := s.repo.GetBySupplier(ctx, supplierID, limit, offset)
	if err != nil {
		return nil, err
	}

	return orders, nil
}

// GetBySchool retrieves orders for a school
func (s *OrderService) GetBySchool(ctx context.Context, schoolID string, limit, offset int) ([]models.Order, error) {
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

	orders, err := s.repo.GetBySchool(ctx, schoolID, limit, offset)
	if err != nil {
		return nil, err
	}

	return orders, nil
}

// GetByStatus retrieves orders with a specific status
func (s *OrderService) GetByStatus(ctx context.Context, status string, limit, offset int) ([]models.Order, error) {
	if status == "" {
		return nil, errors.New("status is required")
	}

	validStatuses := []string{"pending", "confirmed", "delivered", "cancelled"}
	isValid := false
	for _, valid := range validStatuses {
		if status == valid {
			isValid = true
			break
		}
	}
	if !isValid {
		return nil, errors.New("invalid status: must be pending, confirmed, delivered, or cancelled")
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

	orders, err := s.repo.GetByStatus(ctx, status, limit, offset)
	if err != nil {
		return nil, err
	}

	return orders, nil
}

// List retrieves all orders
func (s *OrderService) List(ctx context.Context, limit, offset int) ([]models.Order, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	}

	orders, err := s.repo.List(ctx, limit, offset)
	if err != nil {
		return nil, err
	}

	return orders, nil
}

// UpdateStatus updates order status
func (s *OrderService) UpdateStatus(ctx context.Context, id, status string) (*models.Order, error) {
	if id == "" {
		return nil, errors.New("order id is required")
	}

	if status == "" {
		return nil, errors.New("status is required")
	}

	validStatuses := []string{"pending", "confirmed", "delivered", "cancelled"}
	isValid := false
	for _, valid := range validStatuses {
		if status == valid {
			isValid = true
			break
		}
	}
	if !isValid {
		return nil, errors.New("invalid status: must be pending, confirmed, delivered, or cancelled")
	}

	order, err := s.repo.UpdateStatus(ctx, id, status)
	if err != nil {
		return nil, err
	}

	return order, nil
}

// Update modifies an order
func (s *OrderService) Update(ctx context.Context, id string, req *models.OrderUpdateRequest) (*models.Order, error) {
	if id == "" {
		return nil, errors.New("order id is required")
	}

	if err := s.validateUpdate(req); err != nil {
		return nil, err
	}

	order, err := s.repo.Update(ctx, id, req)
	if err != nil {
		return nil, err
	}

	return order, nil
}

// Delete removes an order
func (s *OrderService) Delete(ctx context.Context, id string) error {
	if id == "" {
		return errors.New("order id is required")
	}

	return s.repo.Delete(ctx, id)
}

func (s *OrderService) validateCreate(req *models.OrderCreateRequest) error {
	if req == nil {
		return errors.New("request is required")
	}

	if req.SupplierID == "" {
		return errors.New("supplier id is required")
	}

	if req.SchoolID == "" {
		return errors.New("school id is required")
	}

	if req.TotalAmount <= 0 {
		return errors.New("total amount must be greater than 0")
	}

	if req.TotalAmount > 999999.99 {
		return errors.New("total amount is too large")
	}

	return nil
}

func (s *OrderService) validateUpdate(req *models.OrderUpdateRequest) error {
	if req == nil {
		return errors.New("request is required")
	}

	if req.TotalAmount != nil && *req.TotalAmount <= 0 {
		return errors.New("total amount must be greater than 0")
	}

	if req.TotalAmount != nil && *req.TotalAmount > 999999.99 {
		return errors.New("total amount is too large")
	}

	if req.Notes != nil && len(*req.Notes) > 1000 {
		return errors.New("notes must be 1000 characters or less")
	}

	return nil
}
