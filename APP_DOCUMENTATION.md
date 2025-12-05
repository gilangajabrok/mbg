# MBG Platform - App Documentation

## Overview
This is an enterprise-grade meal distribution management platform with role-based portals for Super Admin, Admin, Suppliers, and Parents.

## Architecture Changes

### Global Layout Removed
- Removed the global `MBGLayout` wrapper that was applying sidebar/navbar to all pages
- All pages now render without default layout wrapping
- Individual role-based sections handle their own layouts

### Removed Pages (No Role-Specific Access)
The following generic pages have been permanently deleted as they lacked role-specific functionality:
- ❌ `/schools` - Generic schools page
- ❌ `/students` - Generic students page  
- ❌ `/meal-plans` - Generic meal plans page
- ❌ `/suppliers` - Generic suppliers page
- ❌ `/reports` - Generic reports page
- ❌ `/ai` - Generic AI assistant page

## Active Routes & Pages

### Landing Page
- **Route:** `/`
- **Layout:** No sidebar/navbar (clean full-page portal selection)
- **Components:** Four portal cards for role selection
  - Super Admin Portal → `/great/dashboard`
  - Admin Panel → `/admin/auth/login`
  - Supplier Portal → `/supplier/auth/login`
  - Parent Portal → `/parent/auth/login`

### Super Admin Portal
- **Route:** `/great/dashboard`
- **Description:** Full system oversight, audit logs, user management, analytics
- **Status:** ✅ Active

### Admin Portal
- **Route:** `/admin/*`
- **Sub-sections:**
  - Authentication: `/admin/auth/`
  - Dashboard: `/admin/dashboard/`
  - Schools: `/admin/schools/`
  - Suppliers: `/admin/suppliers/`
  - Delivery: `/admin/delivery/`
  - Finance: `/admin/finance/`
  - Meals: `/admin/meals/`
  - Parents: `/admin/parents/`
  - Quality: `/admin/quality/`
  - Reports: `/admin/reports/`
  - Documents: `/admin/documents/`
  - Settings: `/admin/settings/`

### Parent Portal
- **Route:** `/parent/*`
- **Sub-sections:**
  - Authentication: `/parent/auth/`
  - Dashboard: `/parent/dashboard/`
  - Children: `/parent/children/`
  - Meal Plans: `/parent/meal-plan/`
  - Delivery: `/parent/delivery/`
  - Nutrition: `/parent/nutrition/`
  - Announcements: `/parent/announcements/`
  - Profile: `/parent/profile/`
  - Documents: `/parent/documents/`
  - Feedback: `/parent/feedback/`
  - Support: `/parent/support/`
  - Settings: `/parent/settings/`

### Supplier Portal
- **Route:** `/supplier/*`
- **Sub-sections:**
  - Authentication: `/supplier/auth/` & `/supplier/login/`
  - Dashboard: `/supplier/dashboard/`
  - Catalog: `/supplier/catalog/`
  - Orders: `/supplier/orders/`
  - Inventory: `/supplier/inventory/`
  - Delivery: `/supplier/delivery/`
  - Performance: `/supplier/performance/`
  - Products: `/supplier/products/`
  - Documents: `/supplier/documents/`
  - Forgot Password: `/supplier/forgot-password/`
  - Settings: `/supplier/settings/`

### Authentication Pages
- **Routes:** `/login`, `/auth`, `/forgot-password`, `/2fa`, `/register`
- **Status:** ✅ Active (accessible without role)
- **Purpose:** User authentication and account management

## Key Components & Features

### Layout System
- **File:** `components/layout/mbg-layout-wrapper.tsx`
- **Current Behavior:** No global layout application
- **Note:** Role-specific layouts should be implemented at portal level

### Styling & Theme
- **Global CSS:** `app/globals.css`
- **Theme Provider:** `lib/theme-provider.tsx`
- **Motion Library:** Framer Motion for animations
- **Sound System:** Custom sound effects (tap, success, etc.)
- **Toast Notifications:** Custom toast provider

### Providers Stack
1. **ThemeProvider** - Light/Dark theme support
2. **SoundProvider** - Sound effect management
3. **ToastProvider** - Toast notification system
4. **MBGLayoutWrapper** - (Currently just renders children)

### UI Components Available
- `Badge` - Status/category badges
- `Card` - Content containers
- `Button` - Interactive buttons
- `DataTable` - Data display tables
- `Modal` - Dialog/popup components
- `Sidebar` - Navigation sidebar
- `Topbar` - Top navigation
- `Skeleton Loaders` - Loading states
- `Empty States` - No data states
- `Progress Bar` - Progress indication
- `Tooltips` - Contextual help
- `Breadcrumb Navigation` - Route navigation

### Hooks Available
- `use-click-outside` - Detect outside clicks
- `use-mobile` - Mobile detection
- `use-sound` - Sound playback
- `use-toast` - Toast notifications
- `use-toast-sound` - Sound + toast combo
- `use-mbg-keyboard` - Custom keyboard shortcuts
- `use-mbg-sound` - Custom sound effects

## Development Notes

### How It Works Now
1. User lands on `/` (home page)
2. Selects a portal (Super Admin, Admin, Parent, or Supplier)
3. Routed to role-specific section with its own layout
4. Each role section has its own navigation and structure

### Future Enhancements
- Implement role-specific layouts in each portal section
- Add proper authentication flow
- Implement data persistence
- Add role-based access control (RBAC)

### Environment
- **Framework:** Next.js 16.0.3 with Turbopack
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Package Manager:** npm (with pnpm lock file)

## Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Server runs on http://localhost:3000
```

## File Structure
```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home/landing page (portal selection)
├── globals.css         # Global styles
├── admin/              # Admin portal routes
├── parent/             # Parent portal routes
├── supplier/           # Supplier portal routes
├── great/              # Super Admin portal routes
└── [auth routes]/      # Login, register, 2FA, etc.

components/
├── layout/             # Layout wrappers
├── ui/                 # UI components
├── business/           # Business logic components
└── [other]/            # Specific components

lib/
├── theme-provider.tsx  # Theme system
├── sound-provider.tsx  # Sound system
├── toast-provider.tsx  # Toast notifications
└── [utilities]/        # Helper functions & constants

hooks/
└── [custom hooks]/     # Reusable React hooks
```

---
**Last Updated:** December 1, 2025
**Status:** Active Development
