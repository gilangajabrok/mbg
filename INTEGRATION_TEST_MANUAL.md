# Frontend-Backend Integration Testing Guide

## Quick Start

### Step 1: Start the Backend Server

```powershell
cd "c:\Users\ALIFIAH\Downloads\Dev 3\backend"
.\api.exe
```

**Expected Output:**
```
Starting MBG Backend Server...
✓ Database connected successfully
✓ Server listening on 0.0.0.0:8080
```

### Step 2: Start the Frontend Server

In a new terminal:
```powershell
cd "c:\Users\ALIFIAH\Downloads\Dev 3"
npm run dev
```

**Expected Output:**
```
> dev
> next dev
- ready started server on 0.0.0.0:3000
- event compiled client and server successfully
```

### Step 3: Verify Backend is Running

In another terminal, test the health endpoint:
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health" -Method GET
```

**Expected Response (Status 200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Integration Test Checklist

### Test 1: Backend is Accessible
```powershell
# Should return 200 OK
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health" -Method GET
```

**Pass Criteria:** Status code is 200

---

### Test 2: Frontend Can Start
```powershell
cd "c:\Users\ALIFIAH\Downloads\Dev 3"
npm run dev
```

**Pass Criteria:** 
- Server starts on port 3000
- No TypeScript errors
- No missing module errors

---

### Test 3: Frontend Environment is Configured
Check `.env.local`:

```powershell
cat .env.local | Select-String "NEXT_PUBLIC_API_URL"
```

**Pass Criteria:** Output shows:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

---

### Test 4: Verify NextAuth Session (if logged in)

Open browser DevTools → Application → Cookies:
- Look for `next-auth.session-token` cookie
- This means user is authenticated

---

### Test 5: Check API Call in Browser

1. Open browser to `http://localhost:3000`
2. Log in via Supabase Auth
3. Open browser DevTools → Network tab
4. Navigate to a profile page (e.g., `/parent/profile`)
5. Look for request to `http://localhost:8080/api/v1/users/me`

**Pass Criteria:**
- Request appears in Network tab
- Status code is 200
- Response contains `data.full_name`, `data.user_id`, `meta.trace_id`

---

### Test 6: Test Unauthenticated Access (401)

```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/users/me" `
    -Method GET `
    -ErrorAction SilentlyContinue | Select-Object StatusCode
```

**Pass Criteria:** Returns status 401 Unauthorized

---

### Test 7: Test Profile Update (with JWT)

After logging in, check the browser Network tab when editing and saving a profile:

1. Go to profile page
2. Click Edit
3. Change name and click Save
4. Look in DevTools → Network for PUT request to `/api/v1/users/me`

**Pass Criteria:**
- PUT request appears with status 200
- Response body contains updated `full_name`
- Toast notification shows "Profile Updated"

---

### Test 8: Test Error Handling

Try these error scenarios:

**Empty Full Name (400 Bad Request):**
```powershell
$body = @{ full_name = "" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/users/me" `
    -Method PUT `
    -Headers @{ "Authorization" = "Bearer YOUR_JWT_TOKEN" } `
    -Body $body `
    -ContentType "application/json" `
    -ErrorAction SilentlyContinue
```

**Pass Criteria:** Status is 400 with error message about validation

---

### Test 9: Test Admin Endpoints (403 for non-admin)

```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/users/550e8400-e29b-41d4-a716-446655440000/deactivate" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer YOUR_JWT_TOKEN" } `
    -ContentType "application/json" `
    -ErrorAction SilentlyContinue
```

**Pass Criteria (non-admin user):** Status is 403 Forbidden

---

### Test 10: Response Format Validation

Check that all API responses have the correct structure:

```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "full_name": "string",
    "phone": "string",
    "address": "string",
    "avatar_url": "string",
    "metadata": {},
    "is_active": true,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  },
  "meta": {
    "trace_id": "uuid"
  }
}
```

**Pass Criteria:**
- All responses include `success`, `data`, `meta`
- All responses include `meta.trace_id`
- Data fields match UserProfile type

---

## Browser DevTools Network Inspection

### How to Check API Calls

1. **Open DevTools:**
   - Press `F12` or right-click → Inspect
   - Click "Network" tab

2. **Make a request:**
   - Navigate to a page that calls the API (e.g., profile page)
   - Look for requests starting with `api.v1` or `localhost:8080`

3. **Inspect Request:**
   - Click on the request
   - Check "Headers" tab for:
     - `Authorization: Bearer <JWT>`
     - `Content-Type: application/json`

4. **Inspect Response:**
   - Click on the request
   - Check "Response" tab for JSON structure
   - Look for `trace_id` in `meta` field

---

## Common Issues & Solutions

### Issue: "Cannot GET /api/v1/health"
**Cause:** Backend not running
**Solution:** Start backend: `cd backend && .\api.exe`

### Issue: "Connection refused" in Network tab
**Cause:** Frontend can't connect to backend
**Solution:** 
1. Verify backend is running on port 8080
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check firewall isn't blocking port 8080

### Issue: 401 Unauthorized on profile page
**Cause:** User not logged in or JWT expired
**Solution:**
1. Log out and log back in
2. Check browser cookies for `next-auth.session-token`
3. Verify Supabase credentials are correct

### Issue: 403 Forbidden on admin endpoints
**Cause:** User doesn't have admin role
**Solution:**
1. Check user role in Supabase `users` table
2. Update `raw_user_meta_data` to include `role: "admin"`

### Issue: CORS error in browser console
**Cause:** Backend CORS not allowing frontend origin
**Solution:**
1. Check backend CORS middleware
2. Verify `Access-Control-Allow-Origin` header includes `http://localhost:3000`

---

## Automated Test Script

Run the integration test batch file:

```powershell
cd "c:\Users\ALIFIAH\Downloads\Dev 3"
.\test-integration.bat
```

This will check:
- ✓ Backend health
- ✓ API response format
- ✓ Frontend configuration
- ✓ Environment variables

---

## Performance Checklist

Before considering integration "complete":

- [ ] API calls complete within 1 second
- [ ] Profile page loads in under 2 seconds
- [ ] Edit/save operation completes in under 1 second
- [ ] No excessive API calls (Network tab shows 1-2 requests, not repeated calls)
- [ ] Browser console has no errors
- [ ] Loading states are visible during API calls

---

## Mock Data vs Real API

### Current Setup (Before Migration)
- Profile pages show **mock data** (hardcoded in component)
- No API calls are made
- Data is local to component state only

### After Integration
- Profile pages fetch **real data** from backend
- API calls appear in Network tab
- Data persists when user logs out/in
- Changes sync across browser tabs

---

## Next Steps

1. **Complete one page:** Migrate `app/parent/profile/page.tsx` using example
2. **Test thoroughly:** Follow the test checklist above
3. **Document findings:** Note any API issues or unexpected behaviors
4. **Migrate remaining pages:** Use the same pattern for other profile pages
5. **Add admin features:** Implement user deactivate button

---

## Support Resources

- **Frontend Integration Guide:** `FRONTEND_INTEGRATION_GUIDE.md`
- **Migration Checklist:** `FRONTEND_MIGRATION_CHECKLIST.md`
- **Example Component:** `PARENT_PROFILE_EXAMPLE.tsx`
- **Backend API Docs:** `backend/SMOKE_TESTING_GUIDE.md`
- **API Client Code:** `lib/api-client.ts`
- **Hook Code:** `hooks/use-user-profile.ts`

---

## Success Criteria

✅ Integration is successful when:

1. Backend server starts without errors
2. Frontend server starts without errors
3. Health check endpoint responds with 200
4. Frontend can reach backend on `http://localhost:8080`
5. Profile pages show real user data (not mock data)
6. Edit/save operations update data in backend
7. Browser DevTools shows API calls with correct headers/responses
8. No CORS or authentication errors in browser console
9. Loading and error states display correctly
10. All pages in migration checklist are complete

---

## Troubleshooting Checklist

Before asking for help:

- [ ] Backend is running: `cd backend && .\api.exe`
- [ ] Frontend is running: `cd . && npm run dev`
- [ ] `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`
- [ ] No TypeScript errors in terminal
- [ ] Browser console (F12) is checked for errors
- [ ] Network tab shows API calls (F12 → Network)
- [ ] User is logged in (check cookies)
- [ ] Database migrations are complete (in Supabase)

If issues persist, check:
- Backend logs: Look for error messages when API is called
- Frontend logs: Check browser console F12
- API response: Check Network tab Response body
- Trace ID: Include trace_id when reporting issues
