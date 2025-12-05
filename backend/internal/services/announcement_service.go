package services

import (
	"context"
	"errors"
	"fmt"
	"mbg-backend/internal/models"
	"strings"
)

// AnnouncementService handles business logic for announcements
type AnnouncementService struct {
	repo models.AnnouncementRepository
}

// NewAnnouncementService creates a new announcement service
func NewAnnouncementService(repo models.AnnouncementRepository) *AnnouncementService {
	return &AnnouncementService{repo: repo}
}

// Create validates and creates a new announcement
func (s *AnnouncementService) Create(ctx context.Context, req *models.AnnouncementCreateRequest) (*models.Announcement, error) {
	if err := s.validateCreate(req); err != nil {
		return nil, err
	}

	announcement := &models.Announcement{
		Title:     strings.TrimSpace(req.Title),
		Content:   strings.TrimSpace(req.Content),
		SchoolID:  req.SchoolID,
		CreatedBy: req.CreatedBy,
		IsActive:  req.IsActive,
	}

	if err := announcement.BeforeCreate(nil); err != nil {
		return nil, err
	}

	if err := s.repo.Create(ctx, announcement); err != nil {
		return nil, fmt.Errorf("failed to create announcement: %w", err)
	}

	return announcement, nil
}

// GetByID retrieves an announcement by ID
func (s *AnnouncementService) GetByID(ctx context.Context, id string) (*models.Announcement, error) {
	if id == "" {
		return nil, errors.New("announcement id is required")
	}

	announcement, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return announcement, nil
}

// GetBySchool retrieves announcements for a school
func (s *AnnouncementService) GetBySchool(ctx context.Context, schoolID string, limit, offset int) ([]models.Announcement, error) {
	if schoolID == "" {
		return nil, errors.New("school id is required")
	}

	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	}

	announcements, err := s.repo.GetBySchool(ctx, schoolID, limit, offset)
	if err != nil {
		return nil, err
	}

	return announcements, nil
}

// List retrieves all announcements
func (s *AnnouncementService) List(ctx context.Context, limit, offset int) ([]models.Announcement, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	}

	announcements, err := s.repo.List(ctx, limit, offset)
	if err != nil {
		return nil, err
	}

	return announcements, nil
}

// Update modifies an announcement
func (s *AnnouncementService) Update(ctx context.Context, id string, req *models.AnnouncementUpdateRequest) (*models.Announcement, error) {
	if id == "" {
		return nil, errors.New("announcement id is required")
	}

	if err := s.validateUpdate(req); err != nil {
		return nil, err
	}

	announcement, err := s.repo.Update(ctx, id, req)
	if err != nil {
		return nil, err
	}

	return announcement, nil
}

// Delete removes an announcement
func (s *AnnouncementService) Delete(ctx context.Context, id string) error {
	if id == "" {
		return errors.New("announcement id is required")
	}

	return s.repo.Delete(ctx, id)
}

func (s *AnnouncementService) validateCreate(req *models.AnnouncementCreateRequest) error {
	if req == nil {
		return errors.New("request is required")
	}

	if req.Title == "" {
		return errors.New("title is required")
	}

	if len(req.Title) > 255 {
		return errors.New("title must be 255 characters or less")
	}

	if req.Content == "" {
		return errors.New("content is required")
	}

	if len(req.Content) > 5000 {
		return errors.New("content must be 5000 characters or less")
	}

	if req.SchoolID == "" {
		return errors.New("school id is required")
	}

	if req.CreatedBy == "" {
		return errors.New("created by (user id) is required")
	}

	return nil
}

func (s *AnnouncementService) validateUpdate(req *models.AnnouncementUpdateRequest) error {
	if req == nil {
		return errors.New("request is required")
	}

	if req.Title != nil && *req.Title == "" {
		return errors.New("title cannot be empty")
	}

	if req.Title != nil && len(*req.Title) > 255 {
		return errors.New("title must be 255 characters or less")
	}

	if req.Content != nil && *req.Content == "" {
		return errors.New("content cannot be empty")
	}

	if req.Content != nil && len(*req.Content) > 5000 {
		return errors.New("content must be 5000 characters or less")
	}

	return nil
}
