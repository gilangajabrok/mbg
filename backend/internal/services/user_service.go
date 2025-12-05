package services

import (
	"context"
	"errors"

	"mbg-backend/internal/models"
	"mbg-backend/internal/repository"
	"mbg-backend/internal/utils"

	"go.uber.org/zap"
)

var (
	ErrNotFound   = errors.New("not found")
	ErrForbidden  = errors.New("forbidden")
	ErrValidation = errors.New("validation error")
)

// UserServicer defines the interface for user profile operations
type UserServicer interface {
	GetProfileForUser(ctx context.Context, userID string) (*models.UserProfile, error)
	UpdateProfile(ctx context.Context, userID string, in *models.UserProfile) (*models.UserProfile, error)
	GetProfileByID(ctx context.Context, id string) (*models.UserProfile, error)
	DeactivateUser(ctx context.Context, id string) error
}

// UserService contains business logic for user profiles
type UserService struct {
	repo   *repository.UserRepository
	logger *zap.Logger
	util   *utils.Container
}

// NewUserService creates a new service
func NewUserService(repo *repository.UserRepository, logger *zap.Logger, c *utils.Container) *UserService {
	return &UserService{repo: repo, logger: logger, util: c}
}

// GetProfileForUser retrieves the profile for the current user
func (s *UserService) GetProfileForUser(ctx context.Context, userID string) (*models.UserProfile, error) {
	p, err := s.repo.GetByUserIDForAuth(ctx, userID)
	if err != nil {
		return nil, ErrNotFound
	}
	if !p.IsActive {
		return nil, ErrForbidden
	}
	return p, nil
}

// UpdateProfile updates the user's profile after validating input
func (s *UserService) UpdateProfile(ctx context.Context, userID string, in *models.UserProfile) (*models.UserProfile, error) {
	// Validate full name
	if ok := utils.ValidateFullName(in.FullName); !ok {
		return nil, ErrValidation
	}
	// Validate phone (if provided)
	if in.Phone != "" {
		if ok := utils.ValidatePhoneNumber(in.Phone); !ok {
			return nil, ErrValidation
		}
	}

	// Ensure existing profile is active
	existing, err := s.repo.GetByUserIDForAuth(ctx, userID)
	if err != nil {
		// If not found, create new profile via upsert
		in.UserID = userID
		in.IsActive = true
		out, uerr := s.repo.UpsertProfile(ctx, in)
		if uerr != nil {
			s.logger.Error("failed to upsert profile", zap.Error(uerr))
			return nil, uerr
		}
		return out, nil
	}

	if !existing.IsActive {
		return nil, ErrForbidden
	}

	in.UserID = userID
	out, uerr := s.repo.UpsertProfile(ctx, in)
	if uerr != nil {
		s.logger.Error("failed to upsert profile", zap.Error(uerr))
		return nil, uerr
	}
	return out, nil
}

// GetProfileByID retrieves profile by id for admin (can bypass is_active)
func (s *UserService) GetProfileByID(ctx context.Context, id string) (*models.UserProfile, error) {
	p, err := s.repo.GetByID(ctx, id, true)
	if err != nil {
		return nil, ErrNotFound
	}
	return p, nil
}

// DeactivateUser soft-deactivates a user
func (s *UserService) DeactivateUser(ctx context.Context, id string) error {
	_, err := s.repo.DeactivateUser(ctx, id)
	return err
}
