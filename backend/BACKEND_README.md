# MBG Backend - Golang API

Complete backend infrastructure for the MBG Platform using Go, PostgreSQL (Supabase), and Gin framework.

## Project Structure

```
backend/
├── cmd/
│   └── api/
│       └── main.go              # Server entry point
├── internal/
│   ├── config/
│   │   └── config.go            # Configuration management
│   ├── database/
│   │   └── db.go                # Database connection & pool
│   ├── middleware/
│   │   └── middleware.go        # HTTP middleware
│   ├── handlers/                # HTTP handlers (to be built)
│   ├── models/                  # Data models (to be built)
│   ├── services/                # Business logic (to be built)
│   └── utils/
│       └── container.go         # Dependency injection
├── pkg/
│   ├── logger/
│   │   └── logger.go            # Logging utilities
│   └── response/
│       └── response.go          # API response utilities
├── migrations/
│   └── 001_initial_schema.sql   # Database schema
├── go.mod                       # Go module definition
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## Prerequisites

- **Go** 1.21+
- **PostgreSQL** 14+ (or Supabase)
- **Git**

## Quick Start

### 1. Clone and Setup

```bash
cd backend
```

### 2. Install Dependencies

```bash
go mod download
go mod tidy
```

### 3. Environment Configuration

Create a `.env` file from the template:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
SERVER_PORT=8080
ENVIRONMENT=development

# Database (Supabase)
DB_HOST=your-project.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=postgres
DB_SSL_MODE=require

# JWT
JWT_SECRET=your-secret-key-here
```

### 4. Run Database Migrations

Apply the initial schema to your PostgreSQL database:

```bash
psql -h DB_HOST -U DB_USER -d DB_NAME -f migrations/001_initial_schema.sql
```

Or if using Supabase, run the SQL in the Supabase SQL Editor.

### 5. Start the Server

```bash
go run cmd/api/main.go
```

Server will start on: `http://localhost:8080`

## API Endpoints

### Health Checks (No Auth Required)

```bash
# Health status
GET /health

# Readiness check
GET /ready
```

### Authentication (Public)

```bash
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/refresh
```

### Protected Routes (Require JWT)

All routes under `/api/v1/` (except auth) require a valid JWT token in the `Authorization` header:

```bash
Authorization: Bearer <your-jwt-token>
```

## Architecture

### Core Components

#### 1. **Configuration** (`internal/config/config.go`)
- Loads from `.env` file
- Environment-based settings
- Database connection strings
- JWT configuration

#### 2. **Database** (`internal/database/db.go`)
- pgx connection pooling
- Connection health checks
- Query helper methods
- Migration support

#### 3. **Logger** (`pkg/logger/logger.go`)
- Structured logging with zap
- Multiple log levels (debug, info, warn, error, fatal)
- Production & development modes

#### 4. **Middleware** (`internal/middleware/middleware.go`)
- Request logging with trace IDs
- Error handling & panic recovery
- CORS configuration
- JWT authentication
- Role-based access control (RBAC)

#### 5. **Dependency Injection** (`internal/utils/container.go`)
- Centralized dependency management
- Database, logger, config access
- Context utilities

#### 6. **API Response** (`pkg/response/response.go`)
- Standardized response format
- HTTP status codes
- Error handling
- Trace ID tracking

## Development

### Running Tests

```bash
go test ./...
```

### Building for Production

```bash
go build -o mbg-api cmd/api/main.go
```

### Docker Build

```bash
docker build -f Dockerfile -t mbg-backend:latest .
docker run -p 8080:8080 --env-file .env mbg-backend:latest
```

## Middleware

All requests pass through these global middleware (in order):

1. **ErrorHandlingMiddleware** - Catches panics
2. **CORSMiddleware** - Cross-origin requests
3. **RequestIDMiddleware** - Trace IDs
4. **LoggingMiddleware** - Request/response logging
5. **TimeoutMiddleware** - Request timeouts

## Authentication Flow

1. **Client** sends credentials to `/api/v1/auth/login`
2. **Server** validates and returns JWT token
3. **Client** sends JWT in `Authorization: Bearer <token>` header
4. **AuthMiddleware** validates token and extracts claims
5. **RoleGuardMiddleware** checks user role against required roles
6. **Handler** processes authenticated request

## Role-Based Access Control

Four roles with hierarchical access:

- **super_admin** - System administrator (full access)
- **admin** - School administrator (school-level operations)
- **supplier** - Meal supplier (supplier operations)
- **parent** - Parent/guardian (limited access)

Role guard applied like:
```go
superAdminRoutes.Use(middleware.SuperAdminMiddleware())
adminRoutes.Use(middleware.AdminMiddleware())
supplierRoutes.Use(middleware.SupplierMiddleware())
parentRoutes.Use(middleware.ParentMiddleware())
```

## Database Connection

### Direct PostgreSQL Access

```go
conn := container.DB.Pool()
row := conn.QueryRow(ctx, "SELECT * FROM users WHERE id = $1", userID)
```

### Using Supabase

1. Create Supabase project
2. Get connection details from Dashboard → Settings → Database
3. Set in `.env`:
   ```
   DB_HOST=your-project.supabase.co
   DB_PORT=5432
   DB_SSL_MODE=require
   ```

## Key Features

✅ **PostgreSQL Integration** - pgx connection pooling
✅ **Structured Logging** - Zap logger with trace IDs
✅ **Error Handling** - Comprehensive error middleware
✅ **Authentication** - JWT validation & token extraction
✅ **Role-Based Access** - Multi-role authorization
✅ **Graceful Shutdown** - Clean server shutdown
✅ **Health Checks** - Status & readiness endpoints
✅ **CORS Support** - Cross-origin configuration
✅ **Request Tracing** - Unique trace IDs per request
✅ **Dependency Injection** - Centralized container

## Next Steps

The infrastructure is ready. Next phase modules to build:

1. **User Service** - User management & authentication
2. **School Service** - School CRUD operations
3. **Supplier Service** - Supplier management
4. **Meal Service** - Meal plans & items
5. **Order Service** - Order processing
6. **Delivery Service** - Delivery tracking
7. **Analytics Service** - Reporting endpoints

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `ENVIRONMENT` | development | App environment |
| `LOG_LEVEL` | info | Logger level |
| `SERVER_HOST` | 0.0.0.0 | Server host |
| `SERVER_PORT` | 8080 | Server port |
| `DB_HOST` | localhost | Database host |
| `DB_PORT` | 5432 | Database port |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | | Database password |
| `DB_NAME` | mbg | Database name |
| `DB_SSL_MODE` | disable | SSL mode |
| `JWT_SECRET` | key | JWT secret key |

## Troubleshooting

### Database Connection Error
```
unable to create connection pool: unable to parse database config
```
- Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` in `.env`
- Ensure PostgreSQL is running and accessible

### Port Already in Use
```
listen tcp :8080: bind: address already in use
```
- Change `SERVER_PORT` in `.env` or stop the process using port 8080

### JWT Token Invalid
```
invalid or expired token
```
- Ensure token is valid and not expired
- Check `JWT_SECRET` matches token generation

## License

MIT License - See LICENSE file

## Support

For issues or questions, create an issue in the repository or contact the development team.
