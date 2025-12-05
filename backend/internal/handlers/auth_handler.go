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

// AuthHandler handles authentication endpoints
type AuthHandler struct {
	authService *services.AuthService
	container   *utils.Container
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(container *utils.Container, authService *services.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		container:   container,
	}
}

// Register registers a new user
// POST /api/v1/auth/register
func (h *AuthHandler) Register(c *gin.Context) {
	var req models.RegisterRequest

	// Bind and validate request
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request format", err.Error())
		return
	}

	// Get trace ID
	traceID := h.container.GetTraceIDFromContext(c)

	// Call service
	h.container.Logger.Info("User registration attempt",
		zap.String("email", req.Email),
		zap.String("role", req.Role),
		zap.String("trace_id", traceID),
	)

	resp, err := h.authService.Register(c.Request.Context(), &req)
	if err != nil {
		h.container.Logger.Error("Registration failed",
			zap.String("email", req.Email),
			zap.Error(err),
			zap.String("trace_id", traceID),
		)
		response.BadRequest(c, "Registration failed", err.Error())
		return
	}

	h.container.Logger.Info("User registered successfully",
		zap.String("user_id", resp.User.ID),
		zap.String("email", req.Email),
		zap.String("trace_id", traceID),
	)

	response.Created(c, resp)
}

// Login authenticates a user
// POST /api/v1/auth/login
func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest

	// Bind and validate request
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request format", err.Error())
		return
	}

	// Get trace ID
	traceID := h.container.GetTraceIDFromContext(c)

	// Call service
	h.container.Logger.Info("User login attempt",
		zap.String("email", req.Email),
		zap.String("trace_id", traceID),
	)

	resp, err := h.authService.Login(c.Request.Context(), &req)
	if err != nil {
		h.container.Logger.Error("Login failed",
			zap.String("email", req.Email),
			zap.Error(err),
			zap.String("trace_id", traceID),
		)
		response.Unauthorized(c, "Login failed: invalid credentials")
		return
	}

	h.container.Logger.Info("User logged in successfully",
		zap.String("user_id", resp.User.ID),
		zap.String("email", req.Email),
		zap.String("trace_id", traceID),
	)

	response.Success(c, resp)
}

// RefreshToken refreshes an access token
// POST /api/v1/auth/refresh
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req models.RefreshTokenRequest

	// Bind and validate request
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request format", err.Error())
		return
	}

	// Get trace ID
	traceID := h.container.GetTraceIDFromContext(c)

	h.container.Logger.Info("Token refresh attempt", zap.String("trace_id", traceID))

	// Call service
	resp, err := h.authService.RefreshToken(c.Request.Context(), req.RefreshToken)
	if err != nil {
		h.container.Logger.Error("Token refresh failed",
			zap.Error(err),
			zap.String("trace_id", traceID),
		)
		response.Unauthorized(c, "Token refresh failed")
		return
	}

	h.container.Logger.Info("Token refreshed successfully", zap.String("trace_id", traceID))

	response.Success(c, resp)
}

// Logout logs out a user
// POST /api/v1/auth/logout
func (h *AuthHandler) Logout(c *gin.Context) {
	// Get user info from context
	userID := h.container.GetUserIDFromContext(c)
	traceID := h.container.GetTraceIDFromContext(c)

	if userID == "" {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Get access token from header
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		response.Unauthorized(c, "Missing authorization header")
		return
	}

	h.container.Logger.Info("User logout attempt",
		zap.String("user_id", userID),
		zap.String("trace_id", traceID),
	)

	// Call service to invalidate session
	err := h.authService.Logout(c.Request.Context(), authHeader)
	if err != nil {
		h.container.Logger.Error("Logout failed",
			zap.String("user_id", userID),
			zap.Error(err),
			zap.String("trace_id", traceID),
		)
		response.InternalServerError(c, "Logout failed")
		return
	}

	h.container.Logger.Info("User logged out successfully",
		zap.String("user_id", userID),
		zap.String("trace_id", traceID),
	)

	response.Success(c, models.LogoutResponse{
		Message: "Logged out successfully",
	})
}

// GetProfile gets the current user's profile
// GET /api/v1/auth/profile
func (h *AuthHandler) GetProfile(c *gin.Context) {
	// Get user info from context
	userID := h.container.GetUserIDFromContext(c)
	traceID := h.container.GetTraceIDFromContext(c)

	if userID == "" {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	h.container.Logger.Info("Fetching user profile",
		zap.String("user_id", userID),
		zap.String("trace_id", traceID),
	)

	// Get user from service
	user, err := h.authService.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		h.container.Logger.Error("Failed to get user profile",
			zap.String("user_id", userID),
			zap.Error(err),
			zap.String("trace_id", traceID),
		)
		response.NotFound(c, "User not found")
		return
	}

	response.Success(c, user)
}

// UpdateProfile updates the current user's profile
// PUT /api/v1/auth/profile
func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	// Get user info from context
	userID := h.container.GetUserIDFromContext(c)
	traceID := h.container.GetTraceIDFromContext(c)

	if userID == "" {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	var req struct {
		FullName    string `json:"full_name"`
		PhoneNumber string `json:"phone_number"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request format", err.Error())
		return
	}

	h.container.Logger.Info("Updating user profile",
		zap.String("user_id", userID),
		zap.String("trace_id", traceID),
	)

	// Call service
	err := h.authService.UpdateUserProfile(c.Request.Context(), userID, req.FullName, req.PhoneNumber)
	if err != nil {
		h.container.Logger.Error("Failed to update profile",
			zap.String("user_id", userID),
			zap.Error(err),
			zap.String("trace_id", traceID),
		)
		response.BadRequest(c, "Profile update failed", err.Error())
		return
	}

	h.container.Logger.Info("User profile updated successfully",
		zap.String("user_id", userID),
		zap.String("trace_id", traceID),
	)

	// Fetch updated profile
	user, _ := h.authService.GetUserByID(c.Request.Context(), userID)
	response.Success(c, user)
}

// ChangePassword changes the user's password
// POST /api/v1/auth/change-password
func (h *AuthHandler) ChangePassword(c *gin.Context) {
	// Get user info from context
	userID := h.container.GetUserIDFromContext(c)
	traceID := h.container.GetTraceIDFromContext(c)

	if userID == "" {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	var req models.ChangePasswordRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request format", err.Error())
		return
	}

	h.container.Logger.Info("Password change attempt",
		zap.String("user_id", userID),
		zap.String("trace_id", traceID),
	)

	// Call service
	err := h.authService.ChangePassword(c.Request.Context(), userID, &req)
	if err != nil {
		h.container.Logger.Error("Password change failed",
			zap.String("user_id", userID),
			zap.Error(err),
			zap.String("trace_id", traceID),
		)
		response.BadRequest(c, "Password change failed", err.Error())
		return
	}

	h.container.Logger.Info("Password changed successfully",
		zap.String("user_id", userID),
		zap.String("trace_id", traceID),
	)

	response.Success(c, map[string]string{
		"message": "Password changed successfully",
	})
}

// VerifyEmail verifies a user's email
// POST /api/v1/auth/verify-email
func (h *AuthHandler) VerifyEmail(c *gin.Context) {
	// Get user info from context
	userID := h.container.GetUserIDFromContext(c)
	traceID := h.container.GetTraceIDFromContext(c)

	if userID == "" {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	h.container.Logger.Info("Email verification attempt",
		zap.String("user_id", userID),
		zap.String("trace_id", traceID),
	)

	// Call service (in production, this would check a verification token)
	err := h.authService.VerifyEmail(c.Request.Context(), userID)
	if err != nil {
		h.container.Logger.Error("Email verification failed",
			zap.String("user_id", userID),
			zap.Error(err),
			zap.String("trace_id", traceID),
		)
		response.BadRequest(c, "Email verification failed", err.Error())
		return
	}

	h.container.Logger.Info("Email verified successfully",
		zap.String("user_id", userID),
		zap.String("trace_id", traceID),
	)

	response.Success(c, models.VerifyEmailResponse{
		Message: "Email verified successfully",
	})
}

// HealthCheck is a simple health check endpoint for authenticated users
// GET /api/v1/auth/health
func (h *AuthHandler) HealthCheck(c *gin.Context) {
	userID := h.container.GetUserIDFromContext(c)
	userRole := h.container.GetUserRoleFromContext(c)

	response.Success(c, map[string]interface{}{
		"status":    "authenticated",
		"user_id":   userID,
		"user_role": userRole,
		"timestamp": c.GetInt64("timestamp"),
	}, http.StatusOK)
}
