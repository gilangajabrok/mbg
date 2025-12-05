package middleware

import (
	"fmt"
	"strings"
	"time"

	"mbg-backend/pkg/logger"
	"mbg-backend/pkg/response"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

// LoggingMiddleware logs HTTP requests and responses
func LoggingMiddleware(log *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Generate trace ID
		traceID := uuid.New().String()
		c.Set("trace_id", traceID)

		// Start time
		startTime := time.Now()
		startWallTime := time.Now().Unix()

		// Log request
		log.Info("HTTP request started",
			zap.String("trace_id", traceID),
			zap.String("method", c.Request.Method),
			zap.String("path", c.Request.URL.Path),
			zap.String("query", c.Request.URL.RawQuery),
			zap.String("ip", c.ClientIP()),
			zap.String("user_agent", c.Request.UserAgent()),
		)

		// Process request
		c.Next()

		// Calculate latency
		latency := time.Since(startTime)

		// Log response
		log.Info("HTTP request completed",
			zap.String("trace_id", traceID),
			zap.String("method", c.Request.Method),
			zap.String("path", c.Request.URL.Path),
			zap.Int("status_code", c.Writer.Status()),
			zap.Int("response_size", c.Writer.Size()),
			zap.Duration("latency", latency),
			zap.Int64("timestamp", startWallTime),
		)

		// Log errors if any
		if len(c.Errors) > 0 {
			for _, err := range c.Errors {
				log.Error("Request error",
					zap.String("trace_id", traceID),
					zap.String("error", err.Error()),
				)
			}
		}
	}
}

// ErrorHandlingMiddleware handles panics and errors
func ErrorHandlingMiddleware(log *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				traceID, _ := c.Get("trace_id")
				log.Error("Panic recovered",
					zap.String("trace_id", fmt.Sprintf("%v", traceID)),
					zap.Any("error", err),
				)
				response.InternalServerError(c, "An unexpected error occurred")
			}
		}()
		c.Next()
	}
}

// CORSMiddleware handles CORS headers
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// RequestIDMiddleware adds request ID to context
func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			requestID = uuid.New().String()
		}
		c.Set("request_id", requestID)
		c.Writer.Header().Set("X-Request-ID", requestID)
		c.Next()
	}
}

// TimeoutMiddleware sets request timeout
func TimeoutMiddleware(timeout time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request.Header.Set("X-Request-Timeout", fmt.Sprintf("%d", int(timeout.Seconds())))
		c.Next()
	}
}

// AuthMiddleware validates JWT token
func AuthMiddleware(secretKey string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Unauthorized(c, "Missing authorization header")
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.Unauthorized(c, "Invalid authorization header format")
			c.Abort()
			return
		}

		tokenString := parts[1]

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(secretKey), nil
		})

		if err != nil || !token.Valid {
			response.Unauthorized(c, "Invalid or expired token")
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			response.Unauthorized(c, "Invalid token claims")
			c.Abort()
			return
		}

		// Store claims in context
		c.Set("user_id", claims["sub"])
		c.Set("user_role", claims["role"])
		c.Set("user_email", claims["email"])

		c.Next()
	}
}

// RoleGuardMiddleware checks if user has required role
func RoleGuardMiddleware(requiredRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("user_role")
		if !exists {
			response.Forbidden(c, "User role not found in token")
			c.Abort()
			return
		}

		roleStr, ok := userRole.(string)
		if !ok {
			response.Forbidden(c, "Invalid user role format")
			c.Abort()
			return
		}

		// Check if user role is in required roles
		allowed := false
		for _, role := range requiredRoles {
			if roleStr == role {
				allowed = true
				break
			}
		}

		if !allowed {
			response.Forbidden(c, fmt.Sprintf("Access denied. Required roles: %v", requiredRoles))
			c.Abort()
			return
		}

		c.Next()
	}
}

// SuperAdminMiddleware checks if user has super_admin role
func SuperAdminMiddleware() gin.HandlerFunc {
	return RoleGuardMiddleware("super_admin")
}

// AdminMiddleware checks if user has admin role
func AdminMiddleware() gin.HandlerFunc {
	return RoleGuardMiddleware("admin", "super_admin")
}

// SupplierMiddleware checks if user has supplier role
func SupplierMiddleware() gin.HandlerFunc {
	return RoleGuardMiddleware("supplier", "super_admin")
}

// ParentMiddleware checks if user has parent role
func ParentMiddleware() gin.HandlerFunc {
	return RoleGuardMiddleware("parent", "super_admin")
}
