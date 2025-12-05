package repository

import (
	"context"
	"errors"
	"fmt"
	"mbg-backend/internal/models"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// OrderRepository handles order data operations
type OrderRepository struct {
	pool *pgxpool.Pool
}

// NewOrderRepository creates a new order repository
func NewOrderRepository(pool *pgxpool.Pool) *OrderRepository {
	return &OrderRepository{pool: pool}
}

// Create inserts a new order
func (r *OrderRepository) Create(ctx context.Context, order *models.Order) error {
	query := `
		INSERT INTO orders (id, supplier_id, school_id, status, total_amount, order_date, delivery_date, notes, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, supplier_id, school_id, status, total_amount, order_date, delivery_date, notes, created_at, updated_at
	`

	err := r.pool.QueryRow(ctx, query,
		order.ID,
		order.SupplierID,
		order.SchoolID,
		order.Status,
		order.TotalAmount,
		order.OrderDate,
		order.DeliveryDate,
		order.Notes,
		order.CreatedAt,
		order.UpdatedAt,
	).Scan(
		&order.ID,
		&order.SupplierID,
		&order.SchoolID,
		&order.Status,
		&order.TotalAmount,
		&order.OrderDate,
		&order.DeliveryDate,
		&order.Notes,
		&order.CreatedAt,
		&order.UpdatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create order: %w", err)
	}

	return nil
}

// GetByID retrieves an order by ID
func (r *OrderRepository) GetByID(ctx context.Context, id string) (*models.Order, error) {
	query := `
		SELECT id, supplier_id, school_id, status, total_amount, order_date, delivery_date, notes, created_at, updated_at, deleted_at
		FROM orders
		WHERE id = $1 AND deleted_at IS NULL
	`

	order := &models.Order{}
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&order.ID,
		&order.SupplierID,
		&order.SchoolID,
		&order.Status,
		&order.TotalAmount,
		&order.OrderDate,
		&order.DeliveryDate,
		&order.Notes,
		&order.CreatedAt,
		&order.UpdatedAt,
		&order.DeletedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to get order: %w", err)
	}

	return order, nil
}

// GetBySupplier retrieves orders for a supplier
func (r *OrderRepository) GetBySupplier(ctx context.Context, supplierID string, limit, offset int) ([]models.Order, error) {
	query := `
		SELECT id, supplier_id, school_id, status, total_amount, order_date, delivery_date, notes, created_at, updated_at, deleted_at
		FROM orders
		WHERE supplier_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.pool.Query(ctx, query, supplierID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query orders: %w", err)
	}
	defer rows.Close()

	var orders []models.Order
	for rows.Next() {
		order := models.Order{}
		err := rows.Scan(
			&order.ID,
			&order.SupplierID,
			&order.SchoolID,
			&order.Status,
			&order.TotalAmount,
			&order.OrderDate,
			&order.DeliveryDate,
			&order.Notes,
			&order.CreatedAt,
			&order.UpdatedAt,
			&order.DeletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan order: %w", err)
		}
		orders = append(orders, order)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating orders: %w", err)
	}

	return orders, nil
}

// GetBySchool retrieves orders for a school
func (r *OrderRepository) GetBySchool(ctx context.Context, schoolID string, limit, offset int) ([]models.Order, error) {
	query := `
		SELECT id, supplier_id, school_id, status, total_amount, order_date, delivery_date, notes, created_at, updated_at, deleted_at
		FROM orders
		WHERE school_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.pool.Query(ctx, query, schoolID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query orders: %w", err)
	}
	defer rows.Close()

	var orders []models.Order
	for rows.Next() {
		order := models.Order{}
		err := rows.Scan(
			&order.ID,
			&order.SupplierID,
			&order.SchoolID,
			&order.Status,
			&order.TotalAmount,
			&order.OrderDate,
			&order.DeliveryDate,
			&order.Notes,
			&order.CreatedAt,
			&order.UpdatedAt,
			&order.DeletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan order: %w", err)
		}
		orders = append(orders, order)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating orders: %w", err)
	}

	return orders, nil
}

// GetByStatus retrieves orders with a specific status
func (r *OrderRepository) GetByStatus(ctx context.Context, status string, limit, offset int) ([]models.Order, error) {
	query := `
		SELECT id, supplier_id, school_id, status, total_amount, order_date, delivery_date, notes, created_at, updated_at, deleted_at
		FROM orders
		WHERE status = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.pool.Query(ctx, query, status, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query orders: %w", err)
	}
	defer rows.Close()

	var orders []models.Order
	for rows.Next() {
		order := models.Order{}
		err := rows.Scan(
			&order.ID,
			&order.SupplierID,
			&order.SchoolID,
			&order.Status,
			&order.TotalAmount,
			&order.OrderDate,
			&order.DeliveryDate,
			&order.Notes,
			&order.CreatedAt,
			&order.UpdatedAt,
			&order.DeletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan order: %w", err)
		}
		orders = append(orders, order)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating orders: %w", err)
	}

	return orders, nil
}

// List retrieves all orders
func (r *OrderRepository) List(ctx context.Context, limit, offset int) ([]models.Order, error) {
	query := `
		SELECT id, supplier_id, school_id, status, total_amount, order_date, delivery_date, notes, created_at, updated_at, deleted_at
		FROM orders
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := r.pool.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query orders: %w", err)
	}
	defer rows.Close()

	var orders []models.Order
	for rows.Next() {
		order := models.Order{}
		err := rows.Scan(
			&order.ID,
			&order.SupplierID,
			&order.SchoolID,
			&order.Status,
			&order.TotalAmount,
			&order.OrderDate,
			&order.DeliveryDate,
			&order.Notes,
			&order.CreatedAt,
			&order.UpdatedAt,
			&order.DeletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan order: %w", err)
		}
		orders = append(orders, order)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating orders: %w", err)
	}

	return orders, nil
}

// UpdateStatus updates the status of an order
func (r *OrderRepository) UpdateStatus(ctx context.Context, id, status string) (*models.Order, error) {
	query := `
		UPDATE orders
		SET status = $2, updated_at = NOW()
		WHERE id = $1 AND deleted_at IS NULL
		RETURNING id, supplier_id, school_id, status, total_amount, order_date, delivery_date, notes, created_at, updated_at
	`

	order := &models.Order{}
	err := r.pool.QueryRow(ctx, query, id, status).Scan(
		&order.ID,
		&order.SupplierID,
		&order.SchoolID,
		&order.Status,
		&order.TotalAmount,
		&order.OrderDate,
		&order.DeliveryDate,
		&order.Notes,
		&order.CreatedAt,
		&order.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to update order status: %w", err)
	}

	return order, nil
}

// Update modifies an order
func (r *OrderRepository) Update(ctx context.Context, id string, req *models.OrderUpdateRequest) (*models.Order, error) {
	query := `
		UPDATE orders
		SET
			total_amount = COALESCE(NULLIF($2::decimal, 0), total_amount),
			delivery_date = CASE
				WHEN $3::timestamp IS NOT NULL THEN $3
				ELSE delivery_date
			END,
			notes = COALESCE(NULLIF($4, ''), notes),
			updated_at = NOW()
		WHERE id = $1 AND deleted_at IS NULL
		RETURNING id, supplier_id, school_id, status, total_amount, order_date, delivery_date, notes, created_at, updated_at
	`

	order := &models.Order{}
	totalAmount := float64(0)
	if req.TotalAmount != nil {
		totalAmount = *req.TotalAmount
	}

	err := r.pool.QueryRow(ctx, query, id, totalAmount, req.DeliveryDate, req.Notes).Scan(
		&order.ID,
		&order.SupplierID,
		&order.SchoolID,
		&order.Status,
		&order.TotalAmount,
		&order.OrderDate,
		&order.DeliveryDate,
		&order.Notes,
		&order.CreatedAt,
		&order.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to update order: %w", err)
	}

	return order, nil
}

// Delete soft deletes an order
func (r *OrderRepository) Delete(ctx context.Context, id string) error {
	query := `
		UPDATE orders
		SET deleted_at = $1
		WHERE id = $2 AND deleted_at IS NULL
	`

	result, err := r.pool.Exec(ctx, query, time.Now(), id)
	if err != nil {
		return fmt.Errorf("failed to delete order: %w", err)
	}

	if result.RowsAffected() == 0 {
		return models.ErrNotFound
	}

	return nil
}
