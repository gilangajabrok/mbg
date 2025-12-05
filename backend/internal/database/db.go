package database

import (
	"context"
	"fmt"
	"time"

	"mbg-backend/internal/config"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

// DB wraps pgxpool.Pool with additional functionality
type DB struct {
	pool *pgxpool.Pool
}

// New creates a new database connection pool
func New(ctx context.Context, cfg *config.DatabaseConfig) (*DB, error) {
	// Create connection pool config
	poolConfig, err := pgxpool.ParseConfig(formatDSN(cfg))
	if err != nil {
		return nil, fmt.Errorf("unable to parse database config: %w", err)
	}

	// Set connection pool settings
	poolConfig.MaxConns = int32(cfg.MaxConnections)
	poolConfig.MinConns = int32(cfg.MinConnections)
	poolConfig.MaxConnLifetime = cfg.ConnMaxLifetime
	poolConfig.MaxConnIdleTime = cfg.ConnMaxIdleTime
	poolConfig.HealthCheckPeriod = 30 * time.Second

	// Create the connection pool
	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		return nil, fmt.Errorf("unable to create connection pool: %w", err)
	}

	// Test the connection
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("unable to ping database: %w", err)
	}

	return &DB{pool: pool}, nil
}

// Close closes the database connection pool
func (db *DB) Close() {
	if db.pool != nil {
		db.pool.Close()
	}
}

// Pool returns the underlying pgxpool.Pool
func (db *DB) Pool() *pgxpool.Pool {
	return db.pool
}

// Ping pings the database
func (db *DB) Ping(ctx context.Context) error {
	return db.pool.Ping(ctx)
}

// Health returns database health status
func (db *DB) Health(ctx context.Context) map[string]interface{} {
	stat := db.pool.Stat()
	return map[string]interface{}{
		"status": "healthy",
		"connections": map[string]interface{}{
			"acquired":    stat.AcquiredConns(),
			"idle":        stat.IdleConns(),
			"total":       stat.TotalConns(),
			"constructed": stat.ConstructingConns(),
		},
	}
}

// formatDSN creates a PostgreSQL DSN from config
func formatDSN(cfg *config.DatabaseConfig) string {
	dsn := fmt.Sprintf(
		"postgresql://%s:%s@%s:%d/%s",
		cfg.User,
		cfg.Password,
		cfg.Host,
		cfg.Port,
		cfg.Database,
	)

	// Add SSL mode
	if cfg.SSLMode != "" {
		dsn += fmt.Sprintf("?sslmode=%s", cfg.SSLMode)
	}

	return dsn
}

// Migration utilities
func (db *DB) RunMigrations(ctx context.Context, migrationSQL string) error {
	_, err := db.pool.Exec(ctx, migrationSQL)
	if err != nil {
		return fmt.Errorf("unable to run migrations: %w", err)
	}
	return nil
}

// Query helpers for common operations
func (db *DB) QueryRow(ctx context.Context, sql string, args ...interface{}) pgx.Row {
	return db.pool.QueryRow(ctx, sql, args...)
}

func (db *DB) Query(ctx context.Context, sql string, args ...interface{}) (pgx.Rows, error) {
	return db.pool.Query(ctx, sql, args...)
}

func (db *DB) Exec(ctx context.Context, sql string, args ...interface{}) (pgconn.CommandTag, error) {
	return db.pool.Exec(ctx, sql, args...)
}
