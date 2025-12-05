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

// OrderHandler handles order HTTP requests
type OrderHandler struct {
	service *services.OrderService
}

// NewOrderHandler creates a new order handler
func NewOrderHandler(service *services.OrderService) *OrderHandler {
	return &OrderHandler{service: service}
}

// CreateOrder creates a new order
// @Summary Create a new order
// @Tags orders
// @Accept json
// @Produce json
// @Param order body models.OrderCreateRequest true "Order data"
// @Router /api/v1/orders [post]
func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var req models.OrderCreateRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   fmt.Sprintf("Invalid request: %v", err),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	order, err := h.service.Create(c.Request.Context(), &req)
	if err != nil {
		if err.Error() == "record not found" || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Order not found",
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
		"data":    order,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// GetOrder retrieves an order by ID
// @Summary Get an order by ID
// @Tags orders
// @Produce json
// @Param id path string true "Order ID"
// @Router /api/v1/orders/:id [get]
func (h *OrderHandler) GetOrder(c *gin.Context) {
	id := c.Param("id")

	order, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Order not found",
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
		"data":    order,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// GetOrdersBySupplier retrieves orders for a supplier
// @Summary Get orders by supplier
// @Tags orders
// @Produce json
// @Param supplierID path string true "Supplier ID"
// @Param limit query int false "Limit (default 20, max 100)"
// @Param offset query int false "Offset (default 0)"
// @Router /api/v1/orders/supplier/:supplierID [get]
func (h *OrderHandler) GetOrdersBySupplier(c *gin.Context) {
	supplierID := c.Param("supplierID")

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

	orders, err := h.service.GetBySupplier(c.Request.Context(), supplierID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	if orders == nil {
		orders = []models.Order{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    orders,
		"meta": gin.H{
			"trace_id": c.GetString("trace_id"),
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// GetOrdersBySchool retrieves orders for a school
// @Summary Get orders by school
// @Tags orders
// @Produce json
// @Param schoolID path string true "School ID"
// @Param limit query int false "Limit (default 20, max 100)"
// @Param offset query int false "Offset (default 0)"
// @Router /api/v1/orders/school/:schoolID [get]
func (h *OrderHandler) GetOrdersBySchool(c *gin.Context) {
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

	orders, err := h.service.GetBySchool(c.Request.Context(), schoolID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	if orders == nil {
		orders = []models.Order{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    orders,
		"meta": gin.H{
			"trace_id": c.GetString("trace_id"),
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// GetOrdersByStatus retrieves orders with a specific status
// @Summary Get orders by status
// @Tags orders
// @Produce json
// @Param status path string true "Status (pending, confirmed, delivered, cancelled)"
// @Param limit query int false "Limit (default 20, max 100)"
// @Param offset query int false "Offset (default 0)"
// @Router /api/v1/orders/status/:status [get]
func (h *OrderHandler) GetOrdersByStatus(c *gin.Context) {
	status := c.Param("status")

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

	orders, err := h.service.GetByStatus(c.Request.Context(), status, limit, offset)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	if orders == nil {
		orders = []models.Order{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    orders,
		"meta": gin.H{
			"trace_id": c.GetString("trace_id"),
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// ListOrders retrieves all orders
// @Summary List all orders
// @Tags orders
// @Produce json
// @Param limit query int false "Limit (default 20, max 100)"
// @Param offset query int false "Offset (default 0)"
// @Router /api/v1/orders [get]
func (h *OrderHandler) ListOrders(c *gin.Context) {
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

	orders, err := h.service.List(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	if orders == nil {
		orders = []models.Order{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    orders,
		"meta": gin.H{
			"trace_id": c.GetString("trace_id"),
			"limit":    limit,
			"offset":   offset,
		},
	})
}

// UpdateOrder updates an order
// @Summary Update an order
// @Tags orders
// @Accept json
// @Produce json
// @Param id path string true "Order ID"
// @Param order body models.OrderUpdateRequest true "Order data"
// @Router /api/v1/orders/:id [put]
func (h *OrderHandler) UpdateOrder(c *gin.Context) {
	id := c.Param("id")

	var req models.OrderUpdateRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   fmt.Sprintf("Invalid request: %v", err),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	order, err := h.service.Update(c.Request.Context(), id, &req)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Order not found",
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
		"data":    order,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// UpdateOrderStatus updates an order's status
// @Summary Update order status
// @Tags orders
// @Accept json
// @Produce json
// @Param id path string true "Order ID"
// @Param req body map[string]string true "Status request"
// @Router /api/v1/orders/:id/status [patch]
func (h *OrderHandler) UpdateOrderStatus(c *gin.Context) {
	id := c.Param("id")

	var req map[string]string
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   fmt.Sprintf("Invalid request: %v", err),
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	status, exists := req["status"]
	if !exists || status == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Status is required",
			"meta":    gin.H{"trace_id": c.GetString("trace_id")},
		})
		return
	}

	order, err := h.service.UpdateStatus(c.Request.Context(), id, status)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Order not found",
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
		"data":    order,
		"meta":    gin.H{"trace_id": c.GetString("trace_id")},
	})
}

// DeleteOrder deletes an order
// @Summary Delete an order
// @Tags orders
// @Produce json
// @Param id path string true "Order ID"
// @Router /api/v1/orders/:id [delete]
func (h *OrderHandler) DeleteOrder(c *gin.Context) {
	id := c.Param("id")

	err := h.service.Delete(c.Request.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") || errors.Is(err, models.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Order not found",
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
