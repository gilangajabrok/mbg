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

// MealPlanHandler handles meal plan HTTP requests
type MealPlanHandler struct {
	service *services.MealPlanService
}

// NewMealPlanHandler creates a new meal plan handler
func NewMealPlanHandler(service *services.MealPlanService) *MealPlanHandler {
	return &MealPlanHandler{service: service}
}

// Create creates a new meal plan - POST /api/v1/meal-plans
func (h *MealPlanHandler) Create(c *gin.Context) {
	traceID := c.GetString("trace_id")

	var req models.MealPlanCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   fmt.Sprintf("invalid request: %v", err),
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	mealPlan, err := h.service.Create(c.Request.Context(), &req)
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
		"data":    mealPlan,
		"meta":    gin.H{"trace_id": traceID},
	})
}

// GetByID retrieves a meal plan by ID - GET /api/v1/meal-plans/:id
func (h *MealPlanHandler) GetByID(c *gin.Context) {
	traceID := c.GetString("trace_id")
	id := c.Param("id")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "meal plan id is required",
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	mealPlan, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "meal plan not found",
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
		"data":    mealPlan,
		"meta":    gin.H{"trace_id": traceID},
	})
}

// GetByStudent retrieves meal plans for a student - GET /api/v1/meal-plans/student/:studentID
func (h *MealPlanHandler) GetByStudent(c *gin.Context) {
	traceID := c.GetString("trace_id")
	studentID := c.Param("studentID")

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

	mealPlans, err := h.service.GetByStudent(c.Request.Context(), studentID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	if mealPlans == nil {
		mealPlans = []models.MealPlan{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    mealPlans,
		"meta": gin.H{
			"trace_id": traceID,
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// GetByMeal retrieves meal plans for a meal - GET /api/v1/meal-plans/meal/:mealID
func (h *MealPlanHandler) GetByMeal(c *gin.Context) {
	traceID := c.GetString("trace_id")
	mealID := c.Param("mealID")

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

	mealPlans, err := h.service.GetByMeal(c.Request.Context(), mealID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	if mealPlans == nil {
		mealPlans = []models.MealPlan{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    mealPlans,
		"meta": gin.H{
			"trace_id": traceID,
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// List retrieves all meal plans - GET /api/v1/meal-plans?limit=20&offset=0
func (h *MealPlanHandler) List(c *gin.Context) {
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

	mealPlans, err := h.service.List(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	if mealPlans == nil {
		mealPlans = []models.MealPlan{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    mealPlans,
		"meta": gin.H{
			"trace_id": traceID,
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// Update modifies a meal plan - PUT /api/v1/meal-plans/:id
func (h *MealPlanHandler) Update(c *gin.Context) {
	traceID := c.GetString("trace_id")
	id := c.Param("id")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "meal plan id is required",
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	var req models.MealPlanUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   fmt.Sprintf("invalid request: %v", err),
			"meta":    gin.H{"trace_id": traceID},
		})
		return
	}

	mealPlan, err := h.service.Update(c.Request.Context(), id, &req)
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
		"data":    mealPlan,
		"meta":    gin.H{"trace_id": traceID},
	})
}

// Delete removes a meal plan - DELETE /api/v1/meal-plans/:id
func (h *MealPlanHandler) Delete(c *gin.Context) {
	traceID := c.GetString("trace_id")
	id := c.Param("id")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "meal plan id is required",
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
