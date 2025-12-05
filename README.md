# MBG Platform

Enterprise meal distribution management platform with role-based access for Super Admin, Admin, Suppliers, and Parents.

## Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion
- NextAuth.js

**Backend:**
- Go (Gin framework)
- PostgreSQL (Supabase)
- JWT authentication

## Getting Started

### Prerequisites
- Node.js 18+
- Go 1.21+
- PostgreSQL (or Supabase account)

### Frontend Setup

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

Frontend runs at http://localhost:3000

### Backend Setup

```bash
cd backend

# Create .env from example
cp .env.example .env
# Edit .env with your database credentials

# Run migrations (if needed)
# psql -d your_database < migrations/001_initial_schema.sql

# Start backend
go run cmd/api/main.go
```

Backend runs at http://localhost:8080

### Super Admin Login (Dev)

After seeding the database with the super admin user:
- Email: `superadmin@example.com`
- Password: `SuperStrongPassword123!`

## Project Structure

```
.
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin portal
│   ├── parent/            # Parent portal
│   ├── supplier/          # Supplier portal
│   ├── great/             # Super admin portal
│   └── auth/              # Auth pages
├── components/            # React components
├── lib/                   # Utilities & API client
├── hooks/                 # React hooks
├── backend/
│   ├── cmd/api/          # Main entry point
│   ├── internal/         # Business logic
│   ├── migrations/       # Database migrations
│   └── pkg/              # Shared packages
```

## Role-Based Access

- **Super Admin** (`super_admin`) - Full system access
- **Admin** - School management
- **Supplier** - Meal plans & orders
- **Parent** - Student enrollment & meal selection

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-jwt-secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your-anon-key
```

## Security Notes

- Never commit `.env` or `.env.local` files
- Rotate secrets regularly
- Use strong passwords for super admin accounts
- Enable 2FA in production

## License

Private - All rights reserved
