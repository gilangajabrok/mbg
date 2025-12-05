package services

import (
	"context"
	"errors"
	"testing"
	"time"

	"mbg-backend/internal/models"
)

// mockUserRepo is a minimal mock for testing service logic
type mockUserRepo struct {
	GetByIDFunc            func(ctx context.Context, userID string, includeInactive bool) (*models.UserProfile, error)
	GetByUserIDForAuthFunc func(ctx context.Context, userID string) (*models.UserProfile, error)
	UpsertProfileFunc      func(ctx context.Context, p *models.UserProfile) (*models.UserProfile, error)
	DeactivateUserFunc     func(ctx context.Context, userID string) error
}

func (m *mockUserRepo) GetByID(ctx context.Context, userID string, includeInactive bool) (*models.UserProfile, error) {
	if m.GetByIDFunc != nil {
		return m.GetByIDFunc(ctx, userID, includeInactive)
	}
	return nil, ErrNotFound
}

func (m *mockUserRepo) GetByUserIDForAuth(ctx context.Context, userID string) (*models.UserProfile, error) {
	if m.GetByUserIDForAuthFunc != nil {
		return m.GetByUserIDForAuthFunc(ctx, userID)
	}
	return nil, ErrNotFound
}

func (m *mockUserRepo) UpsertProfile(ctx context.Context, p *models.UserProfile) (*models.UserProfile, error) {
	if m.UpsertProfileFunc != nil {
		return m.UpsertProfileFunc(ctx, p)
	}
	return p, nil
}

func (m *mockUserRepo) DeactivateUser(ctx context.Context, userID string) error {
	if m.DeactivateUserFunc != nil {
		return m.DeactivateUserFunc(ctx, userID)
	}
	return nil
}

// testSvc wraps the repo and exposes service logic for testing
type testSvc struct {
	repo *mockUserRepo
}

func (s *testSvc) GetProfileForUser(ctx context.Context, userID string) (*models.UserProfile, error) {
	p, err := s.repo.GetByUserIDForAuth(ctx, userID)
	if err != nil {
		return nil, ErrNotFound
	}
	if !p.IsActive {
		return nil, ErrForbidden
	}
	return p, nil
}

func (s *testSvc) UpdateProfile(ctx context.Context, userID string, in *models.UserProfile) (*models.UserProfile, error) {
	if in.FullName == "" || len(in.FullName) > 255 {
		return nil, ErrValidation
	}
	if in.Phone != "" && len(in.Phone) > 20 {
		return nil, ErrValidation
	}
	in.UserID = userID
	return s.repo.UpsertProfile(ctx, in)
}

func (s *testSvc) GetProfileByID(ctx context.Context, userID string) (*models.UserProfile, error) {
	p, err := s.repo.GetByID(ctx, userID, true)
	if err != nil {
		return nil, ErrNotFound
	}
	return p, nil
}

func (s *testSvc) DeactivateUser(ctx context.Context, userID string) error {
	return s.repo.DeactivateUser(ctx, userID)
}

// Service tests
func TestGetProfileForUserSuccess(t *testing.T) {
	svc := &testSvc{
		repo: &mockUserRepo{
			GetByUserIDForAuthFunc: func(ctx context.Context, userID string) (*models.UserProfile, error) {
				return &models.UserProfile{UserID: userID, FullName: "John Doe", IsActive: true, CreatedAt: time.Now(), UpdatedAt: time.Now()}, nil
			},
		},
	}
	p, err := svc.GetProfileForUser(context.Background(), "user-1")
	if err != nil || p.FullName != "John Doe" {
		t.Errorf("expected success, got err=%v", err)
	}
}

func TestGetProfileForUserInactive(t *testing.T) {
	svc := &testSvc{
		repo: &mockUserRepo{
			GetByUserIDForAuthFunc: func(ctx context.Context, userID string) (*models.UserProfile, error) {
				return &models.UserProfile{UserID: userID, IsActive: false, CreatedAt: time.Now(), UpdatedAt: time.Now()}, nil
			},
		},
	}
	p, err := svc.GetProfileForUser(context.Background(), "user-2")
	if err != ErrForbidden || p != nil {
		t.Errorf("expected ErrForbidden for inactive user, got err=%v p=%+v", err, p)
	}
}

func TestGetProfileForUserNotFound(t *testing.T) {
	svc := &testSvc{repo: &mockUserRepo{GetByUserIDForAuthFunc: func(ctx context.Context, userID string) (*models.UserProfile, error) { return nil, ErrNotFound }}}
	p, err := svc.GetProfileForUser(context.Background(), "nonexistent")
	if err != ErrNotFound || p != nil {
		t.Errorf("expected ErrNotFound, got err=%v", err)
	}
}

func TestUpdateProfileSuccess(t *testing.T) {
	svc := &testSvc{
		repo: &mockUserRepo{
			UpsertProfileFunc: func(ctx context.Context, p *models.UserProfile) (*models.UserProfile, error) {
				p.CreatedAt, p.UpdatedAt = time.Now().Add(-time.Hour), time.Now()
				return p, nil
			},
		},
	}
	input := &models.UserProfile{FullName: "Alice", Phone: "+1234567890"}
	p, err := svc.UpdateProfile(context.Background(), "user-3", input)
	if err != nil || p.FullName != "Alice" {
		t.Errorf("expected success, got err=%v", err)
	}
}

func TestUpdateProfileInvalidFullName(t *testing.T) {
	svc := &testSvc{repo: &mockUserRepo{}}
	p, err := svc.UpdateProfile(context.Background(), "user-4", &models.UserProfile{FullName: ""})
	if err != ErrValidation || p != nil {
		t.Errorf("expected ErrValidation for empty full_name, got err=%v", err)
	}
}

func TestUpdateProfileInvalidPhone(t *testing.T) {
	svc := &testSvc{repo: &mockUserRepo{}}
	p, err := svc.UpdateProfile(context.Background(), "user-5", &models.UserProfile{FullName: "Bob", Phone: "123456789012345678901"})
	if err != ErrValidation || p != nil {
		t.Errorf("expected ErrValidation for long phone, got err=%v", err)
	}
}

func TestGetProfileByIDAdmin(t *testing.T) {
	called := false
	svc := &testSvc{
		repo: &mockUserRepo{
			GetByIDFunc: func(ctx context.Context, userID string, includeInactive bool) (*models.UserProfile, error) {
				called = includeInactive
				return &models.UserProfile{UserID: userID, IsActive: false, CreatedAt: time.Now(), UpdatedAt: time.Now()}, nil
			},
		},
	}
	p, err := svc.GetProfileByID(context.Background(), "user-6")
	if err != nil || !called || p == nil {
		t.Errorf("expected admin read without is_active check, called=%v err=%v", called, err)
	}
}

func TestDeactivateUserSuccess(t *testing.T) {
	svc := &testSvc{repo: &mockUserRepo{DeactivateUserFunc: func(ctx context.Context, userID string) error { return nil }}}
	err := svc.DeactivateUser(context.Background(), "user-7")
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
}

func TestDeactivateUserError(t *testing.T) {
	svc := &testSvc{repo: &mockUserRepo{DeactivateUserFunc: func(ctx context.Context, userID string) error { return errors.New("db error") }}}
	err := svc.DeactivateUser(context.Background(), "user-8")
	if err == nil {
		t.Errorf("expected error, got nil")
	}
}
