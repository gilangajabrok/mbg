# Admin Dashboard Layout & Routing Architecture

## Fixed Issues

### 1. Duplicate Sidebar Problem ✅
**Problem:** The `/app/admin/dashboard/page.tsx` was wrapped with `<AdminLayout>` component, which includes AdminSidebar + AdminTopbar. Additionally, the root layout in `/app/layout.tsx` was wrapping all children with `<MBGLayout>`, creating duplicate sidebars rendering on the same page.

**Solution:** 
- Removed `<AdminLayout>` wrapper from `/app/admin/dashboard/page.tsx`
- Created `/app/admin/layout.tsx` that provides the `AdminLayout` wrapper for all `/admin/*` routes
- Created `MBGLayoutWrapper` that conditionally renders layouts based on the current route

### 2. Content Alignment Problem ✅
**Problem:** Main content was being pushed too far right due to conflicting margin/padding from multiple layout layers.

**Solution:**
- Updated `AdminLayout` to use a proper flex layout: `flex` container with `AdminSidebar` as `flex-shrink-0` and main content as `flex-1`
- Removed hard-coded left margins (`ml-64`) from main content areas
- Added `overflow-y-auto` to main content for proper scrolling

### 3. URL Routing Problem ✅
**Problem:** The admin dashboard was at `/dashboard` instead of `/admin/dashboard`, inconsistent with other role-specific routes.

**Solution:**
- Created `/app/admin/layout.tsx` that wraps all admin routes with `AdminLayout`
- All admin pages now follow the `/admin/*` path pattern
- Parent and Supplier routes maintain their existing paths (`/parent/*`, `/supplier/*`)
- Root dashboard at `/dashboard` is now rendered by `MBGLayout` (default layout for non-role-specific pages)

## New Architecture

\`\`\`
app/
├── layout.tsx                    (Root layout with providers)
│   └── MBGLayoutWrapper          (Conditional layout selector)
│       ├── Admin routes → AdminLayout
│       ├── Supplier routes → SupplierLayout
│       ├── Parent routes → ParentLayout
│       └── Other routes → MBGLayout
│
├── admin/
│   ├── layout.tsx                (Wraps all /admin/* routes)
│   │   └── AdminLayout           (Sidebar + Topbar + Content)
│   ├── dashboard/
│   │   └── page.tsx              (Admin dashboard - no AdminLayout wrapper)
│   ├── distribution/
│   │   └── page.tsx
│   ├── schools/
│   │   └── page.tsx
│   └── ... other admin pages
│
├── parent/
│   ├── layout.tsx                (Wraps all /parent/* routes)
│   │   └── ParentLayout          (Sidebar + Topbar + Content)
│   ├── dashboard/
│   │   └── page.tsx
│   ├── children/
│   │   └── page.tsx
│   └── ... other parent pages
│
├── supplier/
│   ├── layout.tsx                (Wraps all /supplier/* routes)
│   │   └── SupplierLayout        (Sidebar + Topbar + Content)
│   ├── dashboard/
│   │   └── page.tsx
│   ├── orders/
│   │   └── page.tsx
│   └── ... other supplier pages
│
└── (public routes)
    ├── dashboard/
    │   └── page.tsx              (Default dashboard - uses MBGLayout)
    ├── login/
    ├── register/
    ├── schools/
    └── ... other public pages
\`\`\`

## Route Structure

### Admin Routes
- `/admin/dashboard` - Admin dashboard (main stats, charts, alerts)
- `/admin/schools` - School management
- `/admin/distribution` - Distribution tracking
- `/admin/suppliers` - Supplier management
- `/admin/parents` - Parent management
- `/admin/meals` - Meal plan management
- `/admin/quality` - Quality control
- `/admin/delivery` - Delivery management
- `/admin/finance` - Financial reports
- `/admin/documents` - Document management
- `/admin/reports` - System reports
- `/admin/settings` - System settings

### Parent Routes
- `/parent/dashboard` - Parent portal dashboard
- `/parent/children` - Child profiles
- `/parent/meal-plan` - Assigned meal plans
- `/parent/delivery` - Delivery tracking
- `/parent/nutrition` - Nutrition reports
- `/parent/announcements` - School announcements

### Supplier Routes
- `/supplier/dashboard` - Supplier dashboard (orders, KPIs)
- `/supplier/orders` - Order management
- `/supplier/inventory` - Stock management
- `/supplier/delivery` - Delivery tracking
- `/supplier/performance` - Performance metrics

### Public/Default Routes
- `/dashboard` - Default dashboard (for users not in a specific role)
- `/login` - Login page
- `/register` - Registration page
- `/schools` - Public schools directory

## Layout Wrapper Logic

**File:** `components/layout/mbg-layout-wrapper.tsx`

\`\`\`typescript
// Routes handled by their own layout.tsx:
- /admin/* → No MBGLayout wrapper (AdminLayout handles it)
- /supplier/* → No MBGLayout wrapper (SupplierLayout handles it)
- /parent/* → No MBGLayout wrapper (ParentLayout handles it)
- /login, /auth, /forgot-password, /2fa, /register → No wrapper (auth pages)

// Routes using MBGLayout:
- /dashboard → MBGLayout
- /schools → MBGLayout
- /students → MBGLayout
- /meal-plans → MBGLayout
- /suppliers → MBGLayout
- /distribution → MBGLayout
- /reports → MBGLayout
- /ai-assistant → MBGLayout
- / (home) → MBGLayout
\`\`\`

## Layout Component Files

### Admin
- `components/layout/admin-layout.tsx` - Flex container with AdminSidebar + AdminTopbar
- `components/layout/admin-sidebar.tsx` - Collapsible sidebar with admin menu
- `components/layout/admin-topbar.tsx` - Sticky topbar with search, notifications, profile

### Parent
- `components/layout/parent-layout.tsx` - Flex container with ParentSidebar + ParentTopbar
- `components/layout/parent-sidebar.tsx` - Collapsible sidebar with parent menu
- `components/layout/parent-topbar.tsx` - Sticky topbar with parent-specific features

### Supplier
- `components/layout/supplier-layout.tsx` - Flex container with SupplierSidebar + SupplierTopbar
- `components/layout/supplier-sidebar.tsx` - Collapsible sidebar with supplier menu
- `components/layout/supplier-topbar.tsx` - Sticky topbar with supplier-specific features

### Default (MBG)
- `components/layout/mbg-layout.tsx` - Main layout for non-role-specific pages
- `components/layout/mbg-sidebar.tsx` - Collapsible sidebar with main menu
- `components/layout/mbg-topbar.tsx` - Sticky topbar with main features
- `components/layout/mbg-layout-wrapper.tsx` - Route-aware layout selector

## CSS Classes Used

### Layout Alignment
- **Main container:** `flex` (sidebar + main content side by side)
- **Sidebar:** `flex-shrink-0 w-64 sticky top-0` (fixed width, sticky positioning)
- **Main content:** `flex-1 overflow-y-auto` (takes remaining space, scrollable)
- **Topbar:** `sticky top-0` (stays at top when scrolling)

### Responsive Behavior
- **Sidebar collapse:** `w-64` (expanded) / `w-20` (collapsed)
- **Sidebar transitions:** `transition-all duration-300`
- **Small screens:** Sidebar switches to overlay/drawer pattern (via custom Tailwind breakpoints)

## Benefits of This Architecture

1. **No Duplicate Rendering:** Each route uses exactly one layout wrapper
2. **Clean Separation:** Admin/Parent/Supplier layouts are isolated from each other
3. **Easy Navigation:** Clear route structure `/role/feature` pattern
4. **Scalability:** Adding new roles is straightforward (create new layout.tsx)
5. **Responsive:** Each layout can have role-specific responsive behavior
6. **Maintainability:** Layout logic is centralized in layout.tsx files, not page components

## Migration Notes for Future Pages

When creating new pages:

1. **Admin pages:** Create at `/app/admin/[feature]/page.tsx` - will automatically use AdminLayout
2. **Parent pages:** Create at `/app/parent/[feature]/page.tsx` - will automatically use ParentLayout
3. **Supplier pages:** Create at `/app/supplier/[feature]/page.tsx` - will automatically use SupplierLayout
4. **Public pages:** Create at `/app/[feature]/page.tsx` - will automatically use MBGLayout

**DO NOT** wrap page components with any layout component. The layout.tsx file in the parent directory handles it automatically.

## Testing Checklist

- [ ] Admin dashboard loads without duplicate sidebars
- [ ] Admin sidebar collapses properly (w-64 → w-20)
- [ ] Content doesn't shift when sidebar collapses
- [ ] Topbar is sticky and overlays properly
- [ ] Navigation links work correctly (/admin/schools, /admin/distribution, etc.)
- [ ] Parent dashboard loads with ParentLayout
- [ ] Supplier dashboard loads with SupplierLayout
- [ ] Default dashboard (/dashboard) loads with MBGLayout
- [ ] Auth pages (login, register) don't show sidebar
- [ ] Responsive behavior works on mobile/tablet
- [ ] Dark mode works correctly for all layouts
