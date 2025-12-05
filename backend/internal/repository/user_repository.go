package repository

import (
	"context"
	"encoding/json"
	"time"

	"mbg-backend/internal/models"

	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

// UserRepository handles DB operations for user profiles
type UserRepository struct {
	pool *pgxpool.Pool
}

// NewUserRepository creates a new repository
func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{pool: pool}
}

// GetByID fetches a profile by user id. includeInactive allows admin to bypass is_active check.
func (r *UserRepository) GetByID(ctx context.Context, userID string, includeInactive bool) (*models.UserProfile, error) {
	var (
		metadataBytes []byte
		up            models.UserProfile
	)

	sql := `SELECT user_id, full_name, phone, address, avatar_url, metadata, is_active, created_at, updated_at FROM user_profiles WHERE user_id = $1`
	if !includeInactive {
		sql += ` AND is_active = true`
	}

	row := r.pool.QueryRow(ctx, sql, userID)
	err := row.Scan(&up.UserID, &up.FullName, &up.Phone, &up.Address, &up.AvatarURL, &metadataBytes, &up.IsActive, &up.CreatedAt, &up.UpdatedAt)
	if err != nil {
		return nil, err
	}

	if len(metadataBytes) > 0 {
		var m map[string]interface{}
		if err := json.Unmarshal(metadataBytes, &m); err == nil {
			up.Metadata = m
		}
	}

	return &up, nil
}

// GetByUserIDForAuth fetches profile for auth checks (respects is_active)
func (r *UserRepository) GetByUserIDForAuth(ctx context.Context, userID string) (*models.UserProfile, error) {
	return r.GetByID(ctx, userID, false)
}

// UpsertProfile inserts or updates a user profile
func (r *UserRepository) UpsertProfile(ctx context.Context, p *models.UserProfile) (*models.UserProfile, error) {
	meta := []byte(`{}`)
	if p.Metadata != nil {
		if b, err := json.Marshal(p.Metadata); err == nil {
			meta = b
		}
	}

	sql := `INSERT INTO user_profiles (user_id, full_name, phone, address, avatar_url, metadata, is_active, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,COALESCE($7, true), now(), now())
    ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone, address = EXCLUDED.address, avatar_url = EXCLUDED.avatar_url, metadata = EXCLUDED.metadata, is_active = EXCLUDED.is_active, updated_at = now()
    RETURNING created_at, updated_at`

	var createdAt time.Time
	var updatedAt time.Time
	err := r.pool.QueryRow(ctx, sql, p.UserID, p.FullName, p.Phone, p.Address, p.AvatarURL, meta, p.IsActive).Scan(&createdAt, &updatedAt)
	if err != nil {
		return nil, err
	}

	p.CreatedAt = createdAt
	p.UpdatedAt = updatedAt
	return p, nil
}

// DeactivateUser sets is_active = false for a given user_id
func (r *UserRepository) DeactivateUser(ctx context.Context, userID string) (pgconn.CommandTag, error) {
	sql := `UPDATE user_profiles SET is_active = false, updated_at = now() WHERE user_id = $1`
	ct, err := r.pool.Exec(ctx, sql, userID)
	if err != nil {
		return ct, err
	}
	return ct, nil
}
