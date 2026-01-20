# MBG Backend - Java Spring Boot

Backend API untuk platform MBG (Makan Bergizi Gratis) menggunakan Java 17 + Spring Boot 3.2 + PostgreSQL.

## 🚀 Features

- ✅ **Spring Boot 3.2.1** - Modern Java framework
- ✅ **Spring Security 6** - JWT authentication & RBAC
- ✅ **PostgreSQL 15+** - Reliable database
- ✅ **Flyway** - Database migrations
- ✅ **4 Role System** - super_admin, admin, supplier, parent
- ✅ **Multi-Tenancy** - Organization & Branch isolation
- ✅ **10+ Core Modules** - Complete CRUD operations
- ✅ **Governance Features** - Audit logging, Document Approval
- ✅ **RESTful API** - Clean API design dengan validasi

## 📋 Prerequisites

- Java 17 (JDK)
- Maven 3.6+
- PostgreSQL 15+
- (Optional) Docker untuk PostgreSQL

## 🔧 Setup Instructions

### 1. Database Setup

**Option A: Using Docker**
```bash
docker run --name mbg-postgres \\
  -e POSTGRES_DB=mbg \\
  -e POSTGRES_USER=postgres \\
  -e POSTGRES_PASSWORD=postgres \\
  -p 5432:5432 \\
  -d postgres:15
```

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL, then create database
createdb mbg
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
# Minimal required: JWT_SECRET (change this!)
```

### 3. Build & Run

```bash
# Install dependencies and build
./mvnw clean install

# Run the application
./mvnw spring-boot:run

# Or run with specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Server akan berjalan di: **http://localhost:8080**

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication Endpoints

#### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "admin@mbg.com",
  "password": "Admin123!",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN",
  "phone": "+62812345678",
  "address": "Jakarta"
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@mbg.com",
  "password": "Admin123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "user": {
      "id": "uuid",
      "email": "admin@mbg.com",
      "role": "ADMIN",
      "firstName": "Admin",
      "lastName": "User",
      ...
    }
  }
}
```

#### Health Check
```bash
GET /health
```

### Protected Endpoints

Semua endpoint lain memerlukan JWT token:
```bash
Authorization: Bearer {your-access-token}
```

## 🏢 Multi-Tenancy Architecture

System ini menggunakan **Discriminator Column Strategy**:
- Setiap entity vital memiliki column `organization_id` (dan optional `branch_id`).
- **TenantContext**: Thread-local storage menyimpan `organizationId` dari JWT Token.
- **TenantFilter**: Intercept request -> Extract claims -> Set TenantContext.
- **Repository**: Semua query otomatis di-filter berdasarkan `organizationId` (via Custom Repository methods yang diimplementasikan).

## 🔐 Role-Based Access Control (RBAC)

### API Endpoints Summary

| Module | Base URL | Method | Access |
|--------|----------|--------|--------|
| **Schools** | `/api/schools` | GET, POST, PUT, DELETE | Admin/Super |
| **Students** | `/api/students` | CRUD | Admin/Super (Parent Read) |
| **Meals** | `/api/meals` | CRUD | Admin/Super |
| **Orders** | `/api/orders` | CRUD | Admin (Supplier Update) |
| **Meal Plans** | `/api/meal-plans` | CRUD | Admin (Parent Read) |
| **Parents** | `/api/parents` | CRUD | Admin |
| **Announcements** | `/api/announcements` | CRUD | All (Read), Admin (Write) |
| **Distribution** | `/api/distribution` | CRUD | Admin |
| **Financial** | `/api/finance` | GET, POST | Admin |
| **Quality** | `/api/quality` | CRUD | Admin |
| **Documents** | `/governance/documents` | Workflow | Super Admin |
| **Dashboard** | `/governance/dashboard` | GET | Super Admin |

Semua endpoint API (kecuali Auth) memerlukan header `Authorization: Bearer <token>`.

## 🔐 Role-Based Access Control (RBAC)

### Roles
1. **SUPER_ADMIN** - Full access termasuk governance features
2. **ADMIN** - Manage schools, students, meals, announcements
3. **SUPPLIER** - Manage orders dan supplier profile
4. **PARENT** - Manage children data dan meal plans

### Access Matrix

| Resource | Super Admin | Admin | Supplier | Parent |
|----------|-------------|-------|----------|--------|
| Users | Full CRUD | Read | Read | Read |
| Schools | Full CRUD | Full CRUD | Read | Read |
| Students | Full CRUD | Full CRUD | Read | Own only |
| Meals | Full CRUD | Full CRUD | Read | Read |
| Orders | Full CRUD | Update/Delete | Create/Update | Create/Read |
| Suppliers | Full CRUD | Read | Own only | Read |
| Meal Plans | Full CRUD | Read | Read | Own only |
| Announcements | Full CRUD | Full CRUD | Read | Read |
| Governance | Full access | ❌ | ❌ | ❌ |

## 🏛️ Governance Features (Super Admin Only)

Super admin memiliki akses ke fitur governance:
- 📊 Platform-wide analytics
- 📜  Audit logs (all user actions)
- 👥 User management
- ⚙️ System configuration
- 💾 Database backup/restore
- 🔍 System health monitoring

## 📂 Project Structure

```
backend/
├── src/main/java/com/mbg/
│   ├── MbgBackendApplication.java    # Main app
│   ├── config/                        # Configuration
│   │   ├── SecurityConfig.java
│   │   └── ApplicationConfig.java
│   ├── controller/                    # REST controllers
│   │   └── AuthController.java
│   ├── dto/                           # Data Transfer Objects
│   │   ├── AuthResponse.java
│   │   ├── LoginRequest.java
│   │   └── RegisterRequest.java
│   ├── entity/                        # JPA Entities
│   │   ├── User.java
│   │   ├── School.java
│   │   ├── Student.java
│   │   └── ...
│   ├── exception/                     # Exception handling
│   │   ├── MbgException.java
│   │   └── GlobalExceptionHandler.java
│   ├── repository/                    # Spring Data repositories
│   │   ├── UserRepository.java
│   │   └── ...
│   ├── security/                      # Security components
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── RoleGuard.java
│   └── service/                       # Business logic
│       └── AuthService.java
└── src/main/resources/
    ├── application.yml                # Main config
    ├── application-dev.yml            # Dev config
    └── db/migration/                  # Flyway migrations
        └── V1__initial_schema.sql
```

## 🧪 Testing

```bash
# Run all tests
./mvnw test

# Run with coverage
./mvnw clean verify
```

## 🚢 Deployment

### Build for Production
```bash
./mvnw clean package -DskipTests
java -jar target/mbg-backend-1.0.0.jar
```

### Environment Variables
Set these in production:
- `JWT_SECRET` - Secure random string (min 256 bits)
- `DATABASE_URL` - PostgreSQL connection string
- `DATABASE_USERNAME` - DB user
- `DATABASE_PASSWORD` - DB password

## 📝 Development Notes

- **Default Super Admin**: `superadmin@mbg.com` / `Admin123!`
- **Database Migrations**: Auto-run on startup via Flyway
- **Logging**: DEBUG level in development
- **Hot Reload**: Enabled via Spring DevTools

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
psql -U postgres -d mbg

# Verify connection in application.yml
spring.datasource.url=jdbc:postgresql://localhost:5432/mbg
```

### JWT Token Invalid
- Check JWT_SECRET in .env matches
- Ensure token not expired (24h default)
- Verify Bearer prefix in Authorization header

## 📞 Support

Untuk pertanyaan atau issues, silakan hubungi tim development.

---

**Status**: ✅ Ready for development  
**Version**: 1.0.0  
**Last Updated**: 2026-01-20
