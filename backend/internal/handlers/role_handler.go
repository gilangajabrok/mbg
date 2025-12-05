package handlers

import (
	"net/http"

	"mbg-backend/internal/services"
	"mbg-backend/internal/utils"
	"mbg-backend/pkg/response"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// RoleHandler handles role management endpoints (super admin only)
type RoleHandler struct {
	svc       *services.RoleService
	container *utils.Container
}

// NewRoleHandler creates a new RoleHandler
func NewRoleHandler(c *utils.Container, svc *services.RoleService) *RoleHandler {
	return &RoleHandler{svc: svc, container: c}
}

// ListRoles returns supported roles
func (h *RoleHandler) ListRoles(c *gin.Context) {
	ctx := c.Request.Context()
	roles, err := h.svc.ListRoles(ctx)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "list_roles_failed", err.Error())
		return
	}
	response.Success(c, roles)
}

// GetUserRole returns the role for a user id
func (h *RoleHandler) GetUserRole(c *gin.Context) {
	userID := c.Param("id")
	if userID == "" {
		response.BadRequest(c, "Missing user id")
		return
	}
	role, err := h.svc.GetUserRole(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "get_role_failed", err.Error())
		return
	}
	response.Success(c, map[string]string{"role": role})
}

// SetUserRole assigns or updates a user's role
func (h *RoleHandler) SetUserRole(c *gin.Context) {
	userID := c.Param("id")
	if userID == "" {
		response.BadRequest(c, "Missing user id")
		return
	}

	var body struct {
		Role string `json:"role" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		response.BadRequest(c, "Invalid payload", err.Error())
		return
	}

	if err := h.svc.SetUserRole(c.Request.Context(), userID, body.Role); err != nil {
		response.Error(c, http.StatusBadRequest, "set_role_failed", err.Error())
		return
	}

	h.container.Logger.Info("role.updated", zap.String("user_id", userID), zap.String("role", body.Role))
	c.Status(http.StatusNoContent)
}

// DeleteUserRole resets the user's role to default 'parent'
func (h *RoleHandler) DeleteUserRole(c *gin.Context) {
	userID := c.Param("id")
	if userID == "" {
		response.BadRequest(c, "Missing user id")
		return
	}
	if err := h.svc.SetUserRole(c.Request.Context(), userID, "parent"); err != nil {
		response.Error(c, http.StatusInternalServerError, "reset_role_failed", err.Error())
		return
	}
	h.container.Logger.Info("role.reset", zap.String("user_id", userID))
	c.Status(http.StatusNoContent)
}
