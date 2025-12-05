package repository

import (
	"context"
	"fmt"

	"mbg-backend/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// MealPlanRepository handles database operations for meal plans
type MealPlanRepository struct {
	pool *pgxpool.Pool
}

// NewMealPlanRepository creates a new meal plan repository
func NewMealPlanRepository(pool *pgxpool.Pool) *MealPlanRepository {
	return &MealPlanRepository{pool: pool}
}

// Create inserts a new meal plan
func (r *MealPlanRepository) Create(ctx context.Context, mealPlan *models.MealPlan) error {
	query := `
		INSERT INTO meal_plans (id, student_id, meal_id, start_date, end_date, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`

	err := r.pool.QueryRow(ctx, query,
		mealPlan.ID,
		mealPlan.StudentID,
		mealPlan.MealID,
		mealPlan.StartDate,
		mealPlan.EndDate,
	).Scan(&mealPlan.ID, &mealPlan.CreatedAt, &mealPlan.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create meal plan: %w", err)
	}
	return nil
}

// GetByID retrieves a meal plan by ID
func (r *MealPlanRepository) GetByID(ctx context.Context, id string) (*models.MealPlan, error) {
	mealPlan := &models.MealPlan{}
	query := `
		SELECT id, student_id, meal_id, start_date, end_date, created_at, updated_at
		FROM meal_plans
		WHERE id = $1 AND deleted_at IS NULL
	`

	err := r.pool.QueryRow(ctx, query, id).Scan(
		&mealPlan.ID,
		&mealPlan.StudentID,
		&mealPlan.MealID,
		&mealPlan.StartDate,
		&mealPlan.EndDate,
		&mealPlan.CreatedAt,
		&mealPlan.UpdatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to get meal plan: %w", err)
	}
	return mealPlan, nil
}

// GetByStudent retrieves meal plans for a student
func (r *MealPlanRepository) GetByStudent(ctx context.Context, studentID string, limit, offset int) ([]models.MealPlan, error) {
	mealPlans := make([]models.MealPlan, 0)
	query := `
		SELECT id, student_id, meal_id, start_date, end_date, created_at, updated_at
		FROM meal_plans
		WHERE student_id = $1 AND deleted_at IS NULL
		ORDER BY start_date DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.pool.Query(ctx, query, studentID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to get meal plans: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		mp := models.MealPlan{}
		if err := rows.Scan(
			&mp.ID,
			&mp.StudentID,
			&mp.MealID,
			&mp.StartDate,
			&mp.EndDate,
			&mp.CreatedAt,
			&mp.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan meal plan: %w", err)
		}
		mealPlans = append(mealPlans, mp)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error listing meal plans: %w", err)
	}
	return mealPlans, nil
}

// GetByMeal retrieves meal plans for a meal
func (r *MealPlanRepository) GetByMeal(ctx context.Context, mealID string, limit, offset int) ([]models.MealPlan, error) {
	mealPlans := make([]models.MealPlan, 0)
	query := `
		SELECT id, student_id, meal_id, start_date, end_date, created_at, updated_at
		FROM meal_plans
		WHERE meal_id = $1 AND deleted_at IS NULL
		ORDER BY start_date DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.pool.Query(ctx, query, mealID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to get meal plans: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		mp := models.MealPlan{}
		if err := rows.Scan(
			&mp.ID,
			&mp.StudentID,
			&mp.MealID,
			&mp.StartDate,
			&mp.EndDate,
			&mp.CreatedAt,
			&mp.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan meal plan: %w", err)
		}
		mealPlans = append(mealPlans, mp)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error listing meal plans: %w", err)
	}
	return mealPlans, nil
}

// List retrieves all meal plans
func (r *MealPlanRepository) List(ctx context.Context, limit, offset int) ([]models.MealPlan, error) {
	mealPlans := make([]models.MealPlan, 0)
	query := `
		SELECT id, student_id, meal_id, start_date, end_date, created_at, updated_at
		FROM meal_plans
		WHERE deleted_at IS NULL
		ORDER BY start_date DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := r.pool.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to list meal plans: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		mp := models.MealPlan{}
		if err := rows.Scan(
			&mp.ID,
			&mp.StudentID,
			&mp.MealID,
			&mp.StartDate,
			&mp.EndDate,
			&mp.CreatedAt,
			&mp.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan meal plan: %w", err)
		}
		mealPlans = append(mealPlans, mp)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error listing meal plans: %w", err)
	}
	return mealPlans, nil
}

// Update modifies a meal plan
func (r *MealPlanRepository) Update(ctx context.Context, id string, req *models.MealPlanUpdateRequest) (*models.MealPlan, error) {
	mealPlan := &models.MealPlan{}
	query := `
		UPDATE meal_plans
		SET 
			start_date = COALESCE(NULLIF($1::DATE, '0001-01-01'::DATE), start_date),
			end_date = COALESCE(NULLIF($2::DATE, '0001-01-01'::DATE), end_date),
			updated_at = NOW()
		WHERE id = $3 AND deleted_at IS NULL
		RETURNING id, student_id, meal_id, start_date, end_date, created_at, updated_at
	`

	err := r.pool.QueryRow(ctx, query,
		req.StartDate,
		req.EndDate,
		id,
	).Scan(
		&mealPlan.ID,
		&mealPlan.StudentID,
		&mealPlan.MealID,
		&mealPlan.StartDate,
		&mealPlan.EndDate,
		&mealPlan.CreatedAt,
		&mealPlan.UpdatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to update meal plan: %w", err)
	}
	return mealPlan, nil
}

// Delete soft-deletes a meal plan
func (r *MealPlanRepository) Delete(ctx context.Context, id string) error {
	query := `
		UPDATE meal_plans
		SET deleted_at = NOW()
		WHERE id = $1 AND deleted_at IS NULL
	`

	result, err := r.pool.Exec(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete meal plan: %w", err)
	}

	if result.RowsAffected() == 0 {
		return models.ErrNotFound
	}
	return nil
}
