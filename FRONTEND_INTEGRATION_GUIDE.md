/**
 * Integration Guide - Connecting Frontend to Backend API
 * 
 * This document shows step-by-step how to integrate the User Profile Module API
 * into your existing frontend components.
 */

# Frontend Integration Guide - User Profile Module

## Overview

The backend User Profile Module exposes 4 API endpoints:
- `GET /api/v1/users/me` — Get current user's profile (protected)
- `PUT /api/v1/users/me` — Update current user's profile (protected)
- `GET /api/v1/users/:id` — Get any user's profile (admin only)
- `POST /api/v1/users/:id/deactivate` — Deactivate user (admin only)

## Setup (One-time)

### 1. Set API Base URL
Add to `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### 2. Extend NextAuth Session (for Supabase JWT)
Update `lib/auth.ts` to include the Supabase JWT token in the session:

```typescript
callbacks: {
  async session({ session, token }) {
    // Include Supabase JWT in session
    (session as any).supabaseToken = token.supabaseToken
    return session
  },
  async jwt({ token, account, user }) {
    // Store Supabase token from auth provider
    if (account?.access_token) {
      token.supabaseToken = account.access_token
    }
    return token
  },
}
```

### 3. Import Utilities
Available in:
- `lib/api-client.ts` — Low-level API functions
- `hooks/use-user-profile.ts` — High-level user profile hook

## Usage Examples

### Example 1: Basic Profile Display (with live data)

**Before (Mock Data):**
```tsx
export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    // ... mock data
  })
  // ...
}
```

**After (Live Data):**
```tsx
"use client"

import { useUserProfile } from "@/hooks/use-user-profile"
import { PageLoader } from "@/components/page-loader"

export default function ProfilePage() {
  const { profile, loading, error, refetch } = useUserProfile()

  if (loading) return <PageLoader />
  if (error) return <div>Failed to load profile: {error.message}</div>
  if (!profile) return <div>No profile found</div>

  return (
    <div>
      <h1>{profile.full_name}</h1>
      <p>Phone: {profile.phone || "Not provided"}</p>
      <p>Address: {profile.address || "Not provided"}</p>
      {!profile.is_active && <p className="text-red-600">Account Deactivated</p>}
    </div>
  )
}
```

### Example 2: Profile Form with Update

**Before (No API call):**
```tsx
const handleSave = () => {
  setProfile(editedProfile)  // Just update local state
  toast({ title: "Profile Updated" })
}
```

**After (With API Integration):**
```tsx
"use client"

import { useUserProfile } from "@/hooks/use-user-profile"
import { useToast } from "@/hooks/use-toast"

export default function ProfileEditPage() {
  const { profile, updateProfile, error } = useUserProfile()
  const { toast } = useToast()
  const [editedProfile, setEditedProfile] = useState(profile || {})

  const handleSave = async () => {
    try {
      await updateProfile({
        full_name: editedProfile.full_name,
        phone: editedProfile.phone,
        address: editedProfile.address,
      })
      
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved to the backend.",
      })
    } catch (err) {
      toast({
        title: "Update Failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave() }}>
      <input 
        value={editedProfile.full_name} 
        onChange={(e) => setEditedProfile({...editedProfile, full_name: e.target.value})}
      />
      <input 
        value={editedProfile.phone} 
        onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
      />
      <button type="submit">Save Profile</button>
    </form>
  )
}
```

### Example 3: Admin View - Get User by ID

```tsx
"use client"

import { useState } from "react"
import { userApi } from "@/lib/api-client"

export default function AdminUserViewPage({ userId }: { userId: string }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userApi.getProfileById(userId)
        if (response.success) {
          setProfile(response.data)
        }
      } catch (error) {
        console.error("Failed to load user profile:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [userId])

  if (loading) return <PageLoader />
  if (!profile) return <div>User not found</div>

  return (
    <div>
      <h2>{profile.full_name}</h2>
      <p>Active: {profile.is_active ? "Yes" : "No"}</p>
      {/* Admin deactivate button */}
      <button onClick={() => userApi.deactivateUser(userId)}>
        Deactivate User
      </button>
    </div>
  )
}
```

### Example 4: Direct API Calls (Low-level)

For custom endpoints not covered by `userApi`:

```tsx
import { apiClient } from "@/lib/api-client"

// GET request
const { data } = await apiClient.get("/schools")

// POST request
const { data } = await apiClient.post("/orders", {
  school_id: "123",
  items: [...]
})

// PUT request
const { data } = await apiClient.put("/settings", {
  theme: "dark"
})

// DELETE request
await apiClient.delete("/resources/456")
```

## Error Handling

All API calls return errors with tracing:

```tsx
import { ApiError } from "@/lib/api-client"

try {
  await userApi.updateProfile({ full_name: "" })
} catch (error) {
  const apiError = error as ApiError
  
  console.log(`Status: ${apiError.status}`)
  console.log(`Code: ${apiError.code}`)
  console.log(`Message: ${apiError.message}`)
  console.log(`Trace ID: ${apiError.traceId}`)  // ← Send to support/logs
}
```

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "is_active": true,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "full_name is required"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

## Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET /users/me returned profile |
| 201 | Created | New resource created |
| 204 | No Content | DELETE/deactivate successful |
| 400 | Bad Request | Invalid input (validation error) |
| 401 | Unauthorized | Missing/invalid JWT token |
| 403 | Forbidden | User lacks permission (not admin) |
| 404 | Not Found | User/resource doesn't exist |
| 500 | Server Error | Database or internal error |

## Migration Checklist

### Phase 1: Core Setup ✅
- [ ] Add `NEXT_PUBLIC_API_URL` to `.env.local`
- [ ] Update NextAuth callbacks to include Supabase JWT
- [ ] Import `useUserProfile` hook in your components

### Phase 2: Convert Pages
- [ ] `/app/parent/profile/page.tsx` — Replace mock with `useUserProfile`
- [ ] `/app/student/profile/page.tsx` — Same integration
- [ ] `/app/supplier/profile/page.tsx` — Same integration
- [ ] `/app/admin/users/:id/page.tsx` — Use `userApi.getProfileById`

### Phase 3: Add Admin Functions
- [ ] Deactivate user button (admin only)
- [ ] Batch user operations
- [ ] User audit log

### Phase 4: Enhance Features
- [ ] Avatar upload integration
- [ ] Profile picture validation
- [ ] Metadata custom fields

## Testing

### Manual Testing
1. Start backend: `cd backend && go build -o api.exe ./cmd/api && .\api.exe`
2. Start frontend: `npm run dev`
3. Log in via Supabase Auth
4. Check browser DevTools → Network tab
5. Verify API calls are made to `http://localhost:8080/api/v1/users/me`

### Network Debugging
Browser DevTools shows:
- Request headers: `Authorization: Bearer <JWT>`
- Response: Includes `meta.trace_id`
- Status: 200 (success) or error code (4xx/5xx)

## Troubleshooting

### "Authentication required but no session found"
- User not logged in
- Fix: Add `<SessionProvider>` in layout.tsx (already done)

### "No JWT token available for authentication"
- Session exists but JWT not found
- Fix: Update NextAuth callbacks to store Supabase token in session

### 401 Unauthorized
- JWT token is invalid or expired
- Fix: Re-login to get a fresh token

### 403 Forbidden
- User trying to access admin endpoints without admin role
- Fix: Check user role in Supabase `users` table

### 404 Not Found
- User profile doesn't exist in database
- Fix: Create profile via `/api/v1/users/me` PUT (auto-creates if needed)

### CORS Error (frontend + backend on different ports)
- Error: "Access to XMLHttpRequest has been blocked by CORS policy"
- Fix: Backend CORS middleware should allow `http://localhost:3000`
- Check: `internal/middleware/cors.go` has correct allowed origins

## Advanced: Custom Hooks

Create domain-specific hooks for your use cases:

```tsx
// hooks/use-admin-users.ts
export function useAdminUsers() {
  const [users, setUsers] = useState([])
  
  const deactivateUser = async (userId: string) => {
    await userApi.deactivateUser(userId)
    setUsers(prev => prev.map(u => 
      u.user_id === userId ? {...u, is_active: false} : u
    ))
  }
  
  return { users, deactivateUser }
}
```

## Performance Tips

1. **Memoize Profiles**: Cache fetched profiles locally
   ```tsx
   const profile = useUserProfile()
   const memoizedProfile = useMemo(() => profile, [profile?.user_id])
   ```

2. **Debounce Updates**: Avoid rapid API calls on input
   ```tsx
   const debouncedUpdate = useDebounce((data) => updateProfile(data), 500)
   ```

3. **Pagination**: For list endpoints
   ```tsx
   const { data } = await apiClient.get("/users?page=1&limit=20")
   ```

4. **Background Sync**: Refetch stale data
   ```tsx
   const { refetch } = useUserProfile()
   setInterval(refetch, 5 * 60 * 1000)  // Every 5 minutes
   ```

## Next Steps

1. Update `.env.local` with `NEXT_PUBLIC_API_URL`
2. Test one page component with `useUserProfile`
3. Verify API calls in browser DevTools
4. Migrate remaining profile pages
5. Add admin pages for user management

---

**Need Help?**
- API Docs: `backend/SMOKE_TESTING_GUIDE.md`
- Example: `app/parent/profile/page.tsx` (after migration)
- Backend Tests: `backend/internal/handlers/user_handler_test.go` (reference implementation)
