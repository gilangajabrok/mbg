package models

import "time"

// ===== Authentication Request Models =====

// LoginRequest represents a login request
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// RegisterRequest represents a registration request
type RegisterRequest struct {
	Email           string `json:"email" binding:"required,email"`
	Password        string `json:"password" binding:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" binding:"required,min=8"`
	FullName        string `json:"full_name" binding:"required,min=2"`
	Role            string `json:"role" binding:"required,oneof=parent supplier admin"`
	PhoneNumber     string `json:"phone_number" binding:"omitempty,min=10"`
}

// RefreshTokenRequest represents a token refresh request
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// VerifyEmailRequest represents an email verification request
type VerifyEmailRequest struct {
	Email string `json:"email" binding:"required,email"`
	Token string `json:"token" binding:"required"`
}

// ForgotPasswordRequest represents a forgot password request
type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// ResetPasswordRequest represents a password reset request
type ResetPasswordRequest struct {
	Email           string `json:"email" binding:"required,email"`
	Token           string `json:"token" binding:"required"`
	Password        string `json:"password" binding:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" binding:"required,min=8"`
}

// ChangePasswordRequest represents a password change request
type ChangePasswordRequest struct {
	OldPassword     string `json:"old_password" binding:"required,min=6"`
	NewPassword     string `json:"new_password" binding:"required,min=8"`
	ConfirmPassword string `json:"confirm_password" binding:"required,min=8"`
}

// ===== Authentication Response Models =====

// LoginResponse represents a login response
type LoginResponse struct {
	User         *UserResponse `json:"user"`
	AccessToken  string        `json:"access_token"`
	RefreshToken string        `json:"refresh_token"`
	ExpiresIn    int64         `json:"expires_in"` // In seconds
	TokenType    string        `json:"token_type"` // "Bearer"
}

// RegisterResponse represents a registration response
type RegisterResponse struct {
	User         *UserResponse `json:"user"`
	AccessToken  string        `json:"access_token"`
	RefreshToken string        `json:"refresh_token"`
	ExpiresIn    int64         `json:"expires_in"`
	TokenType    string        `json:"token_type"`
	Message      string        `json:"message"`
}

// RefreshTokenResponse represents a token refresh response
type RefreshTokenResponse struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int64  `json:"expires_in"`
	TokenType   string `json:"token_type"`
}

// VerifyEmailResponse represents an email verification response
type VerifyEmailResponse struct {
	Message string `json:"message"`
	Email   string `json:"email"`
}

// LogoutResponse represents a logout response
type LogoutResponse struct {
	Message string `json:"message"`
}

// UserResponse represents a user in API responses
type UserResponse struct {
	ID             string     `json:"id"`
	Email          string     `json:"email"`
	FullName       string     `json:"full_name,omitempty"`
	PhoneNumber    string     `json:"phone_number,omitempty"`
	Role           string     `json:"role"`
	Status         string     `json:"status"`
	IsVerified     bool       `json:"is_verified"`
	CreatedAt      time.Time  `json:"created_at"`
	LastLoginAt    *time.Time `json:"last_login_at,omitempty"`
	ProfilePicture string     `json:"profile_picture,omitempty"`
}

// ===== Token Claims =====

// TokenClaims represents JWT token claims
type TokenClaims struct {
	UserID    string `json:"sub"` // Subject (user ID)
	Email     string `json:"email"`
	Role      string `json:"role"`
	ExpiresAt int64  `json:"exp"`
	IssuedAt  int64  `json:"iat"`
	NotBefore int64  `json:"nbf"`
}

// ===== Error Response =====

// AuthError represents an authentication error
type AuthError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
}

// AuthErrorResponse represents an error response from auth
type AuthErrorResponse struct {
	Success bool       `json:"success"`
	Error   *AuthError `json:"error"`
}

// ===== Internal Models =====

// AuthUser represents an authenticated user
type AuthUser struct {
	ID         string
	Email      string
	Role       string
	IsVerified bool
	SupabaseID string // Supabase user ID
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

// SupabaseAuthResponse represents Supabase auth response
type SupabaseAuthResponse struct {
	User         *SupabaseUser    `json:"user"`
	Session      *SupabaseSession `json:"session"`
	WeakPassword *WeakPassword    `json:"weak_password,omitempty"`
}

// SupabaseUser represents a Supabase user
type SupabaseUser struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	Role      string `json:"user_metadata"`
	Aud       string `json:"aud"`
	Confirmed bool   `json:"email_confirmed_at"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

// SupabaseSession represents a Supabase session
type SupabaseSession struct {
	AccessToken  string        `json:"access_token"`
	RefreshToken string        `json:"refresh_token"`
	ExpiresIn    int           `json:"expires_in"`
	TokenType    string        `json:"token_type"`
	User         *SupabaseUser `json:"user"`
}

// WeakPassword represents weak password warnings
type WeakPassword struct {
	Message string `json:"message"`
}
