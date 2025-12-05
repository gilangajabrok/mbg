# Frontend-Backend Integration - Quick Reference Card

## 🚀 Start Here

```powershell
# Terminal 1: Backend
cd backend
.\api.exe

# Terminal 2: Frontend  
npm run dev

# Terminal 3: Test
node test-integration.js
```

Expected: All tests pass ✅

---

## 📁 Key Files

| File | What It Does | When You Need It |
|------|--------------|------------------|
| `lib/api-client.ts` | HTTP client for backend | Reference implementation |
| `hooks/use-user-profile.ts` | React hook for profile data | Copy into your components |
| `.env.local` | Configuration | Already set up ✅ |
| `PARENT_PROFILE_EXAMPLE.tsx` | Working example | Copy and adapt for your pages |
| `INTEGRATION_QUICK_START.md` | Getting started guide | Read first |
| `test-integration.js` | Run tests | `node test-integration.js` |

---

## 💻 Example: Use the Hook

```tsx
import { useUserProfile } from "@/hooks/use-user-profile"

export default function ProfilePage() {
  const { profile, loading, error, updateProfile } = useUserProfile()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      <h1>{profile?.full_name}</h1>
      <button onClick={() => updateProfile({ full_name: "New Name" })}>
        Update
      </button>
    </div>
  )
}
```

---

## 🔗 API Endpoints Available

```typescript
// User Profile
await userApi.getProfile()              // GET /users/me
await userApi.updateProfile(data)       // PUT /users/me
await userApi.getProfileById(userId)    // GET /users/:id (admin)
await userApi.deactivateUser(userId)    // POST /users/:id/deactivate (admin)

// Generic
await apiClient.get(endpoint)
await apiClient.post(endpoint, data)
await apiClient.put(endpoint, data)
await apiClient.delete(endpoint)
```

---

## ✅ Check Status

```powershell
node test-integration.js
```

**With backend running:** Should show 4/4 passed
**Without backend:** Shows what's needed

---

## 📊 Response Format

All API responses:
```json
{
  "success": true,
  "data": { /* your data */ },
  "meta": {
    "trace_id": "uuid-for-debugging"
  }
}
```

---

## 🐛 Debug Tips

1. **Check Network Tab** (F12 → Network)
   - Should see request to `localhost:8080/api/v1/users/me`
   - Status should be 200 (success) or 401 (not logged in)

2. **Check Console** (F12 → Console)
   - Should not see red errors
   - API client logs: `[API] GET /users/me`

3. **Check Backend Logs**
   - Terminal where `.\api.exe` runs
   - Should show request and response

---

## 🎯 Migration Steps

For each page:

1. **Import the hook**
   ```tsx
   import { useUserProfile } from "@/hooks/use-user-profile"
   ```

2. **Replace mock state**
   ```tsx
   // Old:
   const [profile, setProfile] = useState({ name: "John" })
   
   // New:
   const { profile, loading, error } = useUserProfile()
   ```

3. **Replace handlers**
   ```tsx
   // Old:
   const handleSave = () => setProfile(editedProfile)
   
   // New:
   const handleSave = () => updateProfile(editedProfile)
   ```

4. **Add states**
   ```tsx
   if (loading) return <PageLoader />
   if (error) return <div>Error: {error.message}</div>
   ```

5. **Test in browser**
   - DevTools → Network tab should show API call
   - Page should display real data (not mock)

---

## ⚠️ Common Issues

| Problem | Solution |
|---------|----------|
| "Backend not responding" | Run `cd backend && .\api.exe` |
| "No JWT token" | User must be logged in |
| "401 Unauthorized" | Token expired, re-login |
| "403 Forbidden" | User doesn't have permission |
| "404 Not Found" | User profile doesn't exist |
| CORS error | Check backend CORS middleware |

---

## 📞 Help

1. Read: `INTEGRATION_QUICK_START.md`
2. See example: `PARENT_PROFILE_EXAMPLE.tsx`
3. Check docs: `FRONTEND_INTEGRATION_GUIDE.md`
4. Debug guide: `INTEGRATION_TEST_RESULTS.md`

---

## ⏱️ Time Estimates

- One page: 1 hour
- All 5-6 pages: 3-4 hours
- Admin features: 1-2 hours
- Deployment: 1-2 hours

**Total: ~4-5 hours**

---

## 🎓 What You Learned

✅ API client with JWT injection
✅ React hooks for data fetching
✅ Error handling patterns
✅ TypeScript integration
✅ Environment configuration
✅ Testing best practices

---

## Next Steps

1. [ ] Start backend: `.\api.exe`
2. [ ] Run test: `node test-integration.js`
3. [ ] Migrate one page
4. [ ] Test in browser
5. [ ] Migrate remaining pages
6. [ ] Deploy

---

**Ready?** Start with: `INTEGRATION_QUICK_START.md`
