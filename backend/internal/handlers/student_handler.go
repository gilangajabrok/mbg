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

// StudentHandler handles student HTTP requests
type StudentHandler struct {
	service *services.StudentService
}

// NewStudentHandler creates a new student handler
func NewStudentHandler(service *services.StudentService) *StudentHandler {
	return &StudentHandler{service: service}
}

// Create creates a new student
// @Summary Create a new student
// @Tags students
// @Accept json
// @Produce json
// @Param student body models.StudentCreateRequest true "Student data"
// @Router /api/v1/students [post]
func (h *StudentHandler) Create(c *gin.Context) {
	var req models.StudentCreateRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   fmt.Sprintf("Invalid request: %v", err),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	student, err := h.service.Create(c.Request.Context(), &req)
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
		"data":    student,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// GetByID retrieves a student by ID
// @Summary Get a student by ID
// @Tags students
// @Produce json
// @Param id path string true "Student ID"
// @Router /api/v1/students/:id [get]
func (h *StudentHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	student, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Student not found",
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
		"data":    student,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// GetBySchool retrieves students for a school
// @Summary Get students by school
// @Tags students
// @Produce json
// @Param schoolID path string true "School ID"
// @Param limit query int false "Limit (default 20, max 100)"
// @Param offset query int false "Offset (default 0)"
// @Router /api/v1/students/school/:schoolID [get]
func (h *StudentHandler) GetBySchool(c *gin.Context) {
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

	students, err := h.service.GetBySchool(c.Request.Context(), schoolID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	if students == nil {
		students = []models.Student{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    students,
		"meta": gin.H{
			"trace_id": c.GetString("trace_id"),
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// GetByParent retrieves students for a parent
// @Summary Get students by parent
// @Tags students
// @Produce json
// @Param parentID path string true "Parent ID"
// @Param limit query int false "Limit (default 20, max 100)"
// @Param offset query int false "Offset (default 0)"
// @Router /api/v1/students/parent/:parentID [get]
func (h *StudentHandler) GetByParent(c *gin.Context) {
	parentID := c.Param("parentID")

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

	students, err := h.service.GetByParent(c.Request.Context(), parentID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	if students == nil {
		students = []models.Student{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    students,
		"meta": gin.H{
			"trace_id": c.GetString("trace_id"),
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// List retrieves all students
// @Summary List all students
// @Tags students
// @Produce json
// @Param limit query int false "Limit (default 20, max 100)"
// @Param offset query int false "Offset (default 0)"
// @Router /api/v1/students [get]
func (h *StudentHandler) List(c *gin.Context) {
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

	students, err := h.service.List(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	if students == nil {
		students = []models.Student{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    students,
		"meta": gin.H{
			"trace_id": c.GetString("trace_id"),
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// Update updates a student
// @Summary Update a student
// @Tags students
// @Accept json
// @Produce json
// @Param id path string true "Student ID"
// @Param student body models.StudentUpdateRequest true "Student data"
// @Router /api/v1/students/:id [put]
func (h *StudentHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var req models.StudentUpdateRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   fmt.Sprintf("Invalid request: %v", err),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	student, err := h.service.Update(c.Request.Context(), id, &req)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Student not found",
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
		"data":    student,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// Delete deletes a student
// @Summary Delete a student
// @Tags students
// @Produce json
// @Param id path string true "Student ID"
// @Router /api/v1/students/:id [delete]
func (h *StudentHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	err := h.service.Delete(c.Request.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Student not found",
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
