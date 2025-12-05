# Smoke Testing Guide - User Profile Module

## Status
- ✅ **Unit Tests:** All 22 tests passing (service + handler layer)
- ⚠️ **Live Server:** Server startup requires valid Supabase database credentials
- 📋 **This Guide:** Instructions for end-to-end smoke testing

---

## Prerequisites for Smoke Testing

### 1. Supabase Database Credentials
You need the **Supabase PostgreSQL password** for the account `postgres` on your Supabase project `qudcvlcgfdfbliawwcwp`.

**Where to find it:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `qudcvlcgfdfbliawwcwp`
3. Click **Settings** → **Database**
4. Under "Connection string" section, find the password for the `postgres` user
5. Copy the password (usually shown as `[YOUR_PASSWORD]` in the connection string)

### 2. Update `.env` file
Replace `DB_PASSWORD=postgres` with your actual Supabase password:

```dotenv
# Database Configuration (Supabase)
DB_HOST=qudcvlcgfdfbliawwcwp.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR_ACTUAL_PASSWORD_HERE  # ← REPLACE THIS
DB_NAME=postgres
DB_SSL_MODE=require
```

### 3. Verify Migrations
Ensure both migrations have been executed in Supabase:
- ✅ `001_initial_schema.sql` - Full database schema (you confirmed this is done)
- ✅ `002_create_user_profiles.sql` - User profiles table

If not done, execute them in [Supabase SQL Editor](https://app.supabase.com/project/qudcvlcgfdfbliawwcwp/sql):

**Migration 1:** `001_initial_schema.sql` (already done?)
**Migration 2:** `002_create_user_profiles.sql`
```sql
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    avatar_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
```

---

## Running the Backend Server

### Step 1: Build the Binary
```powershell
cd c:\Users\ALIFIAH\Downloads\Dev\ 3\backend
go build -o api.exe ./cmd/api
```

### Step 2: Start the Server
```powershell
.\api.exe
```

**Expected Output:**
```
Starting MBG Backend Server...
✓ Database connected successfully
✓ Server listening on 0.0.0.0:8080
```

### Step 3: Verify Health Check
In another PowerShell window:
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/health" -Method GET
```

**Expected Response (Status 200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Running Smoke Tests

### Option A: PowerShell Script
Run the provided smoke test script:

```powershell
cd c:\Users\ALIFIAH\Downloads\Dev\ 3\backend
.\smoketest.ps1
```

**Required Setup in Script:**
1. Update `$jwtToken` variable with a valid Supabase JWT
2. Update `$testUserID` with a real user UUID from your database
3. Update `$testAdminID` with a real admin user UUID from your database

### Option B: Manual cURL Tests
Use `curl` or PowerShell `Invoke-WebRequest` to test each endpoint:

#### 1. Get User Profile (Protected)
```powershell
$headers = @{ "Authorization" = "Bearer YOUR_JWT_TOKEN" }
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/users/me" `
    -Method GET `
    -Headers $headers `
    -ContentType "application/json"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "avatar_url": null,
    "metadata": {},
    "is_active": true,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

#### 2. Update User Profile (Protected)
```powershell
$headers = @{ "Authorization" = "Bearer YOUR_JWT_TOKEN" }
$body = @{
    full_name = "Jane Doe"
    phone = "+9876543210"
    address = "456 Oak Ave"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/v1/users/me" `
    -Method PUT `
    -Headers $headers `
    -Body $body `
    -ContentType "application/json"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "Jane Doe",
    "phone": "+9876543210",
    "address": "456 Oak Ave",
    ...
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

#### 3. Get Profile by ID (Admin Only)
```powershell
$headers = @{ "Authorization" = "Bearer ADMIN_JWT_TOKEN" }
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/users/550e8400-e29b-41d4-a716-446655440001" `
    -Method GET `
    -Headers $headers `
    -ContentType "application/json"
```

**Expected Response (200 OK):** Same profile structure as GET /me

#### 4. Deactivate User (Admin Only)
```powershell
$headers = @{ "Authorization" = "Bearer ADMIN_JWT_TOKEN" }
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/users/550e8400-e29b-41d4-a716-446655440001/deactivate" `
    -Method POST `
    -Headers $headers `
    -ContentType "application/json"
```

**Expected Response (204 No Content):**
```
[empty response body]
```

---

## Getting Valid JWT Tokens

### Method 1: Supabase Auth API
```powershell
# User sign-up / login
$signupBody = @{
    email = "test@example.com"
    password = "Test123!@"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "https://qudcvlcgfdfbliawwcwp.supabase.co/auth/v1/signup" `
    -Method POST `
    -Headers @{ "apikey" = "YOUR_SUPABASE_API_KEY" } `
    -Body $signupBody `
    -ContentType "application/json"

$token = ($response.Content | ConvertFrom-Json).session.access_token
Write-Host "JWT Token: $token"
```

### Method 2: Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Create or select a test user
3. Copy their session token from the user details

---

## Expected Test Results

| Endpoint | Method | Auth | Status | Notes |
|----------|--------|------|--------|-------|
| `/api/v1/users/me` | GET | Required | 200 | Returns logged-in user's profile |
| `/api/v1/users/me` | PUT | Required | 200 | Updates logged-in user's profile |
| `/api/v1/users/:id` | GET | Admin | 200 | Returns any user's profile |
| `/api/v1/users/:id/deactivate` | POST | Admin | 204 | Deactivates user (no response body) |
| `/api/v1/users/me` | GET | Missing | 401 | Unauthorized |
| `/api/v1/users/me` | PUT | Invalid Role | 403 | Forbidden |
| `/api/v1/users/invalid-id` | GET | Admin | 404 | Not found |
| `/api/v1/users/me` | PUT | Bad JSON | 400 | Bad request |

---

## Troubleshooting

### Server Won't Start: "Connection refused"
- ✅ Check `.env` file has correct `DB_PASSWORD`
- ✅ Verify `DB_SSL_MODE=require` is set
- ✅ Confirm migrations are executed in Supabase
- ✅ Test Supabase connection string locally: `psql "postgres://postgres:PASSWORD@qudcvlcgfdfbliawwcwp.supabase.co:5432/postgres"`

### Health Check Fails
- Server may not be running. Check terminal for error logs
- Port 8080 may be in use. Check: `netstat -ano | findstr :8080`

### JWT Token Invalid
- Ensure token is from Supabase Auth for the same project
- Check token expiry (default 1 hour)
- Verify token includes `user_id` claim

### 403 Forbidden on Admin Endpoints
- User role must be `admin` in Supabase `users` table
- Check `raw_user_meta_data` field for role claim

---

## Unit Tests (Already Passing ✅)

All 22 tests pass without requiring a live database:

```powershell
cd c:\Users\ALIFIAH\Downloads\Dev\ 3\backend
go test -v ./internal/services ./internal/handlers
```

**Test Coverage:**
- ✅ Service layer (8 tests): GetProfileForUser, UpdateProfile, DeactivateUser
- ✅ Handler layer (14 tests): All 4 endpoints with 200, 400, 401, 403, 404, 500 status codes
- ✅ Response format validation: trace_id, success flag, data structure

---

## Next Steps

1. **Obtain Supabase Password** → Update `.env`
2. **Start Server** → `.\api.exe`
3. **Get JWT Token** → Via Supabase Auth API or dashboard
4. **Run Smoke Tests** → Use PowerShell script or manual curl tests
5. **Verify All Endpoints** → Check status codes and response structures
6. **Integration Tests** → Create additional tests for edge cases

---

## Questions?

Refer to these files:
- API implementation: `internal/handlers/user_handler.go`
- Service logic: `internal/services/user_service.go`
- Data access: `internal/repository/user_repository.go`
- Migration SQL: `migrations/002_create_user_profiles.sql`
- Test cases: `internal/services/user_service_test.go`, `internal/handlers/user_handler_test.go`
