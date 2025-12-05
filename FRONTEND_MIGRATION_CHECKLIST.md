# Frontend Integration Checklist - User Profile Module

## 🎯 Objective
Connect all frontend pages that display/edit user profiles to the live backend API.

---

## ✅ Phase 1: Setup (Do Once)

- [ ] **Add API URL to environment**
  - [ ] Copy `.env.local.example` to `.env.local`
  - [ ] Update `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`
  - [ ] Verify backend is running on port 8080

- [ ] **Verify API client is installed**
  - [ ] `lib/api-client.ts` exists
  - [ ] `hooks/use-user-profile.ts` exists
  - [ ] Both files have no TypeScript errors

- [ ] **Update NextAuth to include JWT token**
  - [ ] Edit `lib/auth.ts`
  - [ ] Add Supabase token to JWT callback
  - [ ] Add Supabase token to session callback
  - Reference: See "NextAuth JWT Integration" section below

---

## ✅ Phase 2: Convert Profile Pages

These are the main pages to migrate:

### Parent Profile
- [ ] `app/parent/profile/page.tsx`
  - [ ] Import `useUserProfile` hook
  - [ ] Replace mock `useState` with hook
  - [ ] Add loading state (use `<PageLoader />`)
  - [ ] Add error state with error message
  - [ ] Replace `handleSave` to call `updateProfile()`
  - [ ] Test in browser: verify API call appears in DevTools
  - Reference: `PARENT_PROFILE_EXAMPLE.tsx`

### Student Profile
- [ ] `app/student/profile/page.tsx`
  - Same steps as Parent Profile

### Supplier Profile
- [ ] `app/supplier/profile/page.tsx`
  - Same steps as Parent Profile

### Admin User View
- [ ] `app/admin/users/:id/page.tsx`
  - [ ] Use `userApi.getProfileById(userId)` instead of mock
  - [ ] Add admin-only deactivate button
  - [ ] Test that non-admin users get 403 error

### Staff/Teacher Profile
- [ ] `app/staff/profile/page.tsx` or similar
  - Same steps as Parent Profile

---

## ✅ Phase 3: Add Admin Features

### User Management Dashboard
- [ ] Create admin page for user list (if not exists)
  - [ ] Display all users with `api.get("/users")`
  - [ ] Show is_active status
  - [ ] Add deactivate button for each user

### Batch Operations (Optional)
- [ ] Deactivate multiple users at once
- [ ] Export user list to CSV
- [ ] Search/filter users

---

## 📋 Testing Checklist

### Before Starting a Page Migration
1. [ ] Backend server running: `cd backend && .\api.exe`
2. [ ] Frontend server running: `cd . && npm run dev`
3. [ ] Logged in via auth (parent/student/supplier/admin account)
4. [ ] Browser DevTools Network tab open

### During Page Migration
1. [ ] Component imports without errors
2. [ ] Page loads without crashing
3. [ ] Loading state shows while data fetches
4. [ ] Profile data displays correctly
5. [ ] Edit button works and shows form
6. [ ] Save button calls API (check Network tab)
7. [ ] Success toast appears after save
8. [ ] Updated data displays on page

### After Page Migration
1. [ ] Page works on first load
2. [ ] Page works after refresh
3. [ ] Page works with bad/expired token (shows error)
4. [ ] Deactivated users see appropriate message
5. [ ] Admin can view other users' profiles
6. [ ] Admin can deactivate users

---

## 🔧 Common Issues & Solutions

### Issue: "useUserProfile is not exported from '/lib'"
**Solution:** Verify `hooks/use-user-profile.ts` exists and has `export function useUserProfile`

### Issue: "No JWT token available for authentication"
**Solution:** 
1. Verify NextAuth is storing token in session
2. Update `lib/auth.ts` JWT callback (see section below)
3. Check that Supabase is returning JWT in auth response

### Issue: 404 Not Found when fetching profile
**Solution:**
1. Verify migrations are run: `001_initial_schema.sql`, `002_create_user_profiles.sql`
2. Check that logged-in user exists in `users` table
3. Check that user has a row in `user_profiles` table

### Issue: CORS Error
**Solution:**
1. Check backend CORS middleware allows `http://localhost:3000`
2. Verify `API_URL` in frontend is correct
3. Check that `Authorization` header is being sent

### Issue: Page shows loading forever
**Solution:**
1. Check browser DevTools Network tab
2. Look for failed API requests (red error)
3. Check backend server logs for error
4. Verify JWT token is valid (check expiry)

### Issue: Edit form doesn't save
**Solution:**
1. Verify `updateProfile` function is called
2. Check Network tab for PUT request to `/api/v1/users/me`
3. Look for validation errors (400 response)
4. Check browser console for JavaScript errors

---

## 🔐 NextAuth JWT Integration

Add this to `lib/auth.ts` callbacks:

```typescript
callbacks: {
  async jwt({ token, account, user }) {
    // Store Supabase JWT when user signs in
    if (account?.access_token) {
      token.supabaseToken = account.access_token
    }
    // Preserve token on subsequent calls
    return token
  },

  async session({ session, token }) {
    // Include Supabase token in session
    (session as any).supabaseToken = token.supabaseToken as string
    return session
  },
}
```

This allows the API client to access the JWT via:
```typescript
const session = await getSession()
const token = (session as any).supabaseToken
```

---

## 📊 Migration Progress Tracker

Copy this table and update as you progress:

| Page | Status | Date Started | Date Completed | Notes |
|------|--------|--------------|-----------------|-------|
| parent/profile | [ ] | | | |
| student/profile | [ ] | | | |
| supplier/profile | [ ] | | | |
| admin/users/:id | [ ] | | | |
| staff/profile | [ ] | | | |
| admin/users (list) | [ ] | | | |

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Update `.env.local` with production API URL
  ```env
  NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
  ```

- [ ] Update `NEXTAUTH_URL` to production domain
  ```env
  NEXTAUTH_URL=https://app.yourdomain.com
  ```

- [ ] Update `NEXTAUTH_SECRET` with secure random value
  ```bash
  openssl rand -base64 32
  ```

- [ ] Test OAuth providers with production credentials

- [ ] Verify all profile pages work on production backend

- [ ] Monitor logs for API errors after deployment

---

## 💡 Tips for Faster Migration

1. **Use the example as template**: Copy `PARENT_PROFILE_EXAMPLE.tsx` and modify for other pages
2. **Test one page thoroughly first**: Get one page working perfectly before moving to next
3. **Use browser DevTools**: Network tab shows exactly what API calls are being made
4. **Check backend logs**: Terminal where backend runs shows errors
5. **Verify migrations first**: Before testing, make sure migrations ran successfully

---

## 📚 Related Documentation

- Backend API Docs: `backend/SMOKE_TESTING_GUIDE.md`
- Integration Guide: `FRONTEND_INTEGRATION_GUIDE.md`
- Example Component: `PARENT_PROFILE_EXAMPLE.tsx`
- API Client Code: `lib/api-client.ts`
- Hook Code: `hooks/use-user-profile.ts`

---

## ✉️ Questions?

If you encounter issues:
1. Check the "Common Issues & Solutions" section above
2. Review the example component: `PARENT_PROFILE_EXAMPLE.tsx`
3. Check browser DevTools → Console for errors
4. Check backend logs for API errors
5. Read `FRONTEND_INTEGRATION_GUIDE.md` for detailed examples

**Success Criteria:**
- ✅ All profile pages display data from backend API
- ✅ All edit forms update data via API
- ✅ Loading/error states work correctly
- ✅ Admin features (user deactivate) work
- ✅ All tests pass in browser DevTools Network tab
