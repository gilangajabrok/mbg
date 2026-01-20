# 🚀 Cara Install & Jalankan MBG (Mac)

## Step 1: Install Homebrew (Sudah Jalan)
Tunggu sampai selesai, lalu lanjut ke step 2.

## Step 2: Install Go, Node.js, dan pnpm

Setelah Homebrew selesai, jalankan di terminal:

```bash
# Add Homebrew ke PATH
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc

# Install Go
brew install go

# Install Node.js
brew install node

# Install pnpm
npm install -g pnpm
```

## Step 3: Cek Instalasi

```bash
go version    # Harus muncul: go version go1.23.x
node --version  # Harus muncul: v20.x atau v22.x
pnpm --version  # Harus muncul: 9.x
```

## Step 4: Setup Database di Supabase

1. Buka https://supabase.com
2. Login/Create account
3. Create New Project
4. Tunggu project ready
5. Pergi ke **SQL Editor**
6. Copy SEMUA isi file `SUPABASE_DATABASE_SCHEMA.sql`
7. Paste dan klik **RUN**
8. Tunggu sampai selesai (semua tabel dibuat)

## Step 5: Isi File .env Backend

Buka file `backend/.env` dan isi:

```bash
# Dari Supabase Project Settings → Database
DB_HOST=db.xxxxxx.supabase.co
DB_PORT=6543
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_NAME=postgres

# Dari Supabase Project Settings → API
SUPABASE_URL=https://xxxxxx.supabase.co
SUPABASE_API_KEY=eyJxxxx... (anon key)
SUPABASE_JWT_SECRET=your-jwt-secret

# JWT Secret (buat sendiri, random string)
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
```

## Step 6: Jalankan Backend (Go)

Di terminal 1:

```bash
cd backend
go mod download
go run cmd/api/main.go
```

Kalau muncul:
```
✅ Starting HTTP server address=0.0.0.0:8080
```

**Backend SUKSES! ✅**

## Step 7: Jalankan Frontend (Next.js)

Di terminal 2 (buka terminal baru):

```bash
cd /Users/yournme/Desktop/MBG/mbg
pnpm install
pnpm dev
```

Kalau muncul:
```
✅ Ready on http://localhost:3000
```

**Frontend SUKSES! ✅**

## Step 8: Test Aplikasi

1. Buka browser: http://localhost:3000
2. Klik Register
3. Pilih role: parent/admin/supplier
4. Register dan login
5. Cek menu sesuai role!

---

## 🎯 4 Role untuk Test:

### Test 1: Register sebagai PARENT
- Register dengan role: `parent`
- Login
- Lihat: My Children, Meal Plans, Orders
- Button yang muncul: Create Meal Plan, Place Order

### Test 2: Register sebagai ADMIN
- Register dengan role: `admin`
- Login
- Lihat: Schools, Students, Meals, Orders
- Button yang muncul: Add School, Add Student, Add Meal

### Test 3: Register sebagai SUPPLIER
- Register dengan role: `supplier`
- Login
- Lihat: My Orders, My Profile
- Button yang muncul: Create Order, Edit Profile

### Test 4: SUPER ADMIN
- Hanya bisa di-assign oleh super admin lain
- Atau login dengan dev account (kalau ada di .env)

---

## ❗ Troubleshooting

### Backend error "connection refused"
✅ Cek file `.env` - pastikan data Supabase benar
✅ Cek internet connection
✅ Pastikan database schema sudah di-run

### Frontend error "ECONNREFUSED"
✅ Pastikan backend sudah jalan di port 8080
✅ Cek file `.env.local` di root project

### "go: command not found"
✅ Jalankan: `source ~/.zshrc`
✅ Atau restart terminal

---

## 📋 Quick Commands

```bash
# Jalankan Backend
cd backend && go run cmd/api/main.go

# Jalankan Frontend
pnpm dev

# Install dependencies Frontend
pnpm install

# Download Go dependencies
cd backend && go mod download
```

**SELESAI! Sekarang tunggu Homebrew install finish, lalu jalankan Step 2!** 🚀
