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

// AnnouncementRepository handles announcement data operations
type AnnouncementRepository struct {
	pool *pgxpool.Pool
}

// NewAnnouncementRepository creates a new announcement repository
func NewAnnouncementRepository(pool *pgxpool.Pool) *AnnouncementRepository {
	return &AnnouncementRepository{pool: pool}
}

// Create inserts a new announcement
func (r *AnnouncementRepository) Create(ctx context.Context, announcement *models.Announcement) error {
	if announcement.ID == "" {
		announcement.ID = uuid.New().String()
	}
	if announcement.CreatedAt.IsZero() {
		announcement.CreatedAt = time.Now()
	}
	if announcement.UpdatedAt.IsZero() {
		announcement.UpdatedAt = time.Now()
	}

	query := `
		INSERT INTO announcements (id, title, content, school_id, created_by, is_active, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, title, content, school_id, created_by, is_active, created_at, updated_at
	`

	err := r.pool.QueryRow(ctx, query,
		announcement.ID,
		announcement.Title,
		announcement.Content,
		announcement.SchoolID,
		announcement.CreatedBy,
		announcement.IsActive,
		announcement.CreatedAt,
		announcement.UpdatedAt,
	).Scan(
		&announcement.ID,
		&announcement.Title,
		&announcement.Content,
		&announcement.SchoolID,
		&announcement.CreatedBy,
		&announcement.IsActive,
		&announcement.CreatedAt,
		&announcement.UpdatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create announcement: %w", err)
	}

	return nil
}

// GetByID retrieves an announcement by ID
func (r *AnnouncementRepository) GetByID(ctx context.Context, id string) (*models.Announcement, error) {
	query := `
		SELECT id, title, content, school_id, created_by, is_active, created_at, updated_at, deleted_at
		FROM announcements
		WHERE id = $1 AND deleted_at IS NULL
	`

	announcement := &models.Announcement{}
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&announcement.ID,
		&announcement.Title,
		&announcement.Content,
		&announcement.SchoolID,
		&announcement.CreatedBy,
		&announcement.IsActive,
		&announcement.CreatedAt,
		&announcement.UpdatedAt,
		&announcement.DeletedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to get announcement: %w", err)
	}

	return announcement, nil
}

// GetBySchool retrieves announcements for a school
func (r *AnnouncementRepository) GetBySchool(ctx context.Context, schoolID string, limit, offset int) ([]models.Announcement, error) {
	query := `
		SELECT id, title, content, school_id, created_by, is_active, created_at, updated_at, deleted_at
		FROM announcements
		WHERE school_id = $1 AND deleted_at IS NULL AND is_active = true
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.pool.Query(ctx, query, schoolID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query announcements: %w", err)
	}
	defer rows.Close()

	var announcements []models.Announcement
	for rows.Next() {
		announcement := models.Announcement{}
		err := rows.Scan(
			&announcement.ID,
			&announcement.Title,
			&announcement.Content,
			&announcement.SchoolID,
			&announcement.CreatedBy,
			&announcement.IsActive,
			&announcement.CreatedAt,
			&announcement.UpdatedAt,
			&announcement.DeletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan announcement: %w", err)
		}
		announcements = append(announcements, announcement)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating announcements: %w", err)
	}

	return announcements, nil
}

// List retrieves all announcements
func (r *AnnouncementRepository) List(ctx context.Context, limit, offset int) ([]models.Announcement, error) {
	query := `
		SELECT id, title, content, school_id, created_by, is_active, created_at, updated_at, deleted_at
		FROM announcements
		WHERE deleted_at IS NULL AND is_active = true
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := r.pool.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query announcements: %w", err)
	}
	defer rows.Close()

	var announcements []models.Announcement
	for rows.Next() {
		announcement := models.Announcement{}
		err := rows.Scan(
			&announcement.ID,
			&announcement.Title,
			&announcement.Content,
			&announcement.SchoolID,
			&announcement.CreatedBy,
			&announcement.IsActive,
			&announcement.CreatedAt,
			&announcement.UpdatedAt,
			&announcement.DeletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan announcement: %w", err)
		}
		announcements = append(announcements, announcement)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating announcements: %w", err)
	}

	return announcements, nil
}

// Update modifies an announcement
func (r *AnnouncementRepository) Update(ctx context.Context, id string, req *models.AnnouncementUpdateRequest) (*models.Announcement, error) {
	query := `
		UPDATE announcements
		SET
			title = COALESCE(NULLIF($2, ''), title),
			content = COALESCE(NULLIF($3, ''), content),
			is_active = CASE WHEN $4::boolean IS NOT NULL THEN $4 ELSE is_active END,
			updated_at = NOW()
		WHERE id = $1 AND deleted_at IS NULL
		RETURNING id, title, content, school_id, created_by, is_active, created_at, updated_at
	`

	announcement := &models.Announcement{}

	title := ""
	if req.Title != nil {
		title = *req.Title
	}

	content := ""
	if req.Content != nil {
		content = *req.Content
	}

	err := r.pool.QueryRow(ctx, query, id, title, content, req.IsActive).Scan(
		&announcement.ID,
		&announcement.Title,
		&announcement.Content,
		&announcement.SchoolID,
		&announcement.CreatedBy,
		&announcement.IsActive,
		&announcement.CreatedAt,
		&announcement.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, models.ErrNotFound
		}
		return nil, fmt.Errorf("failed to update announcement: %w", err)
	}

	return announcement, nil
}

// Delete soft deletes an announcement
func (r *AnnouncementRepository) Delete(ctx context.Context, id string) error {
	query := `
		UPDATE announcements
		SET deleted_at = $1
		WHERE id = $2 AND deleted_at IS NULL
	`

	result, err := r.pool.Exec(ctx, query, time.Now(), id)
	if err != nil {
		return fmt.Errorf("failed to delete announcement: %w", err)
	}

	if result.RowsAffected() == 0 {
		return models.ErrNotFound
	}

	return nil
}
