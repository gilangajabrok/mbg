package services

import (
	"context"
	"fmt"
	"os"
	"time"

	"mbg-backend/internal/database"
	"mbg-backend/internal/models"
	"mbg-backend/internal/utils"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

// AuthService handles authentication operations
type AuthService struct {
	db        *pgxpool.Pool
	supabase  *database.SupabaseClient
	logger    *zap.Logger
	jwtSecret string
}

// NewAuthService creates a new auth service
func NewAuthService(
	db *pgxpool.Pool,
	supabase *database.SupabaseClient,
	logger *zap.Logger,
	jwtSecret string,
) *AuthService {
	return &AuthService{
		db:        db,
		supabase:  supabase,
		logger:    logger,
		jwtSecret: jwtSecret,
	}
}

// Register creates a new user account
func (as *AuthService) Register(ctx context.Context, req *models.RegisterRequest) (*models.RegisterResponse, error) {
	// Validate input
	valid, errMsg := utils.ValidateRegisterRequest(
		req.Email, req.Password, req.ConfirmPassword, req.FullName, req.Role,
	)
	if !valid {
		return nil, fmt.Errorf(errMsg)
	}

	// Sanitize email
	email := utils.SanitizeEmail(req.Email)

	// Check if user already exists in our database
	var existingUserID string
	err := as.db.QueryRow(ctx, "SELECT id FROM public.users WHERE email = $1", email).Scan(&existingUserID)
	if err == nil {
		// User already exists
		return nil, fmt.Errorf("email already registered")
	}

	// Create user in Supabase Auth
	authResp, err := as.supabase.SignUp(ctx, email, req.Password)
	if err != nil {
		as.logger.Error("Supabase signup failed", zap.Error(err))
		return nil, fmt.Errorf("registration failed: %v", err)
	}

	if authResp.User == nil {
		return nil, fmt.Errorf("registration failed: no user returned")
	}

	supabaseUserID := authResp.User.ID

	// Create user in our database
	now := time.Now()
	err = as.db.QueryRow(ctx,
		`INSERT INTO public.users 
		(id, email, full_name, phone_number, role, status, is_verified, created_at, updated_at) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id`,
		supabaseUserID, email, req.FullName, req.PhoneNumber, req.Role, "pending_verification", false, now, now,
	).Scan(&supabaseUserID)

	if err != nil {
		as.logger.Error("Failed to create user in database", zap.Error(err))
		return nil, fmt.Errorf("registration failed: could not save user")
	}

	// Build response
	userResp := &models.UserResponse{
		ID:         supabaseUserID,
		Email:      email,
		FullName:   req.FullName,
		Role:       req.Role,
		Status:     "pending_verification",
		IsVerified: false,
		CreatedAt:  now,
	}

	return &models.RegisterResponse{
		User:         userResp,
		AccessToken:  authResp.Session.AccessToken,
		RefreshToken: authResp.Session.RefreshToken,
		ExpiresIn:    int64(authResp.Session.ExpiresIn),
		TokenType:    "Bearer",
		Message:      "Registration successful. Please verify your email.",
	}, nil
}

// Login authenticates a user
func (as *AuthService) Login(ctx context.Context, req *models.LoginRequest) (*models.LoginResponse, error) {
	// Validate input
	valid, errMsg := utils.ValidateLoginRequest(req.Email, req.Password)
	if !valid {
		return nil, fmt.Errorf(errMsg)
	}

	// Dev-only super admin bypass for local access when Supabase is unavailable
	if as.devSuperAdminEnabled() {
		if resp, ok := as.tryDevSuperAdminLogin(req.Email, req.Password); ok {
			return resp, nil
		}
	}

	// Sanitize email
	email := utils.SanitizeEmail(req.Email)

	// Authenticate with Supabase
	authResp, err := as.supabase.SignIn(ctx, email, req.Password)
	if err != nil {
		as.logger.Error("Supabase signin failed", zap.Error(err))
		return nil, fmt.Errorf("login failed: invalid credentials")
	}

	if authResp.Session == nil || authResp.Session.User == nil {
		return nil, fmt.Errorf("login failed: no session returned")
	}

	supabaseUserID := authResp.Session.User.ID

	// Get or create user in our database
	var userID string
	var userRole string
	var userStatus string
	var isVerified bool

	err = as.db.QueryRow(ctx,
		"SELECT id, role, status, is_verified FROM public.users WHERE id = $1",
		supabaseUserID,
	).Scan(&userID, &userRole, &userStatus, &isVerified)

	if err != nil {
		// User doesn't exist in our DB, create minimal entry
		as.logger.Warn("User not found in database, creating entry", zap.String("supabase_id", supabaseUserID))

		now := time.Now()
		err = as.db.QueryRow(ctx,
			`INSERT INTO public.users (id, email, role, status, is_verified, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING id, role, status, is_verified`,
			supabaseUserID, email, "parent", "active", false, now, now,
		).Scan(&userID, &userRole, &userStatus, &isVerified)

		if err != nil {
			as.logger.Error("Failed to create user in database", zap.Error(err))
			return nil, fmt.Errorf("login failed: could not create user record")
		}
	}

	// Update last login timestamp
	now := time.Now()
	_, err = as.db.Exec(ctx,
		"UPDATE public.users SET last_login_at = $1 WHERE id = $2",
		now, userID,
	)
	if err != nil {
		as.logger.Error("Failed to update last login", zap.Error(err))
	}

	// Build response
	userResp := &models.UserResponse{
		ID:          userID,
		Email:       email,
		Role:        userRole,
		Status:      userStatus,
		IsVerified:  isVerified,
		CreatedAt:   time.Now(),
		LastLoginAt: &now,
	}

	return &models.LoginResponse{
		User:         userResp,
		AccessToken:  authResp.Session.AccessToken,
		RefreshToken: authResp.Session.RefreshToken,
		ExpiresIn:    int64(authResp.Session.ExpiresIn),
		TokenType:    "Bearer",
	}, nil
}

// devSuperAdminEnabled checks if the bypass credentials are configured
func (as *AuthService) devSuperAdminEnabled() bool {
	return os.Getenv("SUPERADMIN_EMAIL") != "" && os.Getenv("SUPERADMIN_PASSWORD") != ""
}

// tryDevSuperAdminLogin returns a login response if the provided credentials match the bypass values
func (as *AuthService) tryDevSuperAdminLogin(email, password string) (*models.LoginResponse, bool) {
	devEmail := os.Getenv("SUPERADMIN_EMAIL")
	devPass := os.Getenv("SUPERADMIN_PASSWORD")

	if email != devEmail || password != devPass {
		return nil, false
	}

	now := time.Now()
	expiresAt := now.Add(24 * time.Hour)

	claims := jwt.MapClaims{
		"sub":   "dev-super-admin",
		"email": devEmail,
		"role":  "super_admin",
		"exp":   expiresAt.Unix(),
		"iat":   now.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(as.jwtSecret))
	if err != nil {
		as.logger.Error("Failed to sign dev super admin token", zap.Error(err))
		return nil, false
	}

	userResp := &models.UserResponse{
		ID:         "dev-super-admin",
		Email:      devEmail,
		Role:       "super_admin",
		Status:     "active",
		IsVerified: true,
		CreatedAt:  now,
		LastLoginAt: func(t time.Time) *time.Time {
			return &t
		}(now),
	}

	return &models.LoginResponse{
		User:         userResp,
		AccessToken:  signed,
		RefreshToken: "",
		ExpiresIn:    int64(expiresAt.Sub(now).Seconds()),
		TokenType:    "Bearer",
	}, true
}

// RefreshToken refreshes an access token
func (as *AuthService) RefreshToken(ctx context.Context, refreshToken string) (*models.RefreshTokenResponse, error) {
	if refreshToken == "" {
		return nil, fmt.Errorf("refresh token is required")
	}

	session, err := as.supabase.RefreshToken(ctx, refreshToken)
	if err != nil {
		as.logger.Error("Supabase token refresh failed", zap.Error(err))
		return nil, fmt.Errorf("token refresh failed: %v", err)
	}

	if session == nil {
		return nil, fmt.Errorf("token refresh failed: no session returned")
	}

	return &models.RefreshTokenResponse{
		AccessToken: session.AccessToken,
		ExpiresIn:   int64(session.ExpiresIn),
		TokenType:   "Bearer",
	}, nil
}

// GetUserByID retrieves a user by ID from database
func (as *AuthService) GetUserByID(ctx context.Context, userID string) (*models.UserResponse, error) {
	var user models.UserResponse
	var createdAt time.Time
	var lastLoginAt *time.Time

	err := as.db.QueryRow(ctx,
		`SELECT id, email, full_name, phone_number, role, status, is_verified, profile_picture_url, created_at, last_login_at
		FROM public.users WHERE id = $1`,
		userID,
	).Scan(
		&user.ID, &user.Email, &user.FullName, &user.PhoneNumber,
		&user.Role, &user.Status, &user.IsVerified, &user.ProfilePicture,
		&createdAt, &lastLoginAt,
	)

	if err != nil {
		as.logger.Error("Failed to get user", zap.Error(err))
		return nil, fmt.Errorf("user not found")
	}

	user.CreatedAt = createdAt
	user.LastLoginAt = lastLoginAt

	return &user, nil
}

// VerifyEmail marks a user as verified
func (as *AuthService) VerifyEmail(ctx context.Context, userID string) error {
	result, err := as.db.Exec(ctx,
		"UPDATE public.users SET is_verified = true, status = 'active' WHERE id = $1",
		userID,
	)

	if err != nil {
		as.logger.Error("Failed to verify email", zap.Error(err))
		return fmt.Errorf("email verification failed")
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}

// ChangePassword changes user password (requires old password verification)
func (as *AuthService) ChangePassword(ctx context.Context, userID string, req *models.ChangePasswordRequest) error {
	// Validate input
	valid, errMsg := utils.ValidateChangePasswordRequest(
		req.OldPassword, req.NewPassword, req.ConfirmPassword,
	)
	if !valid {
		return fmt.Errorf(errMsg)
	}

	// Get user email
	var email string
	err := as.db.QueryRow(ctx, "SELECT email FROM public.users WHERE id = $1", userID).Scan(&email)
	if err != nil {
		return fmt.Errorf("user not found")
	}

	// Verify old password by attempting login
	_, err = as.supabase.SignIn(ctx, email, req.OldPassword)
	if err != nil {
		return fmt.Errorf("current password is incorrect")
	}

	// In production, you would update password in Supabase Admin API
	// For now, we log the requirement
	as.logger.Info("Password change requested", zap.String("user_id", userID))

	return nil
}

// UpdateUserProfile updates user profile information
func (as *AuthService) UpdateUserProfile(ctx context.Context, userID string, fullName, phoneNumber string) error {
	if fullName != "" && !utils.ValidateFullName(fullName) {
		return fmt.Errorf("invalid full name")
	}

	if phoneNumber != "" && !utils.ValidatePhoneNumber(phoneNumber) {
		return fmt.Errorf("invalid phone number")
	}

	query := "UPDATE public.users SET "
	args := []interface{}{}
	paramCount := 1

	if fullName != "" {
		query += fmt.Sprintf("full_name = $%d, ", paramCount)
		args = append(args, fullName)
		paramCount++
	}

	if phoneNumber != "" {
		query += fmt.Sprintf("phone_number = $%d, ", paramCount)
		args = append(args, phoneNumber)
		paramCount++
	}

	query += fmt.Sprintf("updated_at = $%d WHERE id = $%d", paramCount, paramCount+1)
	args = append(args, time.Now(), userID)

	result, err := as.db.Exec(ctx, query, args...)
	if err != nil {
		as.logger.Error("Failed to update user profile", zap.Error(err))
		return fmt.Errorf("profile update failed")
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}

// Logout invalidates a user session (requires Supabase integration)
func (as *AuthService) Logout(ctx context.Context, accessToken string) error {
	err := as.supabase.SignOut(ctx, accessToken)
	if err != nil {
		as.logger.Error("Supabase logout failed", zap.Error(err))
		return fmt.Errorf("logout failed")
	}

	return nil
}
