# OAuth Setup Guide

## Overview
The application now has OAuth integration using NextAuth.js for Google and Microsoft sign-in, plus email/password authentication.

## What's Been Setup

### 1. NextAuth.js Integration ✅
- Installed `next-auth` (latest version)
- Created auth configuration in `lib/auth.ts`
- API route handler at `/api/auth/[...nextauth]`
- SessionProvider wrapper component
- Root layout updated with AuthProvider

### 2. Authentication Providers
- **Google OAuth** - Via Google Cloud Console
- **Microsoft OAuth** - Via Azure AD / Microsoft Entra ID
- **Credentials** - Email/password (mock for development)

### 3. Environment Variables
Created `.env.local` file with placeholders:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
MICROSOFT_TENANT_ID=common
```

## How to Setup OAuth

### Google OAuth Setup

1. **Create Google OAuth Credentials:**
   - Go to https://console.cloud.google.com/
   - Create a new project (or select existing)
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth Client ID"
   - Choose "Web application"
   - Add Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - Your production domain
   - Add Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://yourdomain.com/api/auth/callback/google` (production)

2. **Copy Credentials:**
   - Copy "Client ID" → `GOOGLE_CLIENT_ID`
   - Copy "Client Secret" → `GOOGLE_CLIENT_SECRET`
   - Paste into `.env.local`

### Microsoft OAuth Setup

1. **Register Application in Azure AD:**
   - Go to https://portal.azure.com/
   - Navigate to "Azure Active Directory"
   - Go to "App registrations" > "New registration"
   - Give it a name (e.g., "MBG Platform")
   - Select "Accounts in any organizational directory and personal Microsoft accounts"
   - Set Redirect URI:
     - Platform: Web
     - URI: `http://localhost:3000/api/auth/callback/microsoft`

2. **Create Client Secret:**
   - Go to "Certificates & secrets"
   - Click "New client secret"
   - Copy the value → `MICROSOFT_CLIENT_SECRET`
   - Copy the secret expiration date and set it in Azure

3. **Get Application ID:**
   - From "Overview" page, copy "Application (client) ID"
   - This → `MICROSOFT_CLIENT_ID`
   - Get your tenant ID from Overview → `MICROSOFT_TENANT_ID`

4. **Update .env.local** with Microsoft credentials

### Testing

#### Test Credentials Provider (Development Only)
- Email: `test@example.com`
- Password: `password`

#### Test with OAuth
Once you've added credentials:
1. Restart dev server: `npm run dev`
2. Go to `http://localhost:3000/auth/login`
3. Click "Continue with Google" or "Continue with Microsoft"
4. Complete the OAuth flow
5. You'll be redirected back to the app

## Files Modified/Created

### New Files:
- `lib/auth.ts` - NextAuth configuration
- `app/api/auth/[...nextauth]/route.ts` - Auth API endpoint
- `components/providers/auth-provider.tsx` - SessionProvider wrapper
- `.env.local` - Environment variables (placeholder)

### Modified Files:
- `app/layout.tsx` - Added AuthProvider wrapper
- `app/auth/login/page.tsx` - Integrated NextAuth signin

## Security Notes

⚠️ **For Production:**
1. Generate a strong `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

2. Store secrets in your hosting platform's environment variables
   - Never commit `.env.local` to version control
   - Add `.env.local` to `.gitignore` if not already there

3. Update NEXTAUTH_URL to your production domain

4. Implement proper user database integration
   - Currently using mock credentials
   - Replace with real database queries

5. Add rate limiting and security headers

## Using NextAuth in Components

### Check if User is Logged In
```tsx
import { useSession } from "next-auth/react"

export function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === "loading") return <div>Loading...</div>
  if (!session) return <div>Not signed in</div>
  
  return <div>Welcome, {session.user?.email}</div>
}
```

### Sign In/Sign Out
```tsx
import { signIn, signOut } from "next-auth/react"

// Sign in
await signIn("google") // or "microsoft" or "credentials"

// Sign out
await signOut({ callbackUrl: "/" })
```

### Protected Routes (Server-Side)
```tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/login")
  }
  
  return <div>Welcome, {session.user?.email}</div>
}
```

## Troubleshooting

### "Invalid Client ID" Error
- Double-check credentials in `.env.local`
- Ensure OAuth app is properly configured
- Verify redirect URIs match exactly

### Session Not Persisting
- Check if `AuthProvider` is in root layout
- Verify `NEXTAUTH_SECRET` is set
- Check browser cookies for `next-auth.session-token`

### OAuth Callback Issues
- Ensure redirect URI in `.env` matches OAuth provider settings
- Check that `NEXTAUTH_URL` matches your domain

## Next Steps

1. Set up database for user storage
2. Implement user registration flow
3. Add role-based access control (RBAC)
4. Set up email verification
5. Add 2FA support
6. Implement refresh token rotation

---
**Last Updated:** December 1, 2025
**Status:** OAuth Integration Complete
