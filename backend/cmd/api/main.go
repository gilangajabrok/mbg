package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"mbg-backend/internal/config"
	"mbg-backend/internal/database"
	"mbg-backend/internal/handlers"
	"mbg-backend/internal/middleware"
	"mbg-backend/internal/repository"
	"mbg-backend/internal/services"
	"mbg-backend/internal/utils"
	"mbg-backend/pkg/logger"
	"mbg-backend/pkg/response"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to load config: %v\n", err)
		os.Exit(1)
	}

	// Initialize logger
	isDev := cfg.Environment == "development"
	log := logger.NewLogger(cfg.LogLevel, isDev)
	defer log.Sync()

	log.Info("Starting MBG Backend Server",
		zap.String("environment", cfg.Environment),
		zap.String("log_level", cfg.LogLevel),
		zap.String("version", "1.0.0"),
	)

	// Create context
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Initialize container (dependencies)
	container, err := utils.NewContainer(ctx, cfg, log)
	if err != nil {
		log.Fatal("Failed to initialize container", zap.Error(err))
	}
	defer container.Close()

	log.Info("Database connection established",
		zap.String("host", cfg.Database.Host),
		zap.String("database", cfg.Database.Database),
	)

	// Set Gin mode
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	// Initialize router
	setupRouter(container, cfg, log)

	// Create HTTP server
	srv := &http.Server{
		Addr:         fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port),
		Handler:      container.Engine,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
		IdleTimeout:  cfg.Server.IdleTimeout,
	}

	// Start server in goroutine
	go func() {
		log.Info("Starting HTTP server",
			zap.String("address", srv.Addr),
		)

		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Server error", zap.Error(err))
		}
	}()

	// Wait for interrupt signal
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	log.Info("Received interrupt signal, shutting down gracefully...")

	// Graceful shutdown with timeout
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Error("Server shutdown error", zap.Error(err))
	}

	log.Info("MBG Backend Server stopped successfully")
}

// setupRouter configures all routes and middleware
func setupRouter(container *utils.Container, cfg *config.Config, log *logger.Logger) {
	router := container.Engine

	// Global middleware
	router.Use(middleware.ErrorHandlingMiddleware(log))
	router.Use(middleware.CORSMiddleware())
	router.Use(middleware.RequestIDMiddleware())
	router.Use(middleware.LoggingMiddleware(log))
	router.Use(middleware.TimeoutMiddleware(cfg.Server.ReadTimeout))

	// Health check endpoint (no auth required)
	router.GET("/health", func(c *gin.Context) {
		health := map[string]interface{}{
			"status":      "healthy",
			"timestamp":   time.Now().Unix(),
			"database":    container.DB.Health(c.Request.Context()),
			"environment": cfg.Environment,
		}
		response.Success(c, health)
	})

	// Ready check endpoint (checks if all dependencies are ready)
	router.GET("/ready", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
		defer cancel()

		if err := container.DB.Ping(ctx); err != nil {
			log.Error("Readiness check failed", zap.Error(err))
			response.InternalServerError(c, "Service not ready")
			return
		}

		ready := map[string]interface{}{
			"status":    "ready",
			"timestamp": time.Now().Unix(),
		}
		response.Success(c, ready)
	})

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Initialize Supabase client
		supabaseClient := database.NewSupabaseClient(&cfg.Supabase, log.Logger)

		// Initialize auth service
		authService := services.NewAuthService(
			container.DB.Pool(),
			supabaseClient,
			log.Logger,
			cfg.JWT.Secret,
		)

		// Initialize auth handler
		authHandler := handlers.NewAuthHandler(container, authService)

		// Initialize user repository, service, handler
		userRepo := repository.NewUserRepository(container.DB.Pool())
		userService := services.NewUserService(userRepo, log.Logger, container)
		userHandler := handlers.NewUserHandler(container, userService)

		// Public routes (no authentication required)
		publicRoutes := v1.Group("")
		{
			// Auth endpoints
			publicRoutes.POST("/auth/login", authHandler.Login)
			publicRoutes.POST("/auth/register", authHandler.Register)
			publicRoutes.POST("/auth/refresh", authHandler.RefreshToken)
		}

		// Protected routes (authentication required)
		protectedRoutes := v1.Group("")
		protectedRoutes.Use(middleware.AuthMiddleware(cfg.JWT.Secret))
		{
			// Health info endpoint
			protectedRoutes.GET("/health/details", func(c *gin.Context) {
				health := map[string]interface{}{
					"status":    "healthy",
					"timestamp": time.Now().Unix(),
					"user_id":   container.GetUserIDFromContext(c),
					"user_role": container.GetUserRoleFromContext(c),
				}
				response.Success(c, health)
			})

			// Auth routes (protected)
			authRoutes := protectedRoutes.Group("/auth")
			{
				authRoutes.GET("/profile", authHandler.GetProfile)
				authRoutes.PUT("/profile", authHandler.UpdateProfile)
				authRoutes.POST("/logout", authHandler.Logout)
				authRoutes.POST("/change-password", authHandler.ChangePassword)
				authRoutes.POST("/verify-email", authHandler.VerifyEmail)
				authRoutes.GET("/health", authHandler.HealthCheck)
			}

			// User profile routes (protected)
			userRoutes := protectedRoutes.Group("/users")
			{
				userRoutes.GET("/me", userHandler.GetMe)
				userRoutes.PUT("/me", userHandler.UpdateMe)
			}

			// Super Admin routes
			superAdminRoutes := protectedRoutes.Group("")
			superAdminRoutes.Use(middleware.SuperAdminMiddleware())
			{
				// Role management (super_admin only)
				roleRepo := repository.NewRoleRepository(container.DB.Pool())
				roleService := services.NewRoleService(roleRepo)
				roleHandler := handlers.NewRoleHandler(container, roleService)

				// Roles list
				roleRoutes := superAdminRoutes.Group("/roles")
				{
					roleRoutes.GET("", roleHandler.ListRoles)
				}

				// User role assignment endpoints
				adminUserRoutes := superAdminRoutes.Group("/users")
				{
					adminUserRoutes.GET("/:id/role", roleHandler.GetUserRole)
					adminUserRoutes.PUT("/:id/role", roleHandler.SetUserRole)
					adminUserRoutes.DELETE("/:id/role", roleHandler.DeleteUserRole)
				}
			}

			// Initialize repositories and services once
			schoolRepo := repository.NewSchoolRepository(container.DB.Pool())
			schoolService := services.NewSchoolService(schoolRepo)
			schoolHandler := handlers.NewSchoolHandler(schoolService)

			mealPlanRepo := repository.NewMealPlanRepository(container.DB.Pool())
			mealPlanService := services.NewMealPlanService(mealPlanRepo)
			mealPlanHandler := handlers.NewMealPlanHandler(mealPlanService)

			orderRepo := repository.NewOrderRepository(container.DB.Pool())
			orderService := services.NewOrderService(orderRepo)
			orderHandler := handlers.NewOrderHandler(orderService)

			supplierRepo := repository.NewSupplierRepository(container.DB.Pool())
			supplierService := services.NewSupplierService(supplierRepo)
			supplierHandler := handlers.NewSupplierHandler(supplierService)

			studentRepo := repository.NewStudentRepository(container.DB.Pool())
			studentService := services.NewStudentService(studentRepo)
			studentHandler := handlers.NewStudentHandler(studentService)

			mealRepo := repository.NewMealRepository(container.DB.Pool())
			mealService := services.NewMealService(mealRepo)
			mealHandler := handlers.NewMealHandler(mealService)

			announcementRepo := repository.NewAnnouncementRepository(container.DB.Pool())
			announcementService := services.NewAnnouncementService(announcementRepo)
			announcementHandler := handlers.NewAnnouncementHandler(announcementService)

			// Admin routes (admin, super_admin)
			adminRoutes := protectedRoutes.Group("")
			adminRoutes.Use(middleware.AdminMiddleware())
			{
				// Admin user management
				adminRoutes.GET("/users/:id", userHandler.GetByID)
				adminRoutes.POST("/users/:id/deactivate", userHandler.Deactivate)

				// School management - ADMIN CRUD
				schoolAdminRoutes := adminRoutes.Group("/schools")
				{
					schoolAdminRoutes.POST("", schoolHandler.Create)
					schoolAdminRoutes.PUT("/:id", schoolHandler.Update)
					schoolAdminRoutes.DELETE("/:id", schoolHandler.Delete)
				}

				// Students management - ADMIN CRUD
				studentAdminRoutes := adminRoutes.Group("/students")
				{
					studentAdminRoutes.POST("", studentHandler.Create)
					studentAdminRoutes.PUT("/:id", studentHandler.Update)
					studentAdminRoutes.DELETE("/:id", studentHandler.Delete)
				}

				// Meals management - ADMIN CRUD
				mealAdminRoutes := adminRoutes.Group("/meals")
				{
					mealAdminRoutes.POST("", mealHandler.Create)
					mealAdminRoutes.PUT("/:id", mealHandler.Update)
					mealAdminRoutes.DELETE("/:id", mealHandler.Delete)
				}

				// Orders management - ADMIN CRUD
				orderAdminRoutes := adminRoutes.Group("/orders")
				{
					orderAdminRoutes.PUT("/:id", orderHandler.UpdateOrder)
					orderAdminRoutes.PATCH("/:id/status", orderHandler.UpdateOrderStatus)
					orderAdminRoutes.DELETE("/:id", orderHandler.DeleteOrder)
				}

				// Announcements management - ADMIN CRUD
				announcementAdminRoutes := adminRoutes.Group("/announcements")
				{
					announcementAdminRoutes.POST("", announcementHandler.Create)
					announcementAdminRoutes.PUT("/:id", announcementHandler.Update)
					announcementAdminRoutes.DELETE("/:id", announcementHandler.Delete)
				}
			}

			// Supplier routes (supplier, super_admin)
			suppRoutes := protectedRoutes.Group("")
			suppRoutes.Use(middleware.SupplierMiddleware())
			{
				// Supplier orders management
				supplierOrderRoutes := suppRoutes.Group("/orders")
				{
					supplierOrderRoutes.POST("", orderHandler.CreateOrder)
					supplierOrderRoutes.GET("/supplier/:supplierID", orderHandler.GetOrdersBySupplier)
					supplierOrderRoutes.PUT("/:id", orderHandler.UpdateOrder)
				}

				// Supplier profile
				supplierProfileRoutes := suppRoutes.Group("/suppliers")
				{
					supplierProfileRoutes.GET("/:id", supplierHandler.GetByID)
					supplierProfileRoutes.PUT("/:id", supplierHandler.Update)
				}
			}

			// Parent routes (parent, super_admin)
			parentRoutes := protectedRoutes.Group("")
			parentRoutes.Use(middleware.ParentMiddleware())
			{
				// Parent view own children
				parentStudentRoutes := parentRoutes.Group("/students")
				{
					parentStudentRoutes.GET("/parent/:parentID", studentHandler.GetByParent)
					parentStudentRoutes.GET("/:id", studentHandler.GetByID)
				}

				// Parent order management
				parentOrderRoutes := parentRoutes.Group("/orders")
				{
					parentOrderRoutes.POST("", orderHandler.CreateOrder)
					parentOrderRoutes.GET("/:id", orderHandler.GetOrder)
					parentOrderRoutes.GET("/school/:schoolID", orderHandler.GetOrdersBySchool)
				}

				// Parent meal plan management
				parentMealPlanRoutes := parentRoutes.Group("/meal-plans")
				{
					parentMealPlanRoutes.POST("", mealPlanHandler.Create)
					parentMealPlanRoutes.GET("/:id", mealPlanHandler.GetByID)
					parentMealPlanRoutes.GET("/student/:studentID", mealPlanHandler.GetByStudent)
					parentMealPlanRoutes.PUT("/:id", mealPlanHandler.Update)
				}
			}

			// Public read-only routes (all authenticated users)
			publicReadRoutes := protectedRoutes.Group("")
			{
				// Read-only schools list
				publicReadRoutes.GET("/schools", schoolHandler.List)
				publicReadRoutes.GET("/schools/:id", schoolHandler.GetByID)

				// Read-only meals
				publicReadRoutes.GET("/meals", mealHandler.List)
				publicReadRoutes.GET("/meals/:id", mealHandler.GetByID)
				publicReadRoutes.GET("/meals/school/:schoolID", mealHandler.GetBySchool)

				// Read-only announcements
				publicReadRoutes.GET("/announcements", announcementHandler.List)
				publicReadRoutes.GET("/announcements/:id", announcementHandler.GetByID)
				publicReadRoutes.GET("/announcements/school/:schoolID", announcementHandler.GetBySchool)

				// Read-only students (basic info)
				publicReadRoutes.GET("/students/:id", studentHandler.GetByID)
				publicReadRoutes.GET("/students/school/:schoolID", studentHandler.GetBySchool)

				// Read-only orders
				publicReadRoutes.GET("/orders/:id", orderHandler.GetOrder)
				publicReadRoutes.GET("/orders", orderHandler.ListOrders)

				// Read-only suppliers
				publicReadRoutes.GET("/suppliers", supplierHandler.List)
				publicReadRoutes.GET("/suppliers/:id", supplierHandler.GetByID)

				// Read-only meal plans
				publicReadRoutes.GET("/meal-plans/:id", mealPlanHandler.GetByID)
				publicReadRoutes.GET("/meal-plans", mealPlanHandler.List)
			}

		}
	}

	// 404 handler
	router.NoRoute(func(c *gin.Context) {
		response.NotFound(c, fmt.Sprintf("Route %s %s not found", c.Request.Method, c.Request.URL.Path))
	})

	log.Info("Router configured successfully")
}
