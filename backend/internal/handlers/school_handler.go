package handlers

import (
	"fmt"
	"mbg-backend/internal/models"
	"mbg-backend/internal/services"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// SchoolHandler handles school HTTP requests
type SchoolHandler struct {
	service *services.SchoolService
}

// NewSchoolHandler creates a new school handler
func NewSchoolHandler(service *services.SchoolService) *SchoolHandler {
	return &SchoolHandler{service: service}
}

// Create creates a new school - POST /api/v1/schools
func (h *SchoolHandler) Create(c *gin.Context) {
	traceID := c.GetString("trace_id")

	var req models.SchoolCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   fmt.Sprintf("invalid request: %v", err),
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	school, err := h.service.Create(c.Request.Context(), &req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    school,
		"meta":    gin.H{"trace_id": traceID},
	})
}

// GetByID retrieves a school by ID - GET /api/v1/schools/:id
func (h *SchoolHandler) GetByID(c *gin.Context) {
	traceID := c.GetString("trace_id")
	id := c.Param("id")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "school id is required",
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	school, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "school not found",
				"meta":    gin.H{"trace_id": traceID},
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   err.Error(),
				"meta":    gin.H{"trace_id": traceID},
			})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    school,
		"meta":    gin.H{"trace_id": traceID},
	})
}

// List retrieves all schools - GET /api/v1/schools?limit=20&offset=0
func (h *SchoolHandler) List(c *gin.Context) {
	traceID := c.GetString("trace_id")

	limit := 20
	offset := 0

	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}

	if o := c.Query("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil && parsed >= 0 {
			offset = parsed
		}
	}

	schools, err := h.service.List(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "failed to list schools",
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	if schools == nil {
		schools = []models.School{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    schools,
		"meta": gin.H{
			"trace_id": traceID,
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// Update modifies a school - PUT /api/v1/schools/:id
func (h *SchoolHandler) Update(c *gin.Context) {
	traceID := c.GetString("trace_id")
	id := c.Param("id")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "school id is required",
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	var req models.SchoolUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   fmt.Sprintf("invalid request: %v", err),
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	school, err := h.service.Update(c.Request.Context(), id, &req)
	if err != nil {
		statusCode := http.StatusBadRequest
		if strings.Contains(err.Error(), "not found") {
			statusCode = http.StatusNotFound
		}
		c.JSON(statusCode, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    school,
		"meta":    gin.H{"trace_id": traceID},
	})
}

// Delete removes a school - DELETE /api/v1/schools/:id
func (h *SchoolHandler) Delete(c *gin.Context) {
	traceID := c.GetString("trace_id")
	id := c.Param("id")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "school id is required",
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		statusCode := http.StatusInternalServerError
		if strings.Contains(err.Error(), "not found") {
			statusCode = http.StatusNotFound
		}
		c.JSON(statusCode, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
