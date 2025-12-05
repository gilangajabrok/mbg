package repository

import (
	"context"
	"errors"
	"fmt"
	"mbg-backend/internal/models"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// SupplierRepository handles supplier data operations
type SupplierRepository struct {
	pool *pgxpool.Pool
}

// NewSupplierRepository creates a new supplier repository
func NewSupplierRepository(pool *pgxpool.Pool) *SupplierRepository {
	return &SupplierRepository{pool: pool}
}

// Create inserts a new supplier
func (r *SupplierRepository) Create(ctx context.Context, supplier *models.Supplier) error {
	if supplier.ID == "" {
		supplier.ID = uuid.New().String()
	}
	if supplier.CreatedAt.IsZero() {
		supplier.CreatedAt = time.Now()
	}
	if supplier.UpdatedAt.IsZero() {
		supplier.UpdatedAt = time.Now()
	}

	query := `
		INSERT INTO suppliers (id, name, email, phone, address, contact_person, user_id, rating, is_active, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id, name, email, phone, address, contact_person, user_id, rating, is_active, created_at, updated_at
	`

	err := r.pool.QueryRow(ctx, query,
		supplier.ID,
		supplier.Name,
		supplier.Email,
		supplier.Phone,
		supplier.Address,
		supplier.ContactPerson,
		supplier.UserID,
		supplier.Rating,
		supplier.IsActive,
		supplier.CreatedAt,
		supplier.UpdatedAt,
	).Scan(
		&supplier.ID,
		&supplier.Name,
		&supplier.Email,
		&supplier.Phone,
		&supplier.Address,
		&supplier.ContactPerson,
		&supplier.UserID,
		&supplier.Rating,
		&supplier.IsActive,
		&supplier.CreatedAt,
		&supplier.UpdatedAt,
	)

	if err != nil {
		if err.Error() == "duplicate key" || errors.Is(err, pgx.ErrNoRows) {
			return models.ErrDuplicate
		}
		return fmt.Errorf("failed to create supplier: %w", err)
	}

	return nil
}

// GetByID retrieves a supplier by ID
func (r *SupplierRepository) GetByID(ctx context.Context, id string) (*models.Supplier, error) {
	query := `
		SELECT id, name, email, phone, address, contact_person, user_id, rating, is_active, created_at, updated_at, deleted_at
		FROM suppliers
		WHERE id = $1 AND deleted_at IS NULL
	`

	supplier := &models.Supplier{}
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&supplier.ID,
		&supplier.Name,
		&supplier.Email,
		&supplier.Phone,
		&supplier.Address,
		&supplier.ContactPerson,
		&supplier.UserID,
		&supplier.Rating,
		&supplier.IsActive,
		&supplier.CreatedAt,
		&supplier.UpdatedAt,
		&supplier.DeletedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to get supplier: %w", err)
	}

	return supplier, nil
}

// GetByEmail retrieves a supplier by email
func (r *SupplierRepository) GetByEmail(ctx context.Context, email string) (*models.Supplier, error) {
	query := `
		SELECT id, name, email, phone, address, contact_person, user_id, rating, is_active, created_at, updated_at, deleted_at
		FROM suppliers
		WHERE email = $1 AND deleted_at IS NULL
	`

	supplier := &models.Supplier{}
	err := r.pool.QueryRow(ctx, query, email).Scan(
		&supplier.ID,
		&supplier.Name,
		&supplier.Email,
		&supplier.Phone,
		&supplier.Address,
		&supplier.ContactPerson,
		&supplier.UserID,
		&supplier.Rating,
		&supplier.IsActive,
		&supplier.CreatedAt,
		&supplier.UpdatedAt,
		&supplier.DeletedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to get supplier: %w", err)
	}

	return supplier, nil
}

// List retrieves all suppliers
func (r *SupplierRepository) List(ctx context.Context, limit, offset int) ([]models.Supplier, error) {
	query := `
		SELECT id, name, email, phone, address, contact_person, user_id, rating, is_active, created_at, updated_at, deleted_at
		FROM suppliers
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := r.pool.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query suppliers: %w", err)
	}
	defer rows.Close()

	var suppliers []models.Supplier
	for rows.Next() {
		supplier := models.Supplier{}
		err := rows.Scan(
			&supplier.ID,
			&supplier.Name,
			&supplier.Email,
			&supplier.Phone,
			&supplier.Address,
			&supplier.ContactPerson,
			&supplier.UserID,
			&supplier.Rating,
			&supplier.IsActive,
			&supplier.CreatedAt,
			&supplier.UpdatedAt,
			&supplier.DeletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan supplier: %w", err)
		}
		suppliers = append(suppliers, supplier)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating suppliers: %w", err)
	}

	return suppliers, nil
}

// Update modifies a supplier
func (r *SupplierRepository) Update(ctx context.Context, id string, req *models.SupplierUpdateRequest) (*models.Supplier, error) {
	query := `
		UPDATE suppliers
		SET
			name = COALESCE(NULLIF($2, ''), name),
			email = COALESCE(NULLIF($3, ''), email),
			phone = COALESCE(NULLIF($4, ''), phone),
			address = COALESCE(NULLIF($5, ''), address),
			contact_person = COALESCE(NULLIF($6, ''), contact_person),
			rating = CASE WHEN $7::numeric IS NOT NULL THEN $7 ELSE rating END,
			is_active = CASE WHEN $8::boolean IS NOT NULL THEN $8 ELSE is_active END,
			updated_at = NOW()
		WHERE id = $1 AND deleted_at IS NULL
		RETURNING id, name, email, phone, address, contact_person, user_id, rating, is_active, created_at, updated_at
	`

	supplier := &models.Supplier{}

	name := ""
	if req.Name != nil {
		name = *req.Name
	}

	email := ""
	if req.Email != nil {
		email = *req.Email
	}

	phone := ""
	if req.Phone != nil {
		phone = *req.Phone
	}

	address := ""
	if req.Address != nil {
		address = *req.Address
	}

	contactPerson := ""
	if req.ContactPerson != nil {
		contactPerson = *req.ContactPerson
	}

	err := r.pool.QueryRow(ctx, query, id, name, email, phone, address, contactPerson, req.Rating, req.IsActive).Scan(
		&supplier.ID,
		&supplier.Name,
		&supplier.Email,
		&supplier.Phone,
		&supplier.Address,
		&supplier.ContactPerson,
		&supplier.UserID,
		&supplier.Rating,
		&supplier.IsActive,
		&supplier.CreatedAt,
		&supplier.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to update supplier: %w", err)
	}

	return supplier, nil
}

// Delete soft deletes a supplier
func (r *SupplierRepository) Delete(ctx context.Context, id string) error {
	query := `
		UPDATE suppliers
		SET deleted_at = $1
		WHERE id = $2 AND deleted_at IS NULL
	`

	result, err := r.pool.Exec(ctx, query, time.Now(), id)
	if err != nil {
		return fmt.Errorf("failed to delete supplier: %w", err)
	}

	if result.RowsAffected() == 0 {
		return models.ErrNotFound
	}

	return nil
}
