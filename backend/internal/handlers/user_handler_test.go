package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"mbg-backend/internal/models"
	"mbg-backend/internal/services"
	"mbg-backend/internal/utils"
	"mbg-backend/pkg/logger"

	"github.com/gin-gonic/gin"
)

// mockSvc is a minimal mock for handler testing
type mockSvc struct {
	GetProfileForUserFunc func(ctx context.Context, userID string) (*models.UserProfile, error)
	UpdateProfileFunc     func(ctx context.Context, userID string, p *models.UserProfile) (*models.UserProfile, error)
	GetProfileByIDFunc    func(ctx context.Context, userID string) (*models.UserProfile, error)
	DeactivateUserFunc    func(ctx context.Context, userID string) error
}

func (m *mockSvc) GetProfileForUser(ctx context.Context, userID string) (*models.UserProfile, error) {
	if m.GetProfileForUserFunc != nil {
		return m.GetProfileForUserFunc(ctx, userID)
	}
	return nil, services.ErrNotFound
}

func (m *mockSvc) UpdateProfile(ctx context.Context, userID string, p *models.UserProfile) (*models.UserProfile, error) {
	if m.UpdateProfileFunc != nil {
		return m.UpdateProfileFunc(ctx, userID, p)
	}
	return p, nil
}

func (m *mockSvc) GetProfileByID(ctx context.Context, userID string) (*models.UserProfile, error) {
	if m.GetProfileByIDFunc != nil {
		return m.GetProfileByIDFunc(ctx, userID)
	}
	return nil, services.ErrNotFound
}

func (m *mockSvc) DeactivateUser(ctx context.Context, userID string) error {
	if m.DeactivateUserFunc != nil {
		return m.DeactivateUserFunc(ctx, userID)
	}
	return nil
}

func setupTestRouter(svc *mockSvc) *gin.Engine {
	log := logger.NewLogger("info", false)
	container := &utils.Container{Logger: log}

	handler := NewUserHandler(container, svc)
	router := gin.New()

	router.GET("/users/me", func(c *gin.Context) {
		c.Set("user_id", "test-user")
		c.Set("trace_id", "test-trace-1")
		handler.GetMe(c)
	})

	router.PUT("/users/me", func(c *gin.Context) {
		c.Set("user_id", "test-user")
		c.Set("trace_id", "test-trace-2")
		handler.UpdateMe(c)
	})

	router.GET("/users/:id", func(c *gin.Context) {
		c.Set("trace_id", "test-trace-3")
		handler.GetByID(c)
	})

	router.POST("/users/:id/deactivate", func(c *gin.Context) {
		c.Set("trace_id", "test-trace-4")
		handler.Deactivate(c)
	})

	return router
}

// Handler tests
func TestGetMeSuccess(t *testing.T) {
	svc := &mockSvc{
		GetProfileForUserFunc: func(ctx context.Context, userID string) (*models.UserProfile, error) {
			return &models.UserProfile{UserID: userID, FullName: "Test User", IsActive: true, CreatedAt: time.Now(), UpdatedAt: time.Now()}, nil
		},
	}
	router := setupTestRouter(svc)

	req := httptest.NewRequest(http.MethodGet, "/users/me", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	if resp["success"] != true {
		t.Errorf("expected success=true in response")
	}
	meta := resp["meta"].(map[string]interface{})
	if meta["trace_id"] != "test-trace-1" {
		t.Errorf("expected trace_id in meta, got %v", meta["trace_id"])
	}
}

func TestGetMeUnauthorized(t *testing.T) {
	log := logger.NewLogger("info", false)
	container := &utils.Container{Logger: log}
	handler := NewUserHandler(container, &mockSvc{})
	router := gin.New()

	router.GET("/users/me", func(c *gin.Context) {
		c.Set("trace_id", "test-trace")
		// no user_id set
		handler.GetMe(c)
	})

	req := httptest.NewRequest(http.MethodGet, "/users/me", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d", w.Code)
	}
}

func TestGetMeForbidden(t *testing.T) {
	svc := &mockSvc{
		GetProfileForUserFunc: func(ctx context.Context, userID string) (*models.UserProfile, error) {
			return nil, services.ErrForbidden
		},
	}
	router := setupTestRouter(svc)

	req := httptest.NewRequest(http.MethodGet, "/users/me", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusForbidden {
		t.Errorf("expected 403, got %d", w.Code)
	}
}

func TestGetMeNotFound(t *testing.T) {
	svc := &mockSvc{
		GetProfileForUserFunc: func(ctx context.Context, userID string) (*models.UserProfile, error) {
			return nil, services.ErrNotFound
		},
	}
	router := setupTestRouter(svc)

	req := httptest.NewRequest(http.MethodGet, "/users/me", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("expected 404, got %d", w.Code)
	}
}

func TestUpdateMeSuccess(t *testing.T) {
	svc := &mockSvc{
		UpdateProfileFunc: func(ctx context.Context, userID string, p *models.UserProfile) (*models.UserProfile, error) {
			p.UserID = userID
			p.CreatedAt, p.UpdatedAt = time.Now().Add(-time.Hour), time.Now()
			return p, nil
		},
	}
	router := setupTestRouter(svc)

	payload := models.UserProfile{FullName: "Updated", Phone: "+1234567890"}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest(http.MethodPut, "/users/me", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
}

func TestUpdateMeInvalidJSON(t *testing.T) {
	router := setupTestRouter(&mockSvc{})
	req := httptest.NewRequest(http.MethodPut, "/users/me", bytes.NewReader([]byte("invalid")))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", w.Code)
	}
}

func TestUpdateMeValidationError(t *testing.T) {
	svc := &mockSvc{
		UpdateProfileFunc: func(ctx context.Context, userID string, p *models.UserProfile) (*models.UserProfile, error) {
			return nil, services.ErrValidation
		},
	}
	router := setupTestRouter(svc)

	payload := models.UserProfile{FullName: ""}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest(http.MethodPut, "/users/me", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", w.Code)
	}
}

func TestGetByIDSuccess(t *testing.T) {
	svc := &mockSvc{
		GetProfileByIDFunc: func(ctx context.Context, userID string) (*models.UserProfile, error) {
			return &models.UserProfile{UserID: userID, FullName: "Admin Read", IsActive: false, CreatedAt: time.Now(), UpdatedAt: time.Now()}, nil
		},
	}
	router := setupTestRouter(svc)

	req := httptest.NewRequest(http.MethodGet, "/users/admin-target", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
}

func TestGetByIDNotFound(t *testing.T) {
	svc := &mockSvc{
		GetProfileByIDFunc: func(ctx context.Context, userID string) (*models.UserProfile, error) {
			return nil, services.ErrNotFound
		},
	}
	router := setupTestRouter(svc)

	req := httptest.NewRequest(http.MethodGet, "/users/nonexistent", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("expected 404, got %d", w.Code)
	}
}

func TestDeactivateSuccess(t *testing.T) {
	svc := &mockSvc{
		DeactivateUserFunc: func(ctx context.Context, userID string) error {
			return nil
		},
	}
	router := setupTestRouter(svc)

	req := httptest.NewRequest(http.MethodPost, "/users/target-user/deactivate", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusNoContent {
		t.Errorf("expected 204, got %d", w.Code)
	}
}

func TestDeactivateMissingID(t *testing.T) {
	log := logger.NewLogger("info", false)
	container := &utils.Container{Logger: log}
	handler := NewUserHandler(container, &mockSvc{})
	router := gin.New()

	router.POST("/users/:id/deactivate", func(c *gin.Context) {
		c.Set("trace_id", "test-trace")
		c.Params = []gin.Param{} // empty params
		handler.Deactivate(c)
	})

	req := httptest.NewRequest(http.MethodPost, "/users//deactivate", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", w.Code)
	}
}

func TestDeactivateError(t *testing.T) {
	svc := &mockSvc{
		DeactivateUserFunc: func(ctx context.Context, userID string) error {
			return errors.New("db error")
		},
	}
	router := setupTestRouter(svc)

	req := httptest.NewRequest(http.MethodPost, "/users/fail-user/deactivate", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", w.Code)
	}
}

func TestResponseIncludesTraceID(t *testing.T) {
	svc := &mockSvc{
		GetProfileForUserFunc: func(ctx context.Context, userID string) (*models.UserProfile, error) {
			return &models.UserProfile{UserID: userID, FullName: "Trace Test", IsActive: true, CreatedAt: time.Now(), UpdatedAt: time.Now()}, nil
		},
	}
	router := setupTestRouter(svc)

	req := httptest.NewRequest(http.MethodGet, "/users/me", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	meta := resp["meta"].(map[string]interface{})
	if meta["trace_id"] != "test-trace-1" {
		t.Errorf("expected trace_id='test-trace-1' in meta, got %v", meta["trace_id"])
	}
}
