package handlers

import (
	"net/http"

	"mbg-backend/internal/models"
	"mbg-backend/internal/services"
	"mbg-backend/internal/utils"
	"mbg-backend/pkg/response"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// UserHandler handles user profile endpoints
type UserHandler struct {
	svc       services.UserServicer
	container *utils.Container
}

// NewUserHandler creates a new user handler
func NewUserHandler(c *utils.Container, svc services.UserServicer) *UserHandler {
	return &UserHandler{svc: svc, container: c}
}

// GetMe returns current user's profile
func (h *UserHandler) GetMe(c *gin.Context) {
	userID := h.container.GetUserIDFromContext(c)
	traceID := h.container.GetTraceIDFromContext(c)

	if userID == "" {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	p, err := h.svc.GetProfileForUser(c.Request.Context(), userID)
	if err != nil {
		if err == services.ErrForbidden {
			response.Forbidden(c, "Account deactivated")
			return
		}
		response.NotFound(c, "Profile not found")
		return
	}

	h.container.Logger.Info("profile.fetched", zap.String("user_id", userID), zap.String("trace_id", traceID))
	response.Success(c, p)
}

// UpdateMe updates current user's profile
func (h *UserHandler) UpdateMe(c *gin.Context) {
	userID := h.container.GetUserIDFromContext(c)
	traceID := h.container.GetTraceIDFromContext(c)

	if userID == "" {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	var in models.UserProfile
	if err := c.ShouldBindJSON(&in); err != nil {
		response.BadRequest(c, "Invalid payload", err.Error())
		return
	}

	out, err := h.svc.UpdateProfile(c.Request.Context(), userID, &in)
	if err != nil {
		if err == services.ErrValidation {
			response.BadRequest(c, "Validation failed", err.Error())
			return
		}
		if err == services.ErrForbidden {
			response.Forbidden(c, "Account deactivated")
			return
		}
		response.Error(c, http.StatusInternalServerError, "update_failed", err.Error())
		return
	}

	h.container.Logger.Info("profile.updated", zap.String("user_id", userID), zap.String("trace_id", traceID))
	response.Success(c, out)
}

// GetByID returns any user's profile (admin)
func (h *UserHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	p, err := h.svc.GetProfileByID(c.Request.Context(), id)
	if err != nil {
		response.NotFound(c, "Profile not found")
		return
	}
	response.Success(c, p)
}

// Deactivate soft-deactivates a user (admin)
func (h *UserHandler) Deactivate(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.BadRequest(c, "Missing id")
		return
	}
	if err := h.svc.DeactivateUser(c.Request.Context(), id); err != nil {
		response.Error(c, http.StatusInternalServerError, "deactivate_failed", err.Error())
		return
	}
	c.Status(http.StatusNoContent)
}
