# MBG Project - Quick Start Guide

## 📋 Overview

Your MBG project now has a **hybrid architecture**:
- **Frontend:** Next.js 16 + React 19 + TypeScript (in `/app`)
- **Backend:** Golang + Gin + PostgreSQL (in `/backend`)

## 🚀 Quick Start

### Option 1: Docker (Recommended - Easiest)

\`\`\`bash
cd backend
docker-compose up -d

# Wait for services to start
sleep 5

# Test the API
curl http://localhost:8000/health
# Response: {"status":"ok"}
\`\`\`

**Services running:**
- API: `http://localhost:8000/api/v1`
- PostgreSQL: `localhost:5432`
- Frontend: `http://localhost:3000` (run from root: `npm run dev`)

### Option 2: Manual Setup (Local Development)

#### 1. Start PostgreSQL

\`\`\`powershell
# Option A: Docker
docker run --name mbg-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15

# Option B: Install PostgreSQL locally and ensure it's running
\`\`\`

#### 2. Setup Backend

\`\`\`powershell
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
go mod download
go mod tidy

# Run development server
go run cmd/api/main.go
# Server runs on http://localhost:8000
\`\`\`

#### 3. Setup Frontend

\`\`\`powershell
cd ..  # Back to root

# Install dependencies
npm install

# Start dev server
npm run dev
# App runs on http://localhost:3000
\`\`\`

## 📁 Project Structure

\`\`\`
Dev/
├── app/                    # Next.js Frontend (React)
├── components/             # React Components
├── lib/                    # Frontend Utilities
├── backend/                # Golang Backend
│   ├── cmd/api/           # Entry Point
│   ├── internal/          # Core Logic
│   │   ├── handlers/      # HTTP Handlers
│   │   ├── models/        # Database Models
│   │   ├── middleware/    # Auth, CORS, Logging
│   │   └── database/      # DB Connection
│   ├── .env.example       # Env Template
│   ├── go.mod             # Go Dependencies
│   ├── Dockerfile         # Docker Config
│   ├── docker-compose.yml # Docker Compose
│   ├── Makefile           # Build Commands
│   └── README.md          # Backend Docs
└── .github/               # GitHub Configs
\`\`\`

## 🔑 Key Endpoints

### Authentication
\`\`\`bash
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
\`\`\`

### Resources (all with `/api/v1` prefix)
\`\`\`
GET/POST   /users
GET/POST   /schools
GET/POST   /meals
GET/POST   /suppliers
GET/POST   /orders
GET/POST   /students
GET/POST   /announcements
\`\`\`

## 🛠️ Development Commands

### Backend (from `/backend` directory)

\`\`\`powershell
# Development
go run cmd/api/main.go

# Build
go build -o mbg-api cmd/api/main.go

# With Makefile (if you have make installed)
make dev
make build
make docker-up
\`\`\`

### Frontend (from root directory)

\`\`\`powershell
npm run dev      # Development server
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint check
\`\`\`

## 📚 Documentation

- **Frontend:** See `.github/copilot-instructions.md`
- **Backend:** See `backend/README.md`
- **Architecture:** See `backend/GOLANG_ARCHITECTURE.md`
- **API Reference:** See `backend/README.md` (API Endpoints section)

## 🧪 Test the API

### Using curl

\`\`\`bash
# Health check
curl http://localhost:8000/health

# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@test.com",
    "phone": "+1234567890",
    "password": "Test123!@",
    "confirm_password": "Test123!@",
    "role": "parent",
    "address": "123 Main St"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Test123!@"}'

# Get users (requires token from login)
curl http://localhost:8000/api/v1/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
\`\`\`

### Using Postman/Thunder Client

1. Import the API endpoints from `backend/README.md`
2. Set authorization header: `Authorization: Bearer {token}`
3. Test endpoints

## 🔐 Environment Variables

### Backend (backend/.env)

\`\`\`env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=mbg

# Server
PORT=8000
GIN_MODE=debug

# Security
JWT_SECRET=your-secret-key-change-this

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
\`\`\`

### Frontend (root/.env.local - optional)

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
\`\`\`

## 🐛 Troubleshooting

### Backend won't start
\`\`\`powershell
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Check if database is running
# For Docker: docker ps
# For local: psql -U postgres
\`\`\`

### Database connection error
\`\`\`powershell
# Verify PostgreSQL is running
# Create database if missing
createdb mbg

# Check connection string in .env
\`\`\`

### Frontend can't reach backend
1. Ensure backend is running: `http://localhost:8000/health`
2. Check CORS in `backend/internal/middleware/middleware.go`
3. Verify `.env` variables

## 📦 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 | Web framework |
| | React 19 | UI library |
| | TypeScript | Type safety |
| | Tailwind CSS v4 | Styling |
| | Framer Motion | Animations |
| **Backend** | Golang 1.21 | Core language |
| | Gin Gonic | Web framework |
| | PostgreSQL 15 | Database |
| | GORM | ORM |
| | JWT | Authentication |
| | bcrypt | Password hashing |

## 🎯 Next Steps

1. ✅ Backend API created and running
2. ✅ Database schema ready
3. ✅ Authentication system implemented
4. 📝 **TODO:** Connect frontend to backend API
5. 📝 **TODO:** Replace dummy data with API calls
6. 📝 **TODO:** Add form validation
7. 📝 **TODO:** Implement error handling
8. 📝 **TODO:** Add comprehensive tests
9. 📝 **TODO:** Setup CI/CD pipeline
10. 📝 **TODO:** Deploy to production

## 🆘 Need Help?

### Common Issues

**Issue:** Port 8000 already in use
\`\`\`powershell
# Kill process using port 8000
Get-Process -Name "mbg*" | Stop-Process
# Or change PORT in .env to 8001
\`\`\`

**Issue:** Database connection failed
\`\`\`powershell
# Verify PostgreSQL container is running
docker ps | findstr postgres

# Check connection with psql
psql -h localhost -U postgres -d mbg
\`\`\`

**Issue:** CORS errors in frontend
\`\`\`
Check backend/internal/middleware/middleware.go
Update CORS_ALLOWED_ORIGINS in .env
\`\`\`

## 📞 Support

- **Documentation:** Read backend/README.md and .github/copilot-instructions.md
- **API Testing:** Use Postman or VS Code Thunder Client extension
- **Code Issues:** Check error messages in console/logs

---

**Last Updated:** November 2025
**Status:** ✅ Ready for development
