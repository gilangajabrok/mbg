# MBG Golang Backend - Updated Architecture Guide

## Overview

This is the **Golang backend** for the MBG (Makan Bergizi Gratis) meal distribution platform. The frontend remains a Next.js 16 React application while the backend is now a high-performance Golang REST API.

## Architecture Changes

### Old Stack
- **Frontend:** Next.js 16 + React 19 + TypeScript
- **Backend:** None (dummy data only)
- **Database:** None

### New Stack
- **Frontend:** Next.js 16 + React 19 + TypeScript (unchanged in `/app`)
- **Backend:** Golang 1.21+ with Gin web framework
- **Database:** PostgreSQL with GORM ORM
- **Authentication:** JWT tokens with bcrypt password hashing
- **API:** RESTful endpoints following REST conventions

## Project Structure

\`\`\`
Dev/
├── app/                          # Next.js Frontend (React)
│   ├── register/                 # Registration page
│   ├── login/                    # Login page
│   ├── dashboard/                # Main dashboard
│   ├── admin/                    # Admin portal
│   ├── parent/                   # Parent portal
│   ├── supplier/                 # Supplier portal
│   └── ...
├── components/                   # React components
├── lib/                          # Shared utilities
├── backend/                      # NEW: Golang backend
│   ├── cmd/api/                  # Entry point
│   │   └── main.go              # Server initialization & routes
│   ├── internal/
│   │   ├── database/            # Database connection
│   │   ├── handlers/            # HTTP request handlers
│   │   ├── middleware/          # Auth, logging, CORS
│   │   ├── models/              # Data models
│   │   └── utils/               # Helper functions
│   ├── config/                  # Configuration
│   ├── migrations/              # Database migrations
│   ├── go.mod                   # Go module definition
│   ├── go.sum                   # Dependency checksums
│   ├── .env.example             # Example environment vars
│   ├── README.md                # Backend documentation
│   └── Dockerfile               # Docker configuration
└── package.json                 # Frontend dependencies
\`\`\`

## Tech Stack Details

### Backend (Golang)
- **Language:** Go 1.21+
- **Web Framework:** Gin Gonic (fast, lightweight, production-ready)
- **ORM:** GORM (object-relational mapping for PostgreSQL)
- **Auth:** JWT (JSON Web Tokens) + bcrypt for passwords
- **Database:** PostgreSQL 12+
- **Environment:** godotenv for configuration

### Frontend (Unchanged)
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Radix UI

## Getting Started

### 1. Start PostgreSQL Database

\`\`\`bash
# Option 1: Docker (recommended)
docker run --name mbg-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15

# Option 2: Local PostgreSQL
# Ensure PostgreSQL is running and create database
createdb mbg
\`\`\`

### 2. Setup Backend

\`\`\`bash
cd backend
cp .env.example .env

# Update .env with your settings
# Then:
go mod download
go mod tidy
go run cmd/api/main.go

# Server runs on http://localhost:8000
\`\`\`

### 3. Update Frontend to Use API

Update your frontend components to call the Golang API:

\`\`\`typescript
// Before (dummy data)
import { mbgDummyData } from '@/lib/mbg-dummy-data'

// After (API calls)
const fetchUsers = async () => {
  const response = await fetch('http://localhost:8000/api/v1/users', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  return response.json()
}
\`\`\`

### 4. Start Frontend Dev Server

\`\`\`bash
npm run dev
# Frontend runs on http://localhost:3000
\`\`\`

## API Endpoints

All endpoints prefixed with `/api/v1`

### Authentication
- `POST /auth/register` — Register new user
- `POST /auth/login` — Login and get JWT token
- `POST /auth/refresh` — Refresh token
- `POST /auth/logout` — Logout

### Users
- `GET /users` — List all users
- `GET /users/:id` — Get user by ID
- `PUT /users/:id` — Update user
- `DELETE /users/:id` — Delete user

### Schools (Admin only)
- `GET /schools` — List schools
- `POST /schools` — Create school
- `GET /schools/:id` — Get school
- `PUT /schools/:id` — Update school
- `DELETE /schools/:id` — Delete school

### Meals
- `GET /meals` — List meals
- `POST /meals` — Create meal (admin)
- `GET /meals/:id` — Get meal
- `PUT /meals/:id` — Update meal (admin)
- `DELETE /meals/:id` — Delete meal (admin)

### Suppliers
- `GET /suppliers` — List suppliers
- `POST /suppliers` — Create supplier (admin)
- `GET /suppliers/:id` — Get supplier
- `PUT /suppliers/:id` — Update supplier
- `DELETE /suppliers/:id` — Delete supplier (admin)

### Orders
- `GET /orders` — List orders
- `POST /orders` — Create order
- `GET /orders/:id` — Get order
- `PUT /orders/:id` — Update order
- `DELETE /orders/:id` — Delete order

### Students
- `GET /students` — List students
- `POST /students` — Create student
- `GET /students/:id` — Get student
- `PUT /students/:id` — Update student
- `DELETE /students/:id` — Delete student

### Announcements
- `GET /announcements` — List announcements
- `POST /announcements` — Create announcement (admin)
- `GET /announcements/:id` — Get announcement
- `PUT /announcements/:id` — Update announcement (admin)
- `DELETE /announcements/:id` — Delete announcement (admin)

## Database Models

### User
- ID, FirstName, LastName, Email, Phone
- Password (hashed), Role (admin/parent/supplier)
- Address, IsActive, LastLoginAt
- Timestamps: CreatedAt, UpdatedAt, DeletedAt (soft delete)

### School
- ID, Name, Address, Phone, Email
- Principal, StudentsCount
- Timestamps

### Meal
- ID, Name, Description
- Nutrition: Calories, Protein, Carbs, Fat
- Allergens, SchoolID
- Timestamps

### MealPlan
- ID, StudentID, MealID
- StartDate, EndDate
- Timestamps

### Supplier
- ID, Name, Email, Phone, Address
- ContactPerson, UserID, Rating
- IsActive, Timestamps

### Order
- ID, SupplierID, SchoolID
- Status (pending/confirmed/delivered/cancelled)
- TotalAmount, OrderDate, DeliveryDate
- Notes, Timestamps

### Student
- ID, FirstName, LastName
- SchoolID, ParentID, DateOfBirth
- Grade, Allergies, DietaryNeeds
- Timestamps

### Announcement
- ID, Title, Content
- SchoolID, CreatedBy (UserID)
- IsActive, Timestamps

## Migration from Dummy Data to API

### Step 1: Migrate User Service

\`\`\`typescript
// Before
const users = mbgDummyData.users

// After
const [users, setUsers] = useState([])

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/api/v1/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }
  fetchUsers()
}, [])
\`\`\`

### Step 2: Update Authentication

\`\`\`typescript
// Login
const handleLogin = async (email: string, password: string) => {
  const response = await fetch('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const { token, user } = await response.json()
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  router.push('/dashboard')
}

// Register
const handleRegister = async (userData: FormData) => {
  const response = await fetch('http://localhost:8000/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  if (response.ok) {
    router.push('/login')
  }
}
\`\`\`

### Step 3: Create API Service Layer (Optional but Recommended)

\`\`\`typescript
// lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const apiClient = {
  async request(endpoint: string, options?: RequestInit) {
    const token = localStorage.getItem('token')
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    })
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return response.json()
  },

  users: {
    list: () => apiClient.request('/users'),
    get: (id: string) => apiClient.request(`/users/${id}`),
    update: (id: string, data: any) => 
      apiClient.request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => 
      apiClient.request(`/users/${id}`, { method: 'DELETE' })
  },

  meals: {
    list: () => apiClient.request('/meals'),
    get: (id: string) => apiClient.request(`/meals/${id}`),
    create: (data: any) => 
      apiClient.request('/meals', { method: 'POST', body: JSON.stringify(data) })
  },

  // ... add more methods for other resources
}
\`\`\`

## Performance Considerations

### Backend
- Gin is ~40x faster than Node.js frameworks for high-throughput
- Compiled binary (no runtime overhead)
- Efficient connection pooling to database
- Small memory footprint (typically <50MB vs 100MB+ for Node)

### Frontend
- Continue using Next.js caching strategies
- Implement React Query or SWR for API state management
- Leverage TypeScript for type safety with API responses

## Deployment

### Docker (Recommended)

\`\`\`bash
# Build backend image
cd backend
docker build -t mbg-api:latest .

# Run with database
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:pass@db:5432/mbg \
  -e JWT_SECRET=your-secret \
  mbg-api:latest
\`\`\`

### Production Environment Variables

\`\`\`env
GIN_MODE=release
JWT_SECRET=<strong-random-secret>
DATABASE_URL=postgresql://user:pass@prod-db:5432/mbg_prod
PORT=8000
CORS_ALLOWED_ORIGINS=https://app.mbg.id,https://admin.mbg.id
\`\`\`

## Troubleshooting

### Frontend can't reach backend
- Ensure backend is running on `http://localhost:8000`
- Check CORS settings in backend middleware
- Verify `NEXT_PUBLIC_API_URL` environment variable

### Database connection fails
- PostgreSQL must be running
- Check `.env` credentials
- Verify network connectivity

### JWT token issues
- Ensure `JWT_SECRET` is consistent between frontend/backend
- Check token expiration time
- Verify `Authorization` header format: `Bearer {token}`

## Next Steps

1. ✅ Backend API created with all core endpoints
2. ✅ Authentication system (register/login/refresh)
3. ✅ Database models and migrations ready
4. 🔄 Update frontend components to use API
5. 🔄 Implement error handling and loading states
6. 🔄 Add comprehensive API tests
7. 🔄 Setup CI/CD pipeline
8. 🔄 Deploy to production

## Support & Documentation

- **Backend Docs:** `backend/README.md`
- **Frontend Docs:** `.github/copilot-instructions.md`
- **API Testing:** Use Postman or Thunder Client
- **Questions:** Check issue tracker or contact team

---

**Status:** Backend ready for integration with frontend
**Last Updated:** November 2025
