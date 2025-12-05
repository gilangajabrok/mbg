package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

// RoleRepository manages role assignments in the users table
type RoleRepository struct {
	pool *pgxpool.Pool
}

// NewRoleRepository creates a new RoleRepository
func NewRoleRepository(pool *pgxpool.Pool) *RoleRepository {
	return &RoleRepository{pool: pool}
}

// SetUserRole sets the role for a given user id
func (r *RoleRepository) SetUserRole(ctx context.Context, userID, role string) error {
	_, err := r.pool.Exec(ctx, "UPDATE public.users SET role = $1, updated_at = now() WHERE id = $2", role, userID)
	return err
}

// GetUserRole returns the role of a user
func (r *RoleRepository) GetUserRole(ctx context.Context, userID string) (string, error) {
	var role string
	err := r.pool.QueryRow(ctx, "SELECT role FROM public.users WHERE id = $1", userID).Scan(&role)
	if err != nil {
		return "", err
	}
	return role, nil
}

// ListRoles returns a static list of supported roles (source of truth is migration)
func (r *RoleRepository) ListRoles(ctx context.Context) ([]string, error) {
	// Roles are defined in DB migration as enum; return static list for now
	roles := []string{"super_admin", "admin", "supplier", "parent"}
	return roles, nil
}
