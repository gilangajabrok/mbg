package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Response is the standard API response structure
type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *ErrorData  `json:"error,omitempty"`
	Meta    *MetaData   `json:"meta,omitempty"`
}

// ErrorData contains error information
type ErrorData struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
}

// MetaData contains metadata for the response
type MetaData struct {
	Timestamp int64  `json:"timestamp"`
	Path      string `json:"path"`
	Method    string `json:"method"`
	TraceID   string `json:"trace_id,omitempty"`
}

// Success returns a successful response
func Success(c *gin.Context, data interface{}, statusCode ...int) {
	code := http.StatusOK
	if len(statusCode) > 0 {
		code = statusCode[0]
	}

	c.JSON(code, Response{
		Success: true,
		Data:    data,
		Meta: &MetaData{
			Timestamp: getCurrentTimestamp(),
			Path:      c.Request.URL.Path,
			Method:    c.Request.Method,
			TraceID:   getTraceID(c),
		},
	})
}

// Created returns a created response (201)
func Created(c *gin.Context, data interface{}) {
	c.JSON(http.StatusCreated, Response{
		Success: true,
		Data:    data,
		Meta: &MetaData{
			Timestamp: getCurrentTimestamp(),
			Path:      c.Request.URL.Path,
			Method:    c.Request.Method,
			TraceID:   getTraceID(c),
		},
	})
}

// NoContent returns a 204 No Content response
func NoContent(c *gin.Context) {
	c.JSON(http.StatusNoContent, Response{
		Success: true,
		Meta: &MetaData{
			Timestamp: getCurrentTimestamp(),
			Path:      c.Request.URL.Path,
			Method:    c.Request.Method,
			TraceID:   getTraceID(c),
		},
	})
}

// Paginated returns a paginated response
func Paginated(c *gin.Context, data interface{}, total int64, page int, pageSize int) {
	c.JSON(http.StatusOK, Response{
		Success: true,
		Data:    data,
		Meta: &MetaData{
			Timestamp: getCurrentTimestamp(),
			Path:      c.Request.URL.Path,
			Method:    c.Request.Method,
			TraceID:   getTraceID(c),
		},
	})
}

// BadRequest returns a 400 Bad Request error
func BadRequest(c *gin.Context, message string, details ...string) {
	detail := ""
	if len(details) > 0 {
		detail = details[0]
	}

	c.JSON(http.StatusBadRequest, Response{
		Success: false,
		Error: &ErrorData{
			Code:    "BAD_REQUEST",
			Message: message,
			Details: detail,
		},
		Meta: &MetaData{
			Timestamp: getCurrentTimestamp(),
			Path:      c.Request.URL.Path,
			Method:    c.Request.Method,
			TraceID:   getTraceID(c),
		},
	})
}

// Unauthorized returns a 401 Unauthorized error
func Unauthorized(c *gin.Context, message string) {
	c.JSON(http.StatusUnauthorized, Response{
		Success: false,
		Error: &ErrorData{
			Code:    "UNAUTHORIZED",
			Message: message,
		},
		Meta: &MetaData{
			Timestamp: getCurrentTimestamp(),
			Path:      c.Request.URL.Path,
			Method:    c.Request.Method,
			TraceID:   getTraceID(c),
		},
	})
}

// Forbidden returns a 403 Forbidden error
func Forbidden(c *gin.Context, message string) {
	c.JSON(http.StatusForbidden, Response{
		Success: false,
		Error: &ErrorData{
			Code:    "FORBIDDEN",
			Message: message,
		},
		Meta: &MetaData{
			Timestamp: getCurrentTimestamp(),
			Path:      c.Request.URL.Path,
			Method:    c.Request.Method,
			TraceID:   getTraceID(c),
		},
	})
}

// NotFound returns a 404 Not Found error
func NotFound(c *gin.Context, message string) {
	c.JSON(http.StatusNotFound, Response{
		Success: false,
		Error: &ErrorData{
			Code:    "NOT_FOUND",
			Message: message,
		},
		Meta: &MetaData{
			Timestamp: getCurrentTimestamp(),
			Path:      c.Request.URL.Path,
			Method:    c.Request.Method,
			TraceID:   getTraceID(c),
		},
	})
}

// Conflict returns a 409 Conflict error
func Conflict(c *gin.Context, message string) {
	c.JSON(http.StatusConflict, Response{
		Success: false,
		Error: &ErrorData{
			Code:    "CONFLICT",
			Message: message,
		},
		Meta: &MetaData{
			Timestamp: getCurrentTimestamp(),
			Path:      c.Request.URL.Path,
			Method:    c.Request.Method,
			TraceID:   getTraceID(c),
		},
	})
}

// InternalServerError returns a 500 Internal Server Error
func InternalServerError(c *gin.Context, message string) {
	c.JSON(http.StatusInternalServerError, Response{
		Success: false,
		Error: &ErrorData{
			Code:    "INTERNAL_SERVER_ERROR",
			Message: message,
		},
		Meta: &MetaData{
			Timestamp: getCurrentTimestamp(),
			Path:      c.Request.URL.Path,
			Method:    c.Request.Method,
			TraceID:   getTraceID(c),
		},
	})
}

// Error returns a generic error response with custom status code
func Error(c *gin.Context, statusCode int, code string, message string) {
	c.JSON(statusCode, Response{
		Success: false,
		Error: &ErrorData{
			Code:    code,
			Message: message,
		},
		Meta: &MetaData{
			Timestamp: getCurrentTimestamp(),
			Path:      c.Request.URL.Path,
			Method:    c.Request.Method,
			TraceID:   getTraceID(c),
		},
	})
}

// Helper functions
func getCurrentTimestamp() int64 {
	return 0 // Will be set by middleware
}

func getTraceID(c *gin.Context) string {
	if traceID := c.GetString("trace_id"); traceID != "" {
		return traceID
	}
	return ""
}
