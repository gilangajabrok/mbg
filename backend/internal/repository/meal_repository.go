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

// MealRepository handles meal data operations
type MealRepository struct {
	pool *pgxpool.Pool
}

// NewMealRepository creates a new meal repository
func NewMealRepository(pool *pgxpool.Pool) *MealRepository {
	return &MealRepository{pool: pool}
}

// Create inserts a new meal
func (r *MealRepository) Create(ctx context.Context, meal *models.Meal) error {
	if meal.ID == "" {
		meal.ID = uuid.New().String()
	}
	if meal.CreatedAt.IsZero() {
		meal.CreatedAt = time.Now()
	}
	if meal.UpdatedAt.IsZero() {
		meal.UpdatedAt = time.Now()
	}

	query := `
		INSERT INTO meals (id, name, description, calories, protein, carbs, fat, allergens, school_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id, name, description, calories, protein, carbs, fat, allergens, school_id, created_at, updated_at
	`

	err := r.pool.QueryRow(ctx, query,
		meal.ID,
		meal.Name,
		meal.Description,
		meal.Calories,
		meal.Protein,
		meal.Carbs,
		meal.Fat,
		meal.Allergens,
		meal.SchoolID,
		meal.CreatedAt,
		meal.UpdatedAt,
	).Scan(
		&meal.ID,
		&meal.Name,
		&meal.Description,
		&meal.Calories,
		&meal.Protein,
		&meal.Carbs,
		&meal.Fat,
		&meal.Allergens,
		&meal.SchoolID,
		&meal.CreatedAt,
		&meal.UpdatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create meal: %w", err)
	}

	return nil
}

// GetByID retrieves a meal by ID
func (r *MealRepository) GetByID(ctx context.Context, id string) (*models.Meal, error) {
	query := `
		SELECT id, name, description, calories, protein, carbs, fat, allergens, school_id, created_at, updated_at, deleted_at
		FROM meals
		WHERE id = $1 AND deleted_at IS NULL
	`

	meal := &models.Meal{}
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&meal.ID,
		&meal.Name,
		&meal.Description,
		&meal.Calories,
		&meal.Protein,
		&meal.Carbs,
		&meal.Fat,
		&meal.Allergens,
		&meal.SchoolID,
		&meal.CreatedAt,
		&meal.UpdatedAt,
		&meal.DeletedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to get meal: %w", err)
	}

	return meal, nil
}

// GetBySchool retrieves meals for a school
func (r *MealRepository) GetBySchool(ctx context.Context, schoolID string, limit, offset int) ([]models.Meal, error) {
	query := `
		SELECT id, name, description, calories, protein, carbs, fat, allergens, school_id, created_at, updated_at, deleted_at
		FROM meals
		WHERE school_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.pool.Query(ctx, query, schoolID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query meals: %w", err)
	}
	defer rows.Close()

	var meals []models.Meal
	for rows.Next() {
		meal := models.Meal{}
		err := rows.Scan(
			&meal.ID,
			&meal.Name,
			&meal.Description,
			&meal.Calories,
			&meal.Protein,
			&meal.Carbs,
			&meal.Fat,
			&meal.Allergens,
			&meal.SchoolID,
			&meal.CreatedAt,
			&meal.UpdatedAt,
			&meal.DeletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan meal: %w", err)
		}
		meals = append(meals, meal)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating meals: %w", err)
	}

	return meals, nil
}

// List retrieves all meals
func (r *MealRepository) List(ctx context.Context, limit, offset int) ([]models.Meal, error) {
	query := `
		SELECT id, name, description, calories, protein, carbs, fat, allergens, school_id, created_at, updated_at, deleted_at
		FROM meals
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := r.pool.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query meals: %w", err)
	}
	defer rows.Close()

	var meals []models.Meal
	for rows.Next() {
		meal := models.Meal{}
		err := rows.Scan(
			&meal.ID,
			&meal.Name,
			&meal.Description,
			&meal.Calories,
			&meal.Protein,
			&meal.Carbs,
			&meal.Fat,
			&meal.Allergens,
			&meal.SchoolID,
			&meal.CreatedAt,
			&meal.UpdatedAt,
			&meal.DeletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan meal: %w", err)
		}
		meals = append(meals, meal)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating meals: %w", err)
	}

	return meals, nil
}

// Update modifies a meal
func (r *MealRepository) Update(ctx context.Context, id string, req *models.MealUpdateRequest) (*models.Meal, error) {
	query := `
		UPDATE meals
		SET
			name = COALESCE(NULLIF($2, ''), name),
			description = COALESCE(NULLIF($3, ''), description),
			calories = CASE WHEN $4::int IS NOT NULL AND $4::int > 0 THEN $4 ELSE calories END,
			protein = CASE WHEN $5::numeric IS NOT NULL AND $5::numeric >= 0 THEN $5 ELSE protein END,
			carbs = CASE WHEN $6::numeric IS NOT NULL AND $6::numeric >= 0 THEN $6 ELSE carbs END,
			fat = CASE WHEN $7::numeric IS NOT NULL AND $7::numeric >= 0 THEN $7 ELSE fat END,
			allergens = COALESCE(NULLIF($8, ''), allergens),
			updated_at = NOW()
		WHERE id = $1 AND deleted_at IS NULL
		RETURNING id, name, description, calories, protein, carbs, fat, allergens, school_id, created_at, updated_at
	`

	meal := &models.Meal{}

	name := ""
	if req.Name != nil {
		name = *req.Name
	}

	description := ""
	if req.Description != nil {
		description = *req.Description
	}

	calories := 0
	if req.Calories != nil {
		calories = *req.Calories
	}

	protein := 0.0
	if req.Protein != nil {
		protein = *req.Protein
	}

	carbs := 0.0
	if req.Carbs != nil {
		carbs = *req.Carbs
	}

	fat := 0.0
	if req.Fat != nil {
		fat = *req.Fat
	}

	allergens := ""
	if req.Allergens != nil {
		allergens = *req.Allergens
	}

	err := r.pool.QueryRow(ctx, query, id, name, description, calories, protein, carbs, fat, allergens).Scan(
		&meal.ID,
		&meal.Name,
		&meal.Description,
		&meal.Calories,
		&meal.Protein,
		&meal.Carbs,
		&meal.Fat,
		&meal.Allergens,
		&meal.SchoolID,
		&meal.CreatedAt,
		&meal.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to update meal: %w", err)
	}

	return meal, nil
}

// Delete soft deletes a meal
func (r *MealRepository) Delete(ctx context.Context, id string) error {
	query := `
		UPDATE meals
		SET deleted_at = $1
		WHERE id = $2 AND deleted_at IS NULL
	`

	result, err := r.pool.Exec(ctx, query, time.Now(), id)
	if err != nil {
		return fmt.Errorf("failed to delete meal: %w", err)
	}

	if result.RowsAffected() == 0 {
		return models.ErrNotFound
	}

	return nil
}
