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

// AnnouncementHandler handles announcement HTTP requests
type AnnouncementHandler struct {
	service *services.AnnouncementService
}

// NewAnnouncementHandler creates a new announcement handler
func NewAnnouncementHandler(service *services.AnnouncementService) *AnnouncementHandler {
	return &AnnouncementHandler{service: service}
}

// Create creates a new announcement
// @Summary Create a new announcement
// @Tags announcements
// @Accept json
// @Produce json
// @Param announcement body models.AnnouncementCreateRequest true "Announcement data"
// @Router /api/v1/announcements [post]
func (h *AnnouncementHandler) Create(c *gin.Context) {
	var req models.AnnouncementCreateRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   fmt.Sprintf("Invalid request: %v", err),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	announcement, err := h.service.Create(c.Request.Context(), &req)
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
		"data":    announcement,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// GetByID retrieves an announcement by ID
// @Summary Get an announcement by ID
// @Tags announcements
// @Produce json
// @Param id path string true "Announcement ID"
// @Router /api/v1/announcements/:id [get]
func (h *AnnouncementHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	announcement, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Announcement not found",
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
		"data":    announcement,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// GetBySchool retrieves announcements for a school
// @Summary Get announcements by school
// @Tags announcements
// @Produce json
// @Param schoolID path string true "School ID"
// @Param limit query int false "Limit (default 20, max 100)"
// @Param offset query int false "Offset (default 0)"
// @Router /api/v1/announcements/school/:schoolID [get]
func (h *AnnouncementHandler) GetBySchool(c *gin.Context) {
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

	announcements, err := h.service.GetBySchool(c.Request.Context(), schoolID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	if announcements == nil {
		announcements = []models.Announcement{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    announcements,
		"meta": gin.H{
			"trace_id": c.GetString("trace_id"),
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// List retrieves all announcements
// @Summary List all announcements
// @Tags announcements
// @Produce json
// @Param limit query int false "Limit (default 20, max 100)"
// @Param offset query int false "Offset (default 0)"
// @Router /api/v1/announcements [get]
func (h *AnnouncementHandler) List(c *gin.Context) {
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

	announcements, err := h.service.List(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	if announcements == nil {
		announcements = []models.Announcement{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    announcements,
		"meta": gin.H{
			"trace_id": c.GetString("trace_id"),
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// Update updates an announcement
// @Summary Update an announcement
// @Tags announcements
// @Accept json
// @Produce json
// @Param id path string true "Announcement ID"
// @Param announcement body models.AnnouncementUpdateRequest true "Announcement data"
// @Router /api/v1/announcements/:id [put]
func (h *AnnouncementHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var req models.AnnouncementUpdateRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   fmt.Sprintf("Invalid request: %v", err),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	announcement, err := h.service.Update(c.Request.Context(), id, &req)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Announcement not found",
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
		"data":    announcement,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// Delete deletes an announcement
// @Summary Delete an announcement
// @Tags announcements
// @Produce json
// @Param id path string true "Announcement ID"
// @Router /api/v1/announcements/:id [delete]
func (h *AnnouncementHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	err := h.service.Delete(c.Request.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Announcement not found",
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
