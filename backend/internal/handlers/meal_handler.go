package handlers

import (
	"errors"
	"fmt"
	"mbg-backend/internal/models"
	"mbg-backend/internal/services"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// MealHandler handles meal HTTP requests
type MealHandler struct {
	service *services.MealService
}

// NewMealHandler creates a new meal handler
func NewMealHandler(service *services.MealService) *MealHandler {
	return &MealHandler{service: service}
}

// Create creates a new meal
// @Summary Create a new meal
// @Tags meals
// @Accept json
// @Produce json
// @Param meal body models.MealCreateRequest true "Meal data"
// @Router /api/v1/meals [post]
func (h *MealHandler) Create(c *gin.Context) {
	var req models.MealCreateRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   fmt.Sprintf("Invalid request: %v", err),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	meal, err := h.service.Create(c.Request.Context(), &req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    meal,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// GetByID retrieves a meal by ID
// @Summary Get a meal by ID
// @Tags meals
// @Produce json
// @Param id path string true "Meal ID"
// @Router /api/v1/meals/:id [get]
func (h *MealHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	meal, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Meal not found",
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
		"data":    meal,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// GetBySchool retrieves meals for a school
// @Summary Get meals by school
// @Tags meals
// @Produce json
// @Param schoolID path string true "School ID"
// @Param limit query int false "Limit (default 20, max 100)"
// @Param offset query int false "Offset (default 0)"
// @Router /api/v1/meals/school/:schoolID [get]
func (h *MealHandler) GetBySchool(c *gin.Context) {
	schoolID := c.Param("schoolID")

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

	meals, err := h.service.GetBySchool(c.Request.Context(), schoolID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	if meals == nil {
		meals = []models.Meal{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    meals,
		"meta": gin.H{
			"trace_id": c.GetString("trace_id"),
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// List retrieves all meals
// @Summary List all meals
// @Tags meals
// @Produce json
// @Param limit query int false "Limit (default 20, max 100)"
// @Param offset query int false "Offset (default 0)"
// @Router /api/v1/meals [get]
func (h *MealHandler) List(c *gin.Context) {
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

	meals, err := h.service.List(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	if meals == nil {
		meals = []models.Meal{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    meals,
		"meta": gin.H{
			"trace_id": c.GetString("trace_id"),
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// Update updates a meal
// @Summary Update a meal
// @Tags meals
// @Accept json
// @Produce json
// @Param id path string true "Meal ID"
// @Param meal body models.MealUpdateRequest true "Meal data"
// @Router /api/v1/meals/:id [put]
func (h *MealHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var req models.MealUpdateRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   fmt.Sprintf("Invalid request: %v", err),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	meal, err := h.service.Update(c.Request.Context(), id, &req)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Meal not found",
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
		"data":    meal,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// Delete deletes a meal
// @Summary Delete a meal
// @Tags meals
// @Produce json
// @Param id path string true "Meal ID"
// @Router /api/v1/meals/:id [delete]
func (h *MealHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	err := h.service.Delete(c.Request.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Meal not found",
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
