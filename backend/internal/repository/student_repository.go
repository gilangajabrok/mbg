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

// StudentRepository handles student data operations
type StudentRepository struct {
	pool *pgxpool.Pool
}

// NewStudentRepository creates a new student repository
func NewStudentRepository(pool *pgxpool.Pool) *StudentRepository {
	return &StudentRepository{pool: pool}
}

// Create inserts a new student
func (r *StudentRepository) Create(ctx context.Context, student *models.Student) error {
	if student.ID == "" {
		student.ID = uuid.New().String()
	}
	if student.CreatedAt.IsZero() {
		student.CreatedAt = time.Now()
	}
	if student.UpdatedAt.IsZero() {
		student.UpdatedAt = time.Now()
	}

	query := `
		INSERT INTO students (id, first_name, last_name, school_id, parent_id, date_of_birth, grade, allergies, dietary_needs, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id, first_name, last_name, school_id, parent_id, date_of_birth, grade, allergies, dietary_needs, created_at, updated_at
	`

	err := r.pool.QueryRow(ctx, query,
		student.ID,
		student.FirstName,
		student.LastName,
		student.SchoolID,
		student.ParentID,
		student.DateOfBirth,
		student.Grade,
		student.Allergies,
		student.DietaryNeeds,
		student.CreatedAt,
		student.UpdatedAt,
	).Scan(
		&student.ID,
		&student.FirstName,
		&student.LastName,
		&student.SchoolID,
		&student.ParentID,
		&student.DateOfBirth,
		&student.Grade,
		&student.Allergies,
		&student.DietaryNeeds,
		&student.CreatedAt,
		&student.UpdatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create student: %w", err)
	}

	return nil
}

// GetByID retrieves a student by ID
func (r *StudentRepository) GetByID(ctx context.Context, id string) (*models.Student, error) {
	query := `
		SELECT id, first_name, last_name, school_id, parent_id, date_of_birth, grade, allergies, dietary_needs, created_at, updated_at, deleted_at
		FROM students
		WHERE id = $1 AND deleted_at IS NULL
	`

	student := &models.Student{}
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&student.ID,
		&student.FirstName,
		&student.LastName,
		&student.SchoolID,
		&student.ParentID,
		&student.DateOfBirth,
		&student.Grade,
		&student.Allergies,
		&student.DietaryNeeds,
		&student.CreatedAt,
		&student.UpdatedAt,
		&student.DeletedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to get student: %w", err)
	}

	return student, nil
}

// GetBySchool retrieves students for a school
func (r *StudentRepository) GetBySchool(ctx context.Context, schoolID string, limit, offset int) ([]models.Student, error) {
	query := `
		SELECT id, first_name, last_name, school_id, parent_id, date_of_birth, grade, allergies, dietary_needs, created_at, updated_at, deleted_at
		FROM students
		WHERE school_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.pool.Query(ctx, query, schoolID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query students: %w", err)
	}
	defer rows.Close()

	var students []models.Student
	for rows.Next() {
		student := models.Student{}
		err := rows.Scan(
			&student.ID,
			&student.FirstName,
			&student.LastName,
			&student.SchoolID,
			&student.ParentID,
			&student.DateOfBirth,
			&student.Grade,
			&student.Allergies,
			&student.DietaryNeeds,
			&student.CreatedAt,
			&student.UpdatedAt,
			&student.DeletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan student: %w", err)
		}
		students = append(students, student)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating students: %w", err)
	}

	return students, nil
}

// GetByParent retrieves students for a parent
func (r *StudentRepository) GetByParent(ctx context.Context, parentID string, limit, offset int) ([]models.Student, error) {
	query := `
		SELECT id, first_name, last_name, school_id, parent_id, date_of_birth, grade, allergies, dietary_needs, created_at, updated_at, deleted_at
		FROM students
		WHERE parent_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.pool.Query(ctx, query, parentID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query students: %w", err)
	}
	defer rows.Close()

	var students []models.Student
	for rows.Next() {
		student := models.Student{}
		err := rows.Scan(
			&student.ID,
			&student.FirstName,
			&student.LastName,
			&student.SchoolID,
			&student.ParentID,
			&student.DateOfBirth,
			&student.Grade,
			&student.Allergies,
			&student.DietaryNeeds,
			&student.CreatedAt,
			&student.UpdatedAt,
			&student.DeletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan student: %w", err)
		}
		students = append(students, student)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating students: %w", err)
	}

	return students, nil
}

// List retrieves all students
func (r *StudentRepository) List(ctx context.Context, limit, offset int) ([]models.Student, error) {
	query := `
		SELECT id, first_name, last_name, school_id, parent_id, date_of_birth, grade, allergies, dietary_needs, created_at, updated_at, deleted_at
		FROM students
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := r.pool.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query students: %w", err)
	}
	defer rows.Close()

	var students []models.Student
	for rows.Next() {
		student := models.Student{}
		err := rows.Scan(
			&student.ID,
			&student.FirstName,
			&student.LastName,
			&student.SchoolID,
			&student.ParentID,
			&student.DateOfBirth,
			&student.Grade,
			&student.Allergies,
			&student.DietaryNeeds,
			&student.CreatedAt,
			&student.UpdatedAt,
			&student.DeletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan student: %w", err)
		}
		students = append(students, student)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating students: %w", err)
	}

	return students, nil
}

// Update modifies a student
func (r *StudentRepository) Update(ctx context.Context, id string, req *models.StudentUpdateRequest) (*models.Student, error) {
	query := `
		UPDATE students
		SET
			first_name = COALESCE(NULLIF($2, ''), first_name),
			last_name = COALESCE(NULLIF($3, ''), last_name),
			grade = COALESCE(NULLIF($4, ''), grade),
			allergies = COALESCE(NULLIF($5, ''), allergies),
			dietary_needs = COALESCE(NULLIF($6, ''), dietary_needs),
			updated_at = NOW()
		WHERE id = $1 AND deleted_at IS NULL
		RETURNING id, first_name, last_name, school_id, parent_id, date_of_birth, grade, allergies, dietary_needs, created_at, updated_at
	`

	student := &models.Student{}

	firstName := ""
	if req.FirstName != nil {
		firstName = *req.FirstName
	}

	lastName := ""
	if req.LastName != nil {
		lastName = *req.LastName
	}

	grade := ""
	if req.Grade != nil {
		grade = *req.Grade
	}

	allergies := ""
	if req.Allergies != nil {
		allergies = *req.Allergies
	}

	dietaryNeeds := ""
	if req.DietaryNeeds != nil {
		dietaryNeeds = *req.DietaryNeeds
	}

	err := r.pool.QueryRow(ctx, query, id, firstName, lastName, grade, allergies, dietaryNeeds).Scan(
		&student.ID,
		&student.FirstName,
		&student.LastName,
		&student.SchoolID,
		&student.ParentID,
		&student.DateOfBirth,
		&student.Grade,
		&student.Allergies,
		&student.DietaryNeeds,
		&student.CreatedAt,
		&student.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to update student: %w", err)
	}

	return student, nil
}

// Delete soft deletes a student
func (r *StudentRepository) Delete(ctx context.Context, id string) error {
	query := `
		UPDATE students
		SET deleted_at = $1
		WHERE id = $2 AND deleted_at IS NULL
	`

	result, err := r.pool.Exec(ctx, query, time.Now(), id)
	if err != nil {
		return fmt.Errorf("failed to delete student: %w", err)
	}

	if result.RowsAffected() == 0 {
		return models.ErrNotFound
	}

	return nil
}
