# MBG Project - Quick Start Guide

## 📋 Overview

Your MBG project now has a **hybrid architecture**:
- **Frontend:** Next.js 16 + React 19 + TypeScript (in `/app`)
- **Backend:** Java (in `/backend`) - 🚧 **In Development**

## 🚀 Quick Start

### Frontend Setup

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
# App runs on http://localhost:3000
\`\`\`

### Backend Setup

🚧 **Java backend is currently in development**

Backend akan dikonfigurasi setelah menerima modul tambahan dari user.

## 📁 Project Structure

\`\`\`
mbg/
├── app/                    # Next.js Frontend (React)
├── components/             # React Components
├── lib/                    # Frontend Utilities
├── hooks/                  # Custom React Hooks
├── backend/                # Java Backend (In Development)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/mbg/
│   │   │   └── resources/
│   │   └── test/java/
│   └── README.md
└── public/                 # Static Assets
\`\`\`

## 🛠️ Development Commands

### Frontend

\`\`\`bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint check
\`\`\`

### Backend

🚧 Backend commands akan ditambahkan setelah setup Java selesai.

## 📚 Documentation

- **Frontend:** See `README.md` and various guides in root
- **Backend:** See `backend/README.md`

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
| **Backend** | Java | Core language (In Development) |
| | TBD | Framework (awaiting modules) |
| | TBD | Database |
| | TBD | ORM |
| | JWT | Authentication |

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
