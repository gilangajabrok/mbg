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
- Java 17 + Spring Boot 3.2
- PostgreSQL 15+
- JWT Authentication + Tenant Isolation
- Full RBAC (Super Admin, Admin, Supplier, Parent)

## Getting Started

### Prerequisites
- Node.js 18+
- Java 17 (for backend)
- PostgreSQL 15+

### Frontend Setup

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Run development server
npm run dev
```

Frontend runs at http://localhost:3000

### Backend Setup

See `backend/README.md` for detailed instructions.
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

## Implemented Modules

### Core Modules
- **Schools**: Manage school data & branches.
- **Students**: Student enrollment & data.
- **Meal Plans**: Subscriptions management.
- **Orders**: Procurement from Suppliers.
- **Distribution**: Tracking deliveries (Pending -> Delivered).
- **Quality Control**: Inspection records.
- **Financial**: Income/Expense tracking.
- **Announcements**: Broadcast system.
- **Parents**: Parent account management.

### Governance Features (Super Admin)
- **Document Approval**: Workflow for document submissions.
- **Audit Logs**: Full system activity tracking.
- **Organization Settings**: Multi-tenant management.
- **Dashboard**: Platform-wide analytics.

## Role-Based Access

- **Great Admin (Super Admin)**: Full system governance & multi-tenant control.
- **Admin**: School operations (Students, Meals, Orders).
- **Supplier**: Order fulfillment & Profile.
- **Parent**: Meal selection & Student monitoring.

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
