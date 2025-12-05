package utils

import (
	"context"

	"mbg-backend/internal/config"
	"mbg-backend/internal/database"
	"mbg-backend/pkg/logger"

	"github.com/gin-gonic/gin"
)

// Container holds all application dependencies
type Container struct {
	Config *config.Config
	DB     *database.DB
	Logger *logger.Logger
	Engine *gin.Engine
}

// NewContainer creates and initializes a new dependency container
func NewContainer(ctx context.Context, cfg *config.Config, log *logger.Logger) (*Container, error) {
	// Initialize database
	db, err := database.New(ctx, &cfg.Database)
	if err != nil {
		return nil, err
	}

	// Create Gin engine
	engine := gin.Default()

	return &Container{
		Config: cfg,
		DB:     db,
		Logger: log,
		Engine: engine,
	}, nil
}

// Close gracefully closes all resources
func (c *Container) Close() error {
	if c.DB != nil {
		c.DB.Close()
	}

	if c.Logger != nil {
		_ = c.Logger.Sync()
	}

	return nil
}

// GetUserIDFromContext extracts user ID from context
func (c *Container) GetUserIDFromContext(ctx *gin.Context) string {
	userID, _ := ctx.Get("user_id")
	if id, ok := userID.(string); ok {
		return id
	}
	return ""
}

// GetUserRoleFromContext extracts user role from context
func (c *Container) GetUserRoleFromContext(ctx *gin.Context) string {
	userRole, _ := ctx.Get("user_role")
	if role, ok := userRole.(string); ok {
		return role
	}
	return ""
}

// GetTraceIDFromContext extracts trace ID from context
func (c *Container) GetTraceIDFromContext(ctx *gin.Context) string {
	traceID, _ := ctx.Get("trace_id")
	if id, ok := traceID.(string); ok {
		return id
	}
	return ""
}
