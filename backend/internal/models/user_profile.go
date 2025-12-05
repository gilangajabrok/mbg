package models

import "time"

// UserProfile represents profile metadata separate from auth credentials
type UserProfile struct {
	UserID    string                 `json:"user_id" db:"user_id"`
	FullName  string                 `json:"full_name" db:"full_name" binding:"required"`
	Phone     string                 `json:"phone,omitempty" db:"phone"`
	Address   string                 `json:"address,omitempty" db:"address"`
	AvatarURL string                 `json:"avatar_url,omitempty" db:"avatar_url"`
	Metadata  map[string]interface{} `json:"metadata,omitempty" db:"metadata"`
	IsActive  bool                   `json:"is_active" db:"is_active"`
	CreatedAt time.Time              `json:"created_at" db:"created_at"`
	UpdatedAt time.Time              `json:"updated_at" db:"updated_at"`
}
