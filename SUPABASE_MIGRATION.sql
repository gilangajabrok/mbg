-- ============================================
-- MBG Platform - PostgreSQL Migration for Supabase
-- Role-Based Access Control & Complete Data Model
-- ============================================

-- ============================================
-- 1. ENUM TYPES
-- ============================================

-- Drop existing types if they exist
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;

-- Create enum types
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'admin',
  'supplier',
  'parent'
);

CREATE TYPE user_status AS ENUM (
  'active',
  'inactive',
  'suspended',
  'pending_verification'
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'delivered',
  'cancelled'
);

-- ============================================
-- 2. CORE TABLES
-- ============================================

-- User Profiles (extends Supabase auth.users)
DROP TABLE IF EXISTS public.user_profiles CASCADE;

CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  phone_number VARCHAR(20),
  role user_role NOT NULL DEFAULT 'parent',
  status user_status NOT NULL DEFAULT 'pending_verification',
  profile_picture_url TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_verified BOOLEAN DEFAULT FALSE
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profile
CREATE POLICY "users_view_own_profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_profiles.id);

CREATE POLICY "users_update_own_profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_profiles.id);

-- Schools
DROP TABLE IF EXISTS public.schools CASCADE;

CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  principal VARCHAR(255),
  students_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Students (Children)
DROP TABLE IF EXISTS public.students CASCADE;

CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  school_id UUID NOT NULL REFERENCES public.schools(id),
  parent_id UUID REFERENCES auth.users(id),
  grade VARCHAR(50),
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Meals
DROP TABLE IF EXISTS public.meals CASCADE;

CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  calories INT,
  protein DECIMAL(10, 2),
  carbs DECIMAL(10, 2),
  fat DECIMAL(10, 2),
  allergens TEXT,
  school_id UUID NOT NULL REFERENCES public.schools(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Meal Plans
DROP TABLE IF EXISTS public.meal_plans CASCADE;

CREATE TABLE public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id),
  meal_id UUID NOT NULL REFERENCES public.meals(id),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Suppliers
DROP TABLE IF EXISTS public.suppliers CASCADE;

CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  user_id UUID REFERENCES auth.users(id),
  rating DECIMAL(3, 2) DEFAULT 0.0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Orders
DROP TABLE IF EXISTS public.orders CASCADE;

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id),
  meal_id UUID REFERENCES public.meals(id),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  school_id UUID REFERENCES public.schools(id),
  quantity INT NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2),
  status order_status NOT NULL DEFAULT 'pending',
  delivery_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Announcements
DROP TABLE IF EXISTS public.announcements CASCADE;

CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  school_id UUID NOT NULL REFERENCES public.schools(id),
  author_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 3. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(status);

CREATE INDEX IF NOT EXISTS idx_schools_email ON public.schools(email);
CREATE INDEX IF NOT EXISTS idx_schools_created_by ON public.schools(created_by);
CREATE INDEX IF NOT EXISTS idx_schools_deleted_at ON public.schools(deleted_at);

CREATE INDEX IF NOT EXISTS idx_students_school_id ON public.students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_parent_id ON public.students(parent_id);
CREATE INDEX IF NOT EXISTS idx_students_deleted_at ON public.students(deleted_at);

CREATE INDEX IF NOT EXISTS idx_meals_school_id ON public.meals(school_id);
CREATE INDEX IF NOT EXISTS idx_meals_deleted_at ON public.meals(deleted_at);

CREATE INDEX IF NOT EXISTS idx_meal_plans_student_id ON public.meal_plans(student_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_meal_id ON public.meal_plans(meal_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_deleted_at ON public.meal_plans(deleted_at);

CREATE INDEX IF NOT EXISTS idx_suppliers_email ON public.suppliers(email);
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON public.suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_deleted_at ON public.suppliers(deleted_at);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_student_id ON public.orders(student_id);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_id ON public.orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_school_id ON public.orders(school_id);
CREATE INDEX IF NOT EXISTS idx_orders_deleted_at ON public.orders(deleted_at);

CREATE INDEX IF NOT EXISTS idx_announcements_school_id ON public.announcements(school_id);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON public.announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_deleted_at ON public.announcements(deleted_at);

-- ============================================
-- 4. ROLE-BASED ACCESS CONTROL (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all public tables
CREATE POLICY "authenticated_read_schools" ON public.schools
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_read_meals" ON public.meals
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_read_announcements" ON public.announcements
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_read_suppliers" ON public.suppliers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_read_students" ON public.students
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow all write operations for authenticated users (RBAC enforced by application)
CREATE POLICY "authenticated_write_schools" ON public.schools
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_write_students" ON public.students
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_write_meals" ON public.meals
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_write_meal_plans" ON public.meal_plans
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_write_suppliers" ON public.suppliers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_write_orders" ON public.orders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_write_announcements" ON public.announcements
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 5. VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Active schools with student count
CREATE OR REPLACE VIEW public.active_schools AS
SELECT id, name, email, phone, address, principal, students_count, created_at
FROM public.schools
WHERE deleted_at IS NULL
ORDER BY created_at DESC;

-- View: Active meals with school info
CREATE OR REPLACE VIEW public.active_meals AS
SELECT m.id, m.name, m.description, m.calories, m.protein, m.carbs, m.fat, m.school_id,
       s.name as school_name, m.created_at
FROM public.meals m
LEFT JOIN public.schools s ON m.school_id = s.id
WHERE m.deleted_at IS NULL AND s.deleted_at IS NULL
ORDER BY m.created_at DESC;

-- ============================================
-- 6. SAMPLE DATA (Optional - Remove in Production)
-- ============================================

-- Sample school (if needed for testing)
-- INSERT INTO public.schools (name, email, phone, address, principal, students_count, created_by)
-- VALUES ('Sample School', 'school@example.com', '+1234567890', '123 Main St', 'Dr. Smith', 500, auth.uid())
-- ON CONFLICT DO NOTHING;

-- ============================================
-- END MIGRATION
-- ============================================
