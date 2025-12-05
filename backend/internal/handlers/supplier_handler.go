package handlers

import (
	"errors"
	"fmt"
	"strings"
	"mbg-backend/internal/models"
	"mbg-backend/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// SupplierHandler handles supplier HTTP requests
type SupplierHandler struct {
	service *services.SupplierService
}

// NewSupplierHandler creates a new supplier handler
func NewSupplierHandler(service *services.SupplierService) *SupplierHandler {
	return &SupplierHandler{service: service}
}

// Create creates a new supplier
// @Summary Create a new supplier
// @Tags suppliers
// @Accept json
// @Produce json
// @Param supplier body models.SupplierCreateRequest true "Supplier data"
// @Router /api/v1/suppliers [post]
func (h *SupplierHandler) Create(c *gin.Context) {
	var req models.SupplierCreateRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   fmt.Sprintf("Invalid request: %v", err),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	supplier, err := h.service.Create(c.Request.Context(), &req)
	if err != nil {
		if err == models.ErrDuplicate {
			c.JSON(http.StatusConflict, gin.H{
				"success": false,
				"error":   "Supplier with this email already exists",
				"meta":    gin.H{"trace_id": c.GetString("trace_id")},
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    supplier,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// GetByID retrieves a supplier by ID
// @Summary Get a supplier by ID
// @Tags suppliers
// @Produce json
// @Param id path string true "Supplier ID"
// @Router /api/v1/suppliers/:id [get]
func (h *SupplierHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	supplier, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Supplier not found",
				"meta":    gin.H{"trace_id": c.GetString("trace_id")},
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    supplier,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// List retrieves all suppliers
// @Summary List all suppliers
// @Tags suppliers
// @Produce json
// @Param limit query int false "Limit (default 20, max 100)"
// @Param offset query int false "Offset (default 0)"
// @Router /api/v1/suppliers [get]
func (h *SupplierHandler) List(c *gin.Context) {
	limit := 20
	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil {
			limit = parsed
		}
	}

	offset := 0
	if o := c.Query("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil {
			offset = parsed
		}
	}

	suppliers, err := h.service.List(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	if suppliers == nil {
		suppliers = []models.Supplier{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    suppliers,
		"meta": gin.H{
			"trace_id": c.GetString("trace_id"),
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// Update updates a supplier
// @Summary Update a supplier
// @Tags suppliers
// @Accept json
// @Produce json
// @Param id path string true "Supplier ID"
// @Param supplier body models.SupplierUpdateRequest true "Supplier data"
// @Router /api/v1/suppliers/:id [put]
func (h *SupplierHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var req models.SupplierUpdateRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   fmt.Sprintf("Invalid request: %v", err),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	supplier, err := h.service.Update(c.Request.Context(), id, &req)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Supplier not found",
				"meta":    gin.H{"trace_id": c.GetString("trace_id")},
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    supplier,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// Delete deletes a supplier
// @Summary Delete a supplier
// @Tags suppliers
// @Produce json
// @Param id path string true "Supplier ID"
// @Router /api/v1/suppliers/:id [delete]
func (h *SupplierHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	err := h.service.Delete(c.Request.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Supplier not found",
				"meta":    gin.H{"trace_id": c.GetString("trace_id")},
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    nil,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}
