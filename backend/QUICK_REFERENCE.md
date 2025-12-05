# Backend Quick Reference

## Start Development Server

```bash
make dev
# or
go run cmd/api/main.go
```

Server runs on: `http://localhost:8080`

---

## Health Endpoints

```bash
# Basic health
curl http://localhost:8080/health

# Readiness check
curl http://localhost:8080/ready
```

---

## API Routes Structure

### Public Routes (No Auth)
```
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/refresh
```

### Protected Routes (Require JWT)
```
Authorization: Bearer <token>

GET /api/v1/health/details      # All authenticated users

# Role-specific routes (placeholders)
[super_admin routes]
[admin routes]
[supplier routes]
[parent routes]
```

---

## Authentication Flow

1. **Login/Register** → Get JWT token from `/auth/login`
2. **Add to request** → `Authorization: Bearer <token>` header
3. **Server validates** → Middleware checks token signature
4. **Extract claims** → User ID, role, email available in handler
5. **Role check** → Access denied if role not authorized

---

## Adding a New Endpoint

### 1. Create Handler

```go
// internal/handlers/user_handler.go
package handlers

import "github.com/gin-gonic/gin"

type UserHandler struct {
    container *utils.Container
}

func NewUserHandler(c *utils.Container) *UserHandler {
    return &UserHandler{container: c}
}

func (h *UserHandler) GetUser(c *gin.Context) {
    userID := c.Param("id")
    h.container.Logger.Info("Getting user", zap.String("user_id", userID))
    
    // Your logic here
    response.Success(c, map[string]string{"id": userID})
}
```

### 2. Register Route

```go
// In setupRouter() in cmd/api/main.go
userHandler := handlers.NewUserHandler(container)
adminRoutes.GET("/users/:id", userHandler.GetUser)
```

### 3. Test

```bash
curl -H "Authorization: Bearer <token>" \
     http://localhost:8080/api/v1/users/123
```

---

## Database Query Example

```go
// Inside handler
ctx := c.Request.Context()
pool := container.DB.Pool()

row := pool.QueryRow(ctx, 
    "SELECT id, email, role FROM users WHERE id = $1",
    userID,
)

var id, email, role string
if err := row.Scan(&id, &email, &role); err != nil {
    container.Logger.Error("User not found", zap.Error(err))
    response.NotFound(c, "User not found")
    return
}

response.Success(c, map[string]interface{}{
    "id": id,
    "email": email,
    "role": role,
})
```

---

## Logging Examples

```go
// Info level
container.Logger.Info("User created", zap.String("user_id", id))

// Error level
container.Logger.Error("Database error", zap.Error(err))

// With fields
container.Logger.Info("Order placed",
    zap.String("order_id", orderID),
    zap.String("user_id", userID),
    zap.Float64("amount", 99.99),
)
```

---

## Response Examples

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": 1701710000,
    "path": "/api/v1/users/123",
    "method": "GET",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found",
    "details": "No user with ID 999"
  },
  "meta": {
    "timestamp": 1701710000,
    "path": "/api/v1/users/999",
    "method": "GET",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## Response Helper Functions

```go
// 200 OK
response.Success(c, data)
response.Success(c, data, http.StatusOK)

// 201 Created
response.Created(c, data)

// 204 No Content
response.NoContent(c)

// 400 Bad Request
response.BadRequest(c, "Invalid input", "Details")

// 401 Unauthorized
response.Unauthorized(c, "Missing auth header")

// 403 Forbidden
response.Forbidden(c, "Admin access required")

// 404 Not Found
response.NotFound(c, "User not found")

// 409 Conflict
response.Conflict(c, "User already exists")

// 500 Internal Server Error
response.InternalServerError(c, "Database error")

// Custom
response.Error(c, http.StatusBadRequest, "CODE", "Message")
```

---

## Role Guards

```go
// Super Admin only
superAdminRoutes := v1.Group("")
superAdminRoutes.Use(middleware.SuperAdminMiddleware())
superAdminRoutes.GET("/users", getUsersHandler)

// Admin or Super Admin
adminRoutes := v1.Group("")
adminRoutes.Use(middleware.AdminMiddleware())
adminRoutes.GET("/schools", getSchoolsHandler)

// Supplier or Super Admin
supplierRoutes := v1.Group("")
supplierRoutes.Use(middleware.SupplierMiddleware())
supplierRoutes.GET("/meals", getMealsHandler)

// Parent or Super Admin
parentRoutes := v1.Group("")
parentRoutes.Use(middleware.ParentMiddleware())
parentRoutes.GET("/children", getChildrenHandler)

// Custom roles
customRoutes := v1.Group("")
customRoutes.Use(middleware.RoleGuardMiddleware("admin", "super_admin"))
customRoutes.POST("/approve", approveHandler)
```

---

## Extracting Request Context

```go
// Inside any handler
userID := container.GetUserIDFromContext(c)
userRole := container.GetUserRoleFromContext(c)
traceID := container.GetTraceIDFromContext(c)

// From Gin context directly
userEmail, _ := c.Get("user_email")
requestID, _ := c.Get("request_id")
```

---

## Environment Variables

```bash
# Create .env from template
cp .env.example .env

# Required for development
ENVIRONMENT=development
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=mbg

# For Supabase
DB_HOST=your-project.supabase.co
DB_SSL_MODE=require
DB_PASSWORD=your-postgres-password
```

---

## Common Make Commands

```bash
make help          # Show all commands
make install       # Install dependencies
make dev           # Start dev server
make build         # Build binary
make test          # Run tests
make fmt           # Format code
make lint          # Run linter
make docker-up     # Start Docker containers
make docker-down   # Stop Docker containers
make clean         # Clean artifacts
```

---

## Database Operations

### Query Single Row
```go
row := pool.QueryRow(ctx, "SELECT id, name FROM users WHERE id = $1", userID)
var id, name string
if err := row.Scan(&id, &name); err != nil {
    if err == pgx.ErrNoRows {
        // Not found
    }
    return err
}
```

### Query Multiple Rows
```go
rows, err := pool.Query(ctx, "SELECT id, name FROM users WHERE active = $1", true)
if err != nil {
    return err
}
defer rows.Close()

for rows.Next() {
    var id, name string
    if err := rows.Scan(&id, &name); err != nil {
        return err
    }
    // Process row
}
```

### Insert/Update/Delete
```go
tag, err := pool.Exec(ctx, 
    "INSERT INTO users (id, name, email) VALUES ($1, $2, $3)",
    id, name, email,
)
if err != nil {
    return err
}

rowsAffected := tag.RowsAffected()
```

---

## Error Handling Pattern

```go
// Recommended pattern
if err := someOperation(); err != nil {
    container.Logger.Error("Operation failed",
        zap.Error(err),
        zap.String("trace_id", traceID),
    )
    response.InternalServerError(c, "Operation failed")
    return
}

// For specific errors
if err == pgx.ErrNoRows {
    response.NotFound(c, "Resource not found")
    return
}

if err == context.DeadlineExceeded {
    response.Error(c, http.StatusRequestTimeout, 
        "TIMEOUT", "Request took too long")
    return
}
```

---

## Performance Tips

1. **Connection Pool**: Already configured in database/db.go
2. **Indexes**: Created on all foreign keys and search columns
3. **Query Optimization**: Use prepared statements
4. **Logging**: Structured logging with minimal overhead
5. **Middleware**: Ordered for efficiency (fail fast)

---

## Debugging

```bash
# Enable debug logging
LOG_LEVEL=debug make dev

# View all requests
# Automatic in LoggingMiddleware, includes:
# - Request method/path
# - Response status/size
# - Response time
# - Trace ID

# Check database connection
curl http://localhost:8080/ready

# See database stats
curl http://localhost:8080/health | jq .data.database
```

---

## Common Issues

### Port Already in Use
```bash
# Change port in .env
SERVER_PORT=8081 make dev
```

### Database Connection Failed
```bash
# Check .env database settings
# Test connection
psql postgresql://user:pass@host:port/dbname

# Ensure migrations ran
psql -h DB_HOST -U DB_USER -d DB_NAME -c "SELECT COUNT(*) FROM users;"
```

### Invalid JWT Token
```bash
# Ensure JWT_SECRET matches token generation
# Check token expiry
JWT_ACCESS_TOKEN_EXPIRY=1h make dev

# Validate token format
Authorization: Bearer eyJhbGc...
```

---

## Next: Build a Module

1. **Create handler** in `internal/handlers/`
2. **Create service** in `internal/services/`
3. **Create models** in `internal/models/`
4. **Register routes** in `cmd/api/main.go`
5. **Test endpoint** with curl/Postman

Example: User Management module next?

---

## Useful Links

- PostgreSQL Docs: https://www.postgresql.org/docs/
- pgx Docs: https://github.com/jackc/pgx
- Gin Docs: https://gin-gonic.com/
- Zap Logger: https://pkg.go.dev/go.uber.org/zap
- JWT: https://datatracker.ietf.org/doc/html/rfc7519
