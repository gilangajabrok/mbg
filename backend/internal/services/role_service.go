package services

import (
	"context"
	"fmt"

	"mbg-backend/internal/repository"
	"mbg-backend/internal/utils"
)

// RoleService provides role management operations
type RoleService struct {
	repo *repository.RoleRepository
}

// NewRoleService creates a new RoleService
func NewRoleService(repo *repository.RoleRepository) *RoleService {
	return &RoleService{repo: repo}
}

// ListRoles returns available roles
func (s *RoleService) ListRoles(ctx context.Context) ([]string, error) {
	return s.repo.ListRoles(ctx)
}

// GetUserRole returns the role of a user
func (s *RoleService) GetUserRole(ctx context.Context, userID string) (string, error) {
	return s.repo.GetUserRole(ctx, userID)
}

// SetUserRole updates a user's role after validation
func (s *RoleService) SetUserRole(ctx context.Context, userID, role string) error {
	if !utils.ValidateRole(role) {
		return fmt.Errorf("invalid role: %s", role)
	}
	return s.repo.SetUserRole(ctx, userID, role)
}
