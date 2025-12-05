package config

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all application configuration
type Config struct {
	// Server
	Server ServerConfig

	// Database
	Database DatabaseConfig

	// JWT
	JWT JWTConfig

	// Supabase
	Supabase SupabaseConfig

	// Environment
	Environment string
	LogLevel    string
}

// ServerConfig holds server configuration
type ServerConfig struct {
	Port         int
	Host         string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration
}

// DatabaseConfig holds database configuration
type DatabaseConfig struct {
	Host            string
	Port            int
	User            string
	Password        string
	Database        string
	SSLMode         string
	MaxConnections  int
	MinConnections  int
	ConnMaxLifetime time.Duration
	ConnMaxIdleTime time.Duration
}

// JWTConfig holds JWT configuration
type JWTConfig struct {
	Secret             string
	AccessTokenExpiry  time.Duration
	RefreshTokenExpiry time.Duration
	SupabaseJWKSURL    string
}

// SupabaseConfig holds Supabase configuration
type SupabaseConfig struct {
	ProjectURL string
	APIKey     string
	JWTSecret  string
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if it exists
	_ = godotenv.Load()

	cfg := &Config{
		Environment: getEnv("ENVIRONMENT", "development"),
		LogLevel:    getEnv("LOG_LEVEL", "info"),

		Server: ServerConfig{
			Port:         getEnvInt("SERVER_PORT", 8080),
			Host:         getEnv("SERVER_HOST", "0.0.0.0"),
			ReadTimeout:  getEnvDuration("SERVER_READ_TIMEOUT", 15*time.Second),
			WriteTimeout: getEnvDuration("SERVER_WRITE_TIMEOUT", 15*time.Second),
			IdleTimeout:  getEnvDuration("SERVER_IDLE_TIMEOUT", 60*time.Second),
		},

		Database: DatabaseConfig{
			Host:            getEnv("DB_HOST", "localhost"),
			Port:            getEnvInt("DB_PORT", 5432),
			User:            getEnv("DB_USER", "postgres"),
			Password:        getEnv("DB_PASSWORD", ""),
			Database:        getEnv("DB_NAME", "mbg"),
			SSLMode:         getEnv("DB_SSL_MODE", "disable"),
			MaxConnections:  getEnvInt("DB_MAX_CONNECTIONS", 25),
			MinConnections:  getEnvInt("DB_MIN_CONNECTIONS", 5),
			ConnMaxLifetime: getEnvDuration("DB_CONN_MAX_LIFETIME", 5*time.Minute),
			ConnMaxIdleTime: getEnvDuration("DB_CONN_MAX_IDLE_TIME", 2*time.Minute),
		},

		JWT: JWTConfig{
			Secret:             getEnv("JWT_SECRET", "your-secret-key-change-this"),
			AccessTokenExpiry:  getEnvDuration("JWT_ACCESS_TOKEN_EXPIRY", 15*time.Minute),
			RefreshTokenExpiry: getEnvDuration("JWT_REFRESH_TOKEN_EXPIRY", 7*24*time.Hour),
			SupabaseJWKSURL:    getEnv("SUPABASE_JWKS_URL", ""),
		},

		Supabase: SupabaseConfig{
			ProjectURL: getEnv("SUPABASE_URL", ""),
			APIKey:     getEnv("SUPABASE_API_KEY", ""),
			JWTSecret:  getEnv("SUPABASE_JWT_SECRET", ""),
		},
	}

	// Validate required configuration
	if err := cfg.Validate(); err != nil {
		return nil, err
	}

	return cfg, nil
}

// Validate validates critical configuration
func (c *Config) Validate() error {
	// Database configuration
	if c.Database.Host == "" {
		return fmt.Errorf("DB_HOST is required")
	}
	if c.Database.User == "" {
		return fmt.Errorf("DB_USER is required")
	}
	if c.Database.Database == "" {
		return fmt.Errorf("DB_NAME is required")
	}

	// Supabase configuration (required for production)
	if c.Environment == "production" {
		if c.Supabase.ProjectURL == "" {
			return fmt.Errorf("SUPABASE_URL is required in production")
		}
		if c.JWT.SupabaseJWKSURL == "" {
			return fmt.Errorf("SUPABASE_JWKS_URL is required in production")
		}
	}

	return nil
}

// GetDSN returns PostgreSQL DSN connection string
func (c *Config) GetDSN() string {
	return fmt.Sprintf(
		"postgresql://%s:%s@%s:%d/%s?sslmode=%s",
		c.Database.User,
		c.Database.Password,
		c.Database.Host,
		c.Database.Port,
		c.Database.Database,
		c.Database.SSLMode,
	)
}

// Helper functions
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func getEnvDuration(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}
