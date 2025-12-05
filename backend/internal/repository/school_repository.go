package repository

import (
	"context"
	"fmt"

	"mbg-backend/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// SchoolRepository handles database operations for schools
type SchoolRepository struct {
	pool *pgxpool.Pool
}

// NewSchoolRepository creates a new school repository
func NewSchoolRepository(pool *pgxpool.Pool) *SchoolRepository {
	return &SchoolRepository{pool: pool}
}

// Create inserts a new school
func (r *SchoolRepository) Create(ctx context.Context, school *models.School) error {
	query := `
		INSERT INTO schools (id, name, email, phone, address, principal, students_count, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`

	err := r.pool.QueryRow(ctx, query,
		school.ID,
		school.Name,
		school.Email,
		school.Phone,
		school.Address,
		school.Principal,
		school.StudentsCount,
	).Scan(&school.ID, &school.CreatedAt, &school.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create school: %w", err)
	}
	return nil
}

// GetByID retrieves a school by ID
func (r *SchoolRepository) GetByID(ctx context.Context, id string) (*models.School, error) {
	school := &models.School{}
	query := `
		SELECT id, name, email, phone, address, principal, students_count, created_at, updated_at
		FROM schools
		WHERE id = $1 AND deleted_at IS NULL
	`

	err := r.pool.QueryRow(ctx, query, id).Scan(
		&school.ID,
		&school.Name,
		&school.Email,
		&school.Phone,
		&school.Address,
		&school.Principal,
		&school.StudentsCount,
		&school.CreatedAt,
		&school.UpdatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to get school: %w", err)
	}
	return school, nil
}

// GetByEmail retrieves a school by email
func (r *SchoolRepository) GetByEmail(ctx context.Context, email string) (*models.School, error) {
	school := &models.School{}
	query := `
		SELECT id, name, email, phone, address, principal, students_count, created_at, updated_at
		FROM schools
		WHERE email = $1 AND deleted_at IS NULL
	`

	err := r.pool.QueryRow(ctx, query, email).Scan(
		&school.ID,
		&school.Name,
		&school.Email,
		&school.Phone,
		&school.Address,
		&school.Principal,
		&school.StudentsCount,
		&school.CreatedAt,
		&school.UpdatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to get school: %w", err)
	}
	return school, nil
}

// List retrieves all schools with pagination
func (r *SchoolRepository) List(ctx context.Context, limit, offset int) ([]models.School, error) {
	schools := make([]models.School, 0)
	query := `
		SELECT id, name, email, phone, address, principal, students_count, created_at, updated_at
		FROM schools
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := r.pool.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to list schools: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		school := models.School{}
		if err := rows.Scan(
			&school.ID,
			&school.Name,
			&school.Email,
			&school.Phone,
			&school.Address,
			&school.Principal,
			&school.StudentsCount,
			&school.CreatedAt,
			&school.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan school: %w", err)
		}
		schools = append(schools, school)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error listing schools: %w", err)
	}
	return schools, nil
}

// Update modifies a school
func (r *SchoolRepository) Update(ctx context.Context, id string, req *models.SchoolUpdateRequest) (*models.School, error) {
	school := &models.School{}
	query := `
		UPDATE schools
		SET 
			name = COALESCE(NULLIF($1, ''), name),
			email = COALESCE(NULLIF($2, ''), email),
			phone = COALESCE(NULLIF($3, ''), phone),
			address = COALESCE(NULLIF($4, ''), address),
			principal = COALESCE(NULLIF($5, ''), principal),
			updated_at = NOW()
		WHERE id = $6 AND deleted_at IS NULL
		RETURNING id, name, email, phone, address, principal, students_count, created_at, updated_at
	`

	err := r.pool.QueryRow(ctx, query,
		req.Name,
		req.Email,
		req.Phone,
		req.Address,
		req.Principal,
		id,
	).Scan(
		&school.ID,
		&school.Name,
		&school.Email,
		&school.Phone,
		&school.Address,
		&school.Principal,
		&school.StudentsCount,
		&school.CreatedAt,
		&school.UpdatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to update school: %w", err)
	}
	return school, nil
}

// Delete soft-deletes a school
func (r *SchoolRepository) Delete(ctx context.Context, id string) error {
	query := `
		UPDATE schools
		SET deleted_at = NOW()
		WHERE id = $1 AND deleted_at IS NULL
	`

	result, err := r.pool.Exec(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete school: %w", err)
	}

	if result.RowsAffected() == 0 {
		return models.ErrNotFound
	}
	return nil
}
