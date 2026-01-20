# 📊 MBG - Role Access Control (Visual Summary)

## ✅ 4 ROLE SUDAH DIBUAT LENGKAP

### 1. 🔴 SUPER ADMIN
```
Akses: 100% (Semua fitur)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ User Management
   └─ Assign/Change User Roles
   └─ Deactivate Users
   └─ View All Users

✅ Schools Management
   └─ Create School
   └─ Edit School
   └─ Delete School
   └─ View All Schools

✅ Students Management
   └─ Create Student
   └─ Edit Student
   └─ Delete Student
   └─ View All Students

✅ Meals Management
   └─ Create Meal
   └─ Edit Meal
   └─ Delete Meal
   └─ View All Meals

✅ Orders Management
   └─ Create Order
   └─ Edit Any Order
   └─ Delete Order
   └─ Update Order Status
   └─ View All Orders

✅ Suppliers Management
   └─ Create Supplier
   └─ Edit Supplier
   └─ Delete Supplier
   └─ View All Suppliers

✅ Meal Plans Management
   └─ Create Meal Plan
   └─ Edit Meal Plan
   └─ Delete Meal Plan
   └─ View All Meal Plans

✅ Announcements Management
   └─ Create Announcement
   └─ Edit Announcement
   └─ Delete Announcement
   └─ View All Announcements

✅ Reports & Analytics
   └─ System Reports
   └─ User Analytics
   └─ Financial Reports
```

---

### 2. 🟠 ADMIN (School Administrator)
```
Akses: 70% (Fokus ke School Operations)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Schools Management
   └─ Create School ✓
   └─ Edit School ✓
   └─ Delete School ✓
   └─ View Schools ✓

✅ Students Management
   └─ Create Student ✓
   └─ Edit Student ✓
   └─ Delete Student ✓
   └─ View All Students ✓

✅ Meals Management
   └─ Create Meal ✓
   └─ Edit Meal ✓
   └─ Delete Meal ✓
   └─ View Meals ✓

✅ Orders Management
   └─ Edit Order ✓
   └─ Delete Order ✓
   └─ Update Order Status ✓
   └─ View All Orders ✓
   └─ Create Order ✗ (supplier/parent only)

✅ Announcements Management
   └─ Create Announcement ✓
   └─ Edit Announcement ✓
   └─ Delete Announcement ✓
   └─ View Announcements ✓

✅ Limited Access
   └─ View Suppliers (read-only) ✓
   └─ View Meal Plans (read-only) ✓

❌ Cannot Access
   └─ User Role Management ✗
   └─ Create/Edit Suppliers ✗
   └─ Create Meal Plans ✗
```

---

### 3. 🟡 SUPPLIER
```
Akses: 40% (Fokus ke Own Orders)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Orders Management (Own Only)
   └─ Create Order ✓
   └─ View Own Orders ✓
   └─ Edit Own Orders ✓
   └─ Filter by Status ✓
   └─ Delete Order ✗ (admin only)
   └─ Update Status ✗ (admin only)

✅ Profile Management
   └─ View Own Profile ✓
   └─ Edit Own Profile ✓
   └─ Update Contact Info ✓

✅ Read-Only Access
   └─ View Schools ✓
   └─ View Meals ✓
   └─ View Announcements ✓

❌ Cannot Access
   └─ View Other Suppliers' Orders ✗
   └─ CRUD Schools/Students/Meals ✗
   └─ User Management ✗
   └─ Delete Any Orders ✗
   └─ Create/Edit Announcements ✗
```

---

### 4. 🟢 PARENT
```
Akses: 50% (Fokus ke Own Family)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Children Management (Own Only)
   └─ View Own Children ✓
   └─ View Child Details ✓
   └─ Track Meal Plans ✓
   └─ Add/Edit/Delete Children ✗ (admin only)

✅ Meal Plans Management
   └─ Create Meal Plan for Own Child ✓
   └─ Edit Own Meal Plans ✓
   └─ View Own Meal Plans ✓
   └─ Delete Meal Plan ✗ (super admin only)

✅ Orders Management
   └─ Create Order ✓
   └─ View Own Orders ✓
   └─ Track Order Status ✓
   └─ Edit/Delete Order ✗ (admin only)

✅ Read-Only Access
   └─ View Schools ✓
   └─ View Available Meals ✓
   └─ View Announcements ✓
   └─ View Suppliers ✓

❌ Cannot Access
   └─ View Other Parents' Children ✗
   └─ CRUD Schools/Students/Meals ✗
   └─ User Management ✗
   └─ Edit/Delete Orders ✗
   └─ Create/Edit Announcements ✗
   └─ View All Orders ✗
```

---

## 🔐 Backend Implementation Status

### ✅ Database
- [x] Tabel `roles` dengan 4 role
- [x] Tabel `user_roles` untuk relasi user-role
- [x] Default role: `parent`
- [x] Foreign key constraints
- [x] Indexes untuk performance

### ✅ Middleware
- [x] `SuperAdminMiddleware()` → super_admin only
- [x] `AdminMiddleware()` → admin + super_admin
- [x] `SupplierMiddleware()` → supplier + super_admin
- [x] `ParentMiddleware()` → parent + super_admin
- [x] `RoleGuardMiddleware(roles...)` → custom roles

### ✅ Routes Protection
```go
// Super Admin Only
router.Group("/api/v1/roles").Use(SuperAdminMiddleware())
router.Group("/api/v1/users/:id/role").Use(SuperAdminMiddleware())

// Admin Routes
router.Group("/api/v1/schools").Use(AdminMiddleware())
router.Group("/api/v1/students").Use(AdminMiddleware())
router.Group("/api/v1/meals").Use(AdminMiddleware())
router.Group("/api/v1/announcements").Use(AdminMiddleware())

// Supplier Routes
router.Group("/api/v1/orders/supplier").Use(SupplierMiddleware())
router.Group("/api/v1/suppliers/:id").Use(SupplierMiddleware())

// Parent Routes
router.Group("/api/v1/students/parent").Use(ParentMiddleware())
router.Group("/api/v1/meal-plans").Use(ParentMiddleware())
router.Group("/api/v1/orders").Use(ParentMiddleware())

// Public (All Authenticated)
router.Group("/api/v1/schools").GET() // read-only
router.Group("/api/v1/meals").GET() // read-only
```

### ✅ Services
- [x] `RoleService` untuk manage roles
- [x] `AuthService` auto-assign role saat register
- [x] `SetUserRole()` untuk super admin
- [x] `GetUserRole()` get role dari database
- [x] `ListRoles()` list all available roles

### ✅ Repository
- [x] `RoleRepository` dengan tabel baru
- [x] `SetUserRole()` insert ke user_roles
- [x] `GetUserRole()` query dari user_roles
- [x] `RemoveUserRole()` remove role
- [x] `GetUserRoles()` support multiple roles

---

## 📱 Frontend Implementation (TODO)

### Role-Based UI Components
```typescript
// Hide/Show buttons based on role
{userRole === 'admin' || userRole === 'super_admin' ? (
  <Button>Add School</Button>
) : null}

{userRole === 'parent' && (
  <Button>Create Meal Plan</Button>
)}

{userRole === 'supplier' && (
  <Button>Create Order</Button>
)}
```

### Role-Based Routing
```typescript
// Redirect after login
switch(userRole) {
  case 'super_admin':
    router.push('/admin/dashboard');
    break;
  case 'admin':
    router.push('/admin/schools');
    break;
  case 'supplier':
    router.push('/supplier/orders');
    break;
  case 'parent':
    router.push('/parent/children');
    break;
}
```

---

## 🧪 Testing Scenarios

### Test 1: Register as Parent
```bash
POST /api/v1/auth/register
{
  "email": "parent@test.com",
  "password": "password123",
  "confirm_password": "password123",
  "full_name": "Test Parent",
  "role": "parent"
}

# Expected: ✅ User created with parent role
```

### Test 2: Parent Cannot Create School
```bash
POST /api/v1/schools
Authorization: Bearer {parent_token}
{
  "name": "Test School",
  "email": "school@test.com"
}

# Expected: ❌ 403 Forbidden
```

### Test 3: Admin Can Create School
```bash
POST /api/v1/schools
Authorization: Bearer {admin_token}
{
  "name": "Test School",
  "email": "school@test.com"
}

# Expected: ✅ 201 Created
```

### Test 4: Supplier Can Only See Own Orders
```bash
GET /api/v1/orders/supplier/{supplier_id}
Authorization: Bearer {supplier_token}

# Expected: ✅ Returns only supplier's orders
```

---

## 🎯 Summary

| Feature | Backend | Frontend | Database |
|---------|---------|----------|----------|
| 4 Roles Defined | ✅ | 🔄 TODO | ✅ |
| Middleware Protection | ✅ | - | ✅ |
| Auto-assign on Register | ✅ | 🔄 TODO | ✅ |
| Role Management API | ✅ | 🔄 TODO | ✅ |
| Route Protection | ✅ | 🔄 TODO | - |
| Role-based UI | - | 🔄 TODO | - |

**Backend RBAC: 100% Complete ✅**
**Frontend Implementation: Waiting ⏳**

---

## 📝 Next Steps

1. ✅ Backend RBAC sudah lengkap
2. 🔄 Tunggu Homebrew install selesai
3. 🔄 Install Go & Node.js
4. 🔄 Setup Supabase database
5. 🔄 Jalankan backend server
6. 🔄 Jalankan frontend server
7. 🔄 Implement role-based UI di frontend
8. 🔄 Test semua role flows

**File ini ada di:** `ROLE_SUMMARY.md`
