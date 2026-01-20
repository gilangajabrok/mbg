# ⚠️ NEXT STEP: Setup Supabase

## Status Sekarang:
✅ Go terinstall
✅ Node.js terinstall  
✅ Frontend jalan di http://localhost:3000
❌ Backend GAGAL connect ke database

## Kenapa Backend Error?

Backend coba connect ke database tapi:
```
connection refused at localhost:5432
```

**Artinya:** Database belum dikonfigurasi di `.env`!

---

## 🚀 Apa yang Perlu Kamu Lakukan:

### Step 1: Setup Supabase Project
1. Buka https://supabase.com
2. Login atau buat akun baru
3. Klik **New Project**
4. Isi nama project: `MBG` atau nama apapun
5. Klik **Create**
6. **TUNGGU** sampai project siap (±5 menit)

### Step 2: Ambil Database Credentials
1. Di Supabase dashboard, klik **Settings**
2. Cari **Database**
3. Copy data ini:
   - **Host:** `db.xxxxx.supabase.co`
   - **Port:** `5432` atau `6543`
   - **Database:** `postgres`
   - **User:** `postgres`
   - **Password:** ada di "Database Password" (atau reset jika lupa)

### Step 3: Ambil API Keys
1. Di Supabase, klik **Settings** → **API**
2. Copy data ini:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **Anon Key:** (public key)
   - **Service Key:** (secret key)

### Step 4: Setup Database Schema
1. Di Supabase, klik **SQL Editor**
2. Klik **New Query** 
3. Copy SEMUA isi file: `/Users/yournme/Desktop/MBG/mbg/SUPABASE_DATABASE_SCHEMA.sql`
4. Paste ke SQL editor
5. Klik **RUN**
6. **TUNGGU** sampai selesai (semua tabel jadi)

### Step 5: Update File .env

Buka: `/Users/yournme/Desktop/MBG/mbg/backend/.env`

Ubah ini:
```bash
# Database
DB_HOST=db.xxxxx.supabase.co        # Dari Supabase
DB_PORT=5432                         # Dari Supabase (atau 6543)
DB_USER=postgres
DB_PASSWORD=your-password            # Dari Supabase
DB_NAME=postgres

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co    # Dari API Settings
SUPABASE_API_KEY=eyJxxx...                # Dari API Settings (Anon Key)
SUPABASE_JWT_SECRET=your-jwt-secret       # Dari JWT Secret (cek di Project Settings)

# JWT (buat random string panjang)
JWT_SECRET=super-secret-key-minimum-32-characters-long-2024
```

### Step 6: Restart Backend

Setelah `.env` diisi:

```bash
export PATH=$PATH:/usr/local/go/bin
cd /Users/yournme/Desktop/MBG/mbg/backend
go run ./cmd/api/main.go
```

Harus muncul:
```
✅ Starting HTTP server address=0.0.0.0:8080
✅ Database connection established
```

---

## ✅ Summary:
1. **Setup Supabase** di supabase.com
2. **Copy credentials** ke `.env`
3. **Run SQL schema** di Supabase
4. **Restart backend**
5. **Done!** Backend jalan di port 8080

**Kasih tau saya kalau sudah selesai setup Supabase!** 🚀
