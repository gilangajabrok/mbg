-- ============================================
-- MBG DATABASE SCHEMA - Complete SQL
-- ============================================
-- Run this directly in Supabase SQL Editor

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    encrypted_password VARCHAR(255),
    email_confirmed_at TIMESTAMP WITH TIME ZONE,
    invited_at TIMESTAMP WITH TIME ZONE,
    confirmation_token VARCHAR(255),
    confirmation_sent_at TIMESTAMP WITH TIME ZONE,
    recovery_token VARCHAR(255),
    recovery_sent_at TIMESTAMP WITH TIME ZONE,
    email_change VARCHAR(255),
    email_change_token VARCHAR(255),
    email_change_sent_at TIMESTAMP WITH TIME ZONE,
    last_sign_in_at TIMESTAMP WITH TIME ZONE,
    raw_app_meta_data JSONB,
    raw_user_meta_data JSONB,
    is_super_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 2. USER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    avatar_url VARCHAR(500),
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_is_active ON user_profiles(is_active);

-- ============================================
-- 3. SCHOOLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    principal VARCHAR(255),
    students_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_schools_email ON schools(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_schools_created_at ON schools(created_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_schools_deleted_at ON schools(deleted_at);

-- ============================================
-- 4. MEALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    calories INTEGER,
    protein DECIMAL(5, 2),
    carbs DECIMAL(5, 2),
    fat DECIMAL(5, 2),
    allergens TEXT,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_meals_school_id ON meals(school_id);
CREATE INDEX idx_meals_created_at ON meals(created_at);

-- ============================================
-- 5. MEAL PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID,
    meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_meal_plans_student_id ON meal_plans(student_id);
CREATE INDEX idx_meal_plans_meal_id ON meal_plans(meal_id);

-- ============================================
-- 6. STUDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES auth.users(id),
    date_of_birth DATE,
    grade VARCHAR(50),
    allergies TEXT,
    dietary_needs TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_parent_id ON students(parent_id);

-- ============================================
-- 7. SUPPLIERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    contact_person VARCHAR(255),
    user_id UUID REFERENCES auth.users(id),
    rating DECIMAL(3, 2) DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_suppliers_email ON suppliers(email);
CREATE INDEX idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX idx_suppliers_is_active ON suppliers(is_active);

-- ============================================
-- 8. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES suppliers(id),
    school_id UUID REFERENCES schools(id),
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10, 2),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX idx_orders_school_id ON orders(school_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ============================================
-- 9. ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    school_id UUID REFERENCES schools(id),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_announcements_school_id ON announcements(school_id);
CREATE INDEX idx_announcements_created_by ON announcements(created_by);
CREATE INDEX idx_announcements_is_active ON announcements(is_active);
