package database

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"mbg-backend/internal/config"
	"mbg-backend/internal/models"

	"go.uber.org/zap"
)

// SupabaseClient wraps Supabase Auth operations
type SupabaseClient struct {
	projectURL string
	apiKey     string
	httpClient *http.Client
	logger     *zap.Logger
}

// NewSupabaseClient creates a new Supabase client
func NewSupabaseClient(cfg *config.SupabaseConfig, logger *zap.Logger) *SupabaseClient {
	return &SupabaseClient{
		projectURL: cfg.ProjectURL,
		apiKey:     cfg.APIKey,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
		logger: logger,
	}
}

// SignUp creates a new user account in Supabase Auth
func (sc *SupabaseClient) SignUp(ctx context.Context, email, password string) (*models.SupabaseAuthResponse, error) {
	if sc.projectURL == "" || sc.apiKey == "" {
		return nil, fmt.Errorf("Supabase credentials not configured")
	}

	url := fmt.Sprintf("%s/auth/v1/signup", sc.projectURL)

	payload := map[string]string{
		"email":    email,
		"password": password,
	}

	respBody, statusCode, err := sc.makeRequest(ctx, "POST", url, payload)
	if err != nil {
		sc.logger.Error("Supabase SignUp error", zap.Error(err))
		return nil, err
	}

	if statusCode != http.StatusOK {
		var errResp map[string]interface{}
		if err := json.Unmarshal(respBody, &errResp); err == nil {
			if msg, ok := errResp["message"].(string); ok {
				return nil, fmt.Errorf("signup failed: %s", msg)
			}
		}
		return nil, fmt.Errorf("signup failed with status %d", statusCode)
	}

	var authResp models.SupabaseAuthResponse
	if err := json.Unmarshal(respBody, &authResp); err != nil {
		sc.logger.Error("Failed to parse signup response", zap.Error(err))
		return nil, fmt.Errorf("failed to parse signup response")
	}

	return &authResp, nil
}

// SignIn authenticates a user with email and password
func (sc *SupabaseClient) SignIn(ctx context.Context, email, password string) (*models.SupabaseAuthResponse, error) {
	if sc.projectURL == "" || sc.apiKey == "" {
		return nil, fmt.Errorf("Supabase credentials not configured")
	}

	url := fmt.Sprintf("%s/auth/v1/token?grant_type=password", sc.projectURL)

	payload := map[string]string{
		"email":    email,
		"password": password,
	}

	respBody, statusCode, err := sc.makeRequest(ctx, "POST", url, payload)
	if err != nil {
		sc.logger.Error("Supabase SignIn error", zap.Error(err))
		return nil, err
	}

	if statusCode != http.StatusOK {
		var errResp map[string]interface{}
		if err := json.Unmarshal(respBody, &errResp); err == nil {
			if msg, ok := errResp["error_description"].(string); ok {
				return nil, fmt.Errorf("signin failed: %s", msg)
			}
		}
		return nil, fmt.Errorf("signin failed with status %d", statusCode)
	}

	var session models.SupabaseSession
	if err := json.Unmarshal(respBody, &session); err != nil {
		sc.logger.Error("Failed to parse signin response", zap.Error(err))
		return nil, fmt.Errorf("failed to parse signin response")
	}

	return &models.SupabaseAuthResponse{
		Session: &session,
		User:    session.User,
	}, nil
}

// RefreshToken refreshes an access token using a refresh token
func (sc *SupabaseClient) RefreshToken(ctx context.Context, refreshToken string) (*models.SupabaseSession, error) {
	if sc.projectURL == "" || sc.apiKey == "" {
		return nil, fmt.Errorf("Supabase credentials not configured")
	}

	url := fmt.Sprintf("%s/auth/v1/token?grant_type=refresh_token", sc.projectURL)

	payload := map[string]string{
		"refresh_token": refreshToken,
	}

	respBody, statusCode, err := sc.makeRequest(ctx, "POST", url, payload)
	if err != nil {
		sc.logger.Error("Supabase RefreshToken error", zap.Error(err))
		return nil, err
	}

	if statusCode != http.StatusOK {
		var errResp map[string]interface{}
		if err := json.Unmarshal(respBody, &errResp); err == nil {
			if msg, ok := errResp["error_description"].(string); ok {
				return nil, fmt.Errorf("token refresh failed: %s", msg)
			}
		}
		return nil, fmt.Errorf("token refresh failed with status %d", statusCode)
	}

	var session models.SupabaseSession
	if err := json.Unmarshal(respBody, &session); err != nil {
		sc.logger.Error("Failed to parse refresh response", zap.Error(err))
		return nil, fmt.Errorf("failed to parse refresh response")
	}

	return &session, nil
}

// SignOut signs out a user (invalidates refresh token)
func (sc *SupabaseClient) SignOut(ctx context.Context, accessToken string) error {
	if sc.projectURL == "" || sc.apiKey == "" {
		return fmt.Errorf("Supabase credentials not configured")
	}

	url := fmt.Sprintf("%s/auth/v1/logout", sc.projectURL)

	req, err := http.NewRequestWithContext(ctx, "POST", url, nil)
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	req.Header.Set("apikey", sc.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := sc.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("signout failed with status %d", resp.StatusCode)
	}

	return nil
}

// GetUser retrieves user information by access token
func (sc *SupabaseClient) GetUser(ctx context.Context, accessToken string) (*models.SupabaseUser, error) {
	if sc.projectURL == "" || sc.apiKey == "" {
		return nil, fmt.Errorf("Supabase credentials not configured")
	}

	url := fmt.Sprintf("%s/auth/v1/user", sc.projectURL)

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	req.Header.Set("apikey", sc.apiKey)

	resp, err := sc.httpClient.Do(req)
	if err != nil {
		sc.logger.Error("Supabase GetUser error", zap.Error(err))
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		sc.logger.Error("GetUser failed", zap.Int("status", resp.StatusCode))
		return nil, fmt.Errorf("get user failed with status %d", resp.StatusCode)
	}

	var user models.SupabaseUser
	if err := json.Unmarshal(body, &user); err != nil {
		sc.logger.Error("Failed to parse user response", zap.Error(err))
		return nil, fmt.Errorf("failed to parse user response")
	}

	return &user, nil
}

// UpdateUserMetadata updates user metadata
func (sc *SupabaseClient) UpdateUserMetadata(ctx context.Context, accessToken string, metadata map[string]interface{}) (*models.SupabaseUser, error) {
	if sc.projectURL == "" || sc.apiKey == "" {
		return nil, fmt.Errorf("Supabase credentials not configured")
	}

	url := fmt.Sprintf("%s/auth/v1/user", sc.projectURL)

	payload := map[string]interface{}{
		"user_metadata": metadata,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, "PUT", url, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	req.Header.Set("apikey", sc.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := sc.httpClient.Do(req)
	if err != nil {
		sc.logger.Error("Supabase UpdateUserMetadata error", zap.Error(err))
		return nil, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("update metadata failed with status %d", resp.StatusCode)
	}

	var user models.SupabaseUser
	if err := json.Unmarshal(respBody, &user); err != nil {
		return nil, fmt.Errorf("failed to parse update response")
	}

	return &user, nil
}

// makeRequest is a helper to make HTTP requests to Supabase
func (sc *SupabaseClient) makeRequest(ctx context.Context, method, url string, payload interface{}) ([]byte, int, error) {
	body, err := json.Marshal(payload)
	if err != nil {
		return nil, 0, err
	}

	req, err := http.NewRequestWithContext(ctx, method, url, bytes.NewReader(body))
	if err != nil {
		return nil, 0, err
	}

	req.Header.Set("apikey", sc.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := sc.httpClient.Do(req)
	if err != nil {
		return nil, 0, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, 0, err
	}

	return respBody, resp.StatusCode, nil
}
