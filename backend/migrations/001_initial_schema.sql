-- MBG Platform - Supabase PostgreSQL Schema
-- Complete database structure with role-based access control
-- Author: MBG Development Team
-- Created: 2025-12-04

-- ============================================
-- 1. ENUM TYPES
-- ============================================

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

CREATE TYPE school_status AS ENUM (
  'active',
  'inactive',
  'archived'
);

CREATE TYPE meal_plan_status AS ENUM (
  'draft',
  'pending_approval',
  'approved',
  'rejected',
  'active',
  'archived'
);

CREATE TYPE meal_item_status AS ENUM (
  'available',
  'unavailable',
  'discontinued'
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'paid',
  'preparing',
  'ready',
  'dispatched',
  'delivered',
  'cancelled'
);

CREATE TYPE delivery_status AS ENUM (
  'scheduled',
  'in_transit',
  'delivered',
  'failed',
  'cancelled'
);

CREATE TYPE document_type AS ENUM (
  'invoice',
  'receipt',
  'menu',
  'report',
  'other'
);

-- ============================================
-- 2. CORE TABLES
-- ============================================

-- Users table (managed by Supabase Auth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  phone_number VARCHAR(20),
  role user_role NOT NULL DEFAULT 'parent',
  status user_status NOT NULL DEFAULT 'pending_verification',
  profile_picture_url TEXT,
  date_of_birth DATE,
  gender VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE
);

-- Schools table
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(100) UNIQUE,
  status school_status NOT NULL DEFAULT 'active',
  email VARCHAR(255),
  phone_number VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  principal_name VARCHAR(255),
  principal_email VARCHAR(255),
  principal_phone VARCHAR(20),
  total_students INT DEFAULT 0,
  established_year INT,
  school_type VARCHAR(50), -- 'primary', 'secondary', etc.
  logo_url TEXT,
  website TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES public.users(id),
  updated_by UUID REFERENCES public.users(id)
);

-- School Admins (linking admins to schools)
CREATE TABLE public.school_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin', -- 'admin', 'manager', 'coordinator'
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(school_id, admin_id)
);

-- Suppliers table
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(100) UNIQUE,
  tax_identification_number VARCHAR(100),
  status user_status NOT NULL DEFAULT 'pending_verification',
  business_type VARCHAR(100), -- 'catering', 'restaurant', 'food_vendor', etc.
  phone_number VARCHAR(20),
  email VARCHAR(255),
  website TEXT,
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  bank_account_name VARCHAR(255),
  bank_account_number VARCHAR(100),
  bank_code VARCHAR(50),
  contact_person_name VARCHAR(255),
  contact_person_phone VARCHAR(20),
  delivery_radius_km INT DEFAULT 20,
  logo_url TEXT,
  documents_verified BOOLEAN DEFAULT FALSE,
  verification_notes TEXT,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_deliveries INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES public.users(id),
  verified_by UUID REFERENCES public.users(id),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Children table (students)
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id),
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(20),
  grade VARCHAR(50),
  class_name VARCHAR(50),
  enrollment_number VARCHAR(100),
  dietary_restrictions TEXT, -- e.g., 'vegetarian', 'gluten_free', 'allergies'
  allergies TEXT,
  medical_conditions TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  status user_status NOT NULL DEFAULT 'active',
  profile_picture_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES public.users(id),
  updated_by UUID REFERENCES public.users(id)
);

-- ============================================
-- 3. MEAL PLANNING TABLES
-- ============================================

-- Meal Plans (created by suppliers, approved by admins)
CREATE TABLE public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL, -- NULL = available to all schools
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status meal_plan_status NOT NULL DEFAULT 'draft',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  meal_type VARCHAR(100), -- 'breakfast', 'lunch', 'snack', 'combined'
  target_age_group VARCHAR(100), -- 'primary', 'secondary', 'all'
  number_of_meals INT NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  image_url TEXT,
  prep_time_minutes INT,
  serves_count INT,
  calories_per_serving INT,
  nutritional_info JSONB DEFAULT '{}', -- proteins, fats, carbs, fiber, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES public.users(id),
  updated_by UUID REFERENCES public.users(id),
  approved_by UUID REFERENCES public.users(id),
  rejection_reason TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Meal Items (individual dishes in a meal plan)
CREATE TABLE public.meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID NOT NULL REFERENCES public.meal_plans(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status meal_item_status NOT NULL DEFAULT 'available',
  portion_size VARCHAR(100), -- e.g., '250g', '1 cup'
  unit_price DECIMAL(10,2),
  ingredients TEXT[], -- Array of ingredient names
  allergens TEXT[], -- Array of allergen information
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  is_halal BOOLEAN DEFAULT FALSE,
  is_kosher BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  preparation_method TEXT,
  cooking_time_minutes INT,
  calories INT,
  protein_grams DECIMAL(5,2),
  fat_grams DECIMAL(5,2),
  carbs_grams DECIMAL(5,2),
  fiber_grams DECIMAL(5,2),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES public.users(id),
  updated_by UUID REFERENCES public.users(id),
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- 4. ORDER TABLES
-- ============================================

-- Orders (parents place orders for their children)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.users(id),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  status order_status NOT NULL DEFAULT 'pending',
  order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delivery_date DATE NOT NULL,
  delivery_time_slot VARCHAR(50), -- e.g., '08:00-10:00', 'lunch_time'
  special_instructions TEXT,
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50), -- 'card', 'bank_transfer', 'wallet', 'cash'
  payment_reference VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  confirmed_by UUID REFERENCES public.users(id),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancelled_by UUID REFERENCES public.users(id),
  cancellation_reason TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Order Items (individual items in an order)
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  meal_item_id UUID NOT NULL REFERENCES public.meal_items(id),
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- 5. DELIVERY TABLES
-- ============================================

-- Deliveries
CREATE TABLE public.deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  school_id UUID NOT NULL REFERENCES public.schools(id),
  status delivery_status NOT NULL DEFAULT 'scheduled',
  scheduled_delivery_date DATE NOT NULL,
  scheduled_delivery_time_slot VARCHAR(50),
  actual_delivery_date DATE,
  actual_delivery_time TIMESTAMP WITH TIME ZONE,
  driver_name VARCHAR(255),
  driver_phone VARCHAR(20),
  driver_id_number VARCHAR(100),
  vehicle_number_plate VARCHAR(50),
  delivery_address TEXT,
  delivery_notes TEXT,
  recipient_name VARCHAR(255),
  recipient_signature_url TEXT,
  delivery_proof_photo_url TEXT,
  delivery_failed_reason TEXT,
  delivery_failed_at TIMESTAMP WITH TIME ZONE,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  real_time_location_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES public.users(id),
  updated_by UUID REFERENCES public.users(id),
  metadata JSONB DEFAULT '{}'
);

-- Delivery Tracking (real-time updates)
CREATE TABLE public.delivery_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID NOT NULL REFERENCES public.deliveries(id) ON DELETE CASCADE,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  status delivery_status,
  update_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES public.users(id),
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- 6. DOCUMENTS & STORAGE TABLES
-- ============================================

-- Documents (invoices, receipts, menus, reports)
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type document_type NOT NULL,
  related_entity_type VARCHAR(50), -- 'order', 'delivery', 'supplier', 'school'
  related_entity_id UUID,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL, -- Supabase Storage URL
  file_name VARCHAR(255),
  file_size_bytes INT,
  file_mime_type VARCHAR(100),
  issued_date DATE,
  due_date DATE,
  amount DECIMAL(10,2),
  currency VARCHAR(3),
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'archived', 'deleted'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES public.users(id),
  updated_by UUID REFERENCES public.users(id),
  metadata JSONB DEFAULT '{}'
);

-- File Uploads (track all file uploads for auditing)
CREATE TABLE public.file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_size_bytes INT,
  file_mime_type VARCHAR(100),
  uploaded_by UUID NOT NULL REFERENCES public.users(id),
  upload_purpose VARCHAR(100), -- 'profile_picture', 'menu', 'document', 'report', etc.
  related_entity_type VARCHAR(50),
  related_entity_id UUID,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- 7. FEEDBACK & RATINGS TABLES
-- ============================================

-- Feedback/Reviews from parents
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.users(id),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  order_id UUID REFERENCES public.orders(id),
  meal_plan_id UUID REFERENCES public.meal_plans(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),
  timeliness_rating INT CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  packaging_rating INT CHECK (packaging_rating >= 1 AND packaging_rating <= 5),
  comment TEXT,
  would_recommend BOOLEAN DEFAULT TRUE,
  images_url TEXT[],
  status VARCHAR(50) DEFAULT 'published', -- 'draft', 'published', 'hidden', 'reported'
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  helpful_count INT DEFAULT 0,
  not_helpful_count INT DEFAULT 0,
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- 8. ANALYTICS & REPORTING TABLES
-- ============================================

-- Daily Analytics (aggregated data for reports)
CREATE TABLE public.daily_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analytics_date DATE NOT NULL,
  school_id UUID REFERENCES public.schools(id),
  supplier_id UUID REFERENCES public.suppliers(id),
  total_orders INT DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_deliveries INT DEFAULT 0,
  failed_deliveries INT DEFAULT 0,
  average_order_value DECIMAL(10,2) DEFAULT 0,
  average_delivery_time_minutes INT DEFAULT 0,
  customer_satisfaction_score DECIMAL(3,2) DEFAULT 0,
  unique_customers INT DEFAULT 0,
  meal_items_sold INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  UNIQUE(analytics_date, school_id, supplier_id)
);

-- Monthly Reports
CREATE TABLE public.monthly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_month DATE NOT NULL, -- First day of the month
  report_type VARCHAR(50), -- 'school', 'supplier', 'platform'
  entity_id UUID, -- school_id or supplier_id
  total_orders INT DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_deliveries INT DEFAULT 0,
  failed_deliveries INT DEFAULT 0,
  average_customer_satisfaction DECIMAL(3,2) DEFAULT 0,
  top_meals JSONB DEFAULT '[]',
  payment_method_breakdown JSONB DEFAULT '{}',
  delivery_performance JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  generated_by UUID NOT NULL REFERENCES public.users(id),
  metadata JSONB DEFAULT '{}',
  UNIQUE(report_month, report_type, entity_id)
);

-- ============================================
-- 9. AUDIT & SYSTEM TABLES
-- ============================================

-- Audit Log (tracks all significant actions)
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT'
  entity_type VARCHAR(50) NOT NULL, -- 'user', 'order', 'delivery', etc.
  entity_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changes_summary TEXT,
  performed_by UUID NOT NULL REFERENCES public.users(id),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'
);

-- System Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- 'order_placed', 'delivery_update', 'approval_required', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_entity_type VARCHAR(50),
  related_entity_id UUID,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- 10. INDEXES
-- ============================================

-- Users indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- Schools indexes
CREATE INDEX idx_schools_status ON public.schools(status);
CREATE INDEX idx_schools_city ON public.schools(city);
CREATE INDEX idx_schools_created_at ON public.schools(created_at);

-- School admins indexes
CREATE INDEX idx_school_admins_school_id ON public.school_admins(school_id);
CREATE INDEX idx_school_admins_admin_id ON public.school_admins(admin_id);

-- Suppliers indexes
CREATE INDEX idx_suppliers_user_id ON public.suppliers(user_id);
CREATE INDEX idx_suppliers_status ON public.suppliers(status);
CREATE INDEX idx_suppliers_city ON public.suppliers(city);
CREATE INDEX idx_suppliers_created_at ON public.suppliers(created_at);

-- Children indexes
CREATE INDEX idx_children_parent_id ON public.children(parent_id);
CREATE INDEX idx_children_school_id ON public.children(school_id);
CREATE INDEX idx_children_created_at ON public.children(created_at);

-- Meal plans indexes
CREATE INDEX idx_meal_plans_supplier_id ON public.meal_plans(supplier_id);
CREATE INDEX idx_meal_plans_school_id ON public.meal_plans(school_id);
CREATE INDEX idx_meal_plans_status ON public.meal_plans(status);
CREATE INDEX idx_meal_plans_start_date ON public.meal_plans(start_date);

-- Meal items indexes
CREATE INDEX idx_meal_items_meal_plan_id ON public.meal_items(meal_plan_id);
CREATE INDEX idx_meal_items_status ON public.meal_items(status);

-- Orders indexes
CREATE INDEX idx_orders_parent_id ON public.orders(parent_id);
CREATE INDEX idx_orders_child_id ON public.orders(child_id);
CREATE INDEX idx_orders_school_id ON public.orders(school_id);
CREATE INDEX idx_orders_supplier_id ON public.orders(supplier_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_delivery_date ON public.orders(delivery_date);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

-- Order items indexes
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_meal_item_id ON public.order_items(meal_item_id);

-- Deliveries indexes
CREATE INDEX idx_deliveries_order_id ON public.deliveries(order_id);
CREATE INDEX idx_deliveries_supplier_id ON public.deliveries(supplier_id);
CREATE INDEX idx_deliveries_school_id ON public.deliveries(school_id);
CREATE INDEX idx_deliveries_status ON public.deliveries(status);
CREATE INDEX idx_deliveries_scheduled_delivery_date ON public.deliveries(scheduled_delivery_date);

-- Delivery tracking indexes
CREATE INDEX idx_delivery_tracking_delivery_id ON public.delivery_tracking(delivery_id);
CREATE INDEX idx_delivery_tracking_created_at ON public.delivery_tracking(created_at);

-- Documents indexes
CREATE INDEX idx_documents_document_type ON public.documents(document_type);
CREATE INDEX idx_documents_created_by ON public.documents(created_by);
CREATE INDEX idx_documents_created_at ON public.documents(created_at);

-- Feedback indexes
CREATE INDEX idx_feedback_supplier_id ON public.feedback(supplier_id);
CREATE INDEX idx_feedback_parent_id ON public.feedback(parent_id);
CREATE INDEX idx_feedback_order_id ON public.feedback(order_id);
CREATE INDEX idx_feedback_created_at ON public.feedback(created_at);

-- Analytics indexes
CREATE INDEX idx_daily_analytics_date ON public.daily_analytics(analytics_date);
CREATE INDEX idx_daily_analytics_school_id ON public.daily_analytics(school_id);
CREATE INDEX idx_daily_analytics_supplier_id ON public.daily_analytics(supplier_id);

-- Monthly reports indexes
CREATE INDEX idx_monthly_reports_month ON public.monthly_reports(report_month);
CREATE INDEX idx_monthly_reports_entity_id ON public.monthly_reports(entity_id);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_entity_type_id ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_performed_by ON public.audit_logs(performed_by);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- ============================================
-- 11. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS RLS POLICIES
-- ============================================

-- Super Admin can see all users
CREATE POLICY "super_admin_view_all_users" ON public.users
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- Admin can see users in their school + suppliers
CREATE POLICY "admin_view_users" ON public.users
  FOR SELECT USING (
    auth.uid() = id OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- Users can see their own profile
CREATE POLICY "users_view_own_profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Suppliers can see themselves
CREATE POLICY "suppliers_view_own_profile" ON public.users
  FOR SELECT USING (
    auth.uid() = id AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'supplier'
  );

-- Parents can see their own profile
CREATE POLICY "parents_view_own_profile" ON public.users
  FOR SELECT USING (
    auth.uid() = id AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'parent'
  );

-- Users can update their own profile
CREATE POLICY "users_update_own_profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Super Admin can manage all users
CREATE POLICY "super_admin_manage_users" ON public.users
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- ============================================
-- SCHOOLS RLS POLICIES
-- ============================================

-- Super Admin can see all schools
CREATE POLICY "super_admin_view_all_schools" ON public.schools
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- Admin can see their school
CREATE POLICY "admin_view_school" ON public.schools
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' AND
    EXISTS (
      SELECT 1 FROM public.school_admins
      WHERE school_id = schools.id AND admin_id = auth.uid()
    )
  );

-- Everyone can view active schools (for browsing)
CREATE POLICY "public_view_active_schools" ON public.schools
  FOR SELECT USING (status = 'active');

-- Admin can update their school
CREATE POLICY "admin_update_school" ON public.schools
  FOR UPDATE USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' AND
    EXISTS (
      SELECT 1 FROM public.school_admins
      WHERE school_id = schools.id AND admin_id = auth.uid()
    )
  );

-- Super Admin can manage schools
CREATE POLICY "super_admin_manage_schools" ON public.schools
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- ============================================
-- SCHOOL ADMINS RLS POLICIES
-- ============================================

CREATE POLICY "view_school_admins" ON public.school_admins
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('super_admin', 'admin') OR
    admin_id = auth.uid()
  );

CREATE POLICY "super_admin_manage_school_admins" ON public.school_admins
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- ============================================
-- SUPPLIERS RLS POLICIES
-- ============================================

-- Super Admin can see all suppliers
CREATE POLICY "super_admin_view_all_suppliers" ON public.suppliers
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- Suppliers can see their own profile
CREATE POLICY "supplier_view_own_profile" ON public.suppliers
  FOR SELECT USING (
    auth.uid() = user_id AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'supplier'
  );

-- Admin can see verified suppliers
CREATE POLICY "admin_view_suppliers" ON public.suppliers
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' AND
    status = 'active'
  );

-- Supplier can update own profile
CREATE POLICY "supplier_update_own_profile" ON public.suppliers
  FOR UPDATE USING (
    auth.uid() = user_id AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'supplier'
  );

-- Super Admin can manage suppliers
CREATE POLICY "super_admin_manage_suppliers" ON public.suppliers
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- ============================================
-- CHILDREN RLS POLICIES
-- ============================================

-- Parents can see their own children
CREATE POLICY "parent_view_own_children" ON public.children
  FOR SELECT USING (
    parent_id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'parent'
  );

-- Admin can see children in their school
CREATE POLICY "admin_view_school_children" ON public.children
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' AND
    EXISTS (
      SELECT 1 FROM public.school_admins
      WHERE school_id = children.school_id AND admin_id = auth.uid()
    )
  );

-- Super Admin can see all children
CREATE POLICY "super_admin_view_all_children" ON public.children
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- Parents can insert children
CREATE POLICY "parent_insert_children" ON public.children
  FOR INSERT WITH CHECK (
    parent_id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'parent'
  );

-- Parents can update their children
CREATE POLICY "parent_update_children" ON public.children
  FOR UPDATE USING (
    parent_id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'parent'
  );

-- ============================================
-- MEAL PLANS RLS POLICIES
-- ============================================

-- Suppliers can see their own meal plans
CREATE POLICY "supplier_view_own_meal_plans" ON public.meal_plans
  FOR SELECT USING (
    supplier_id IN (
      SELECT id FROM public.suppliers WHERE user_id = auth.uid()
    )
  );

-- Admin can see approved meal plans + pending for approval
CREATE POLICY "admin_view_meal_plans" ON public.meal_plans
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' AND
    (status IN ('approved', 'active', 'pending_approval') OR
     school_id IN (
       SELECT school_id FROM public.school_admins WHERE admin_id = auth.uid()
     )
    )
  );

-- Suppliers can insert meal plans
CREATE POLICY "supplier_insert_meal_plans" ON public.meal_plans
  FOR INSERT WITH CHECK (
    supplier_id IN (
      SELECT id FROM public.suppliers WHERE user_id = auth.uid()
    )
  );

-- Suppliers can update their own meal plans (only if draft)
CREATE POLICY "supplier_update_meal_plans" ON public.meal_plans
  FOR UPDATE USING (
    supplier_id IN (
      SELECT id FROM public.suppliers WHERE user_id = auth.uid()
    ) AND
    status = 'draft'
  );

-- Super Admin can manage meal plans
CREATE POLICY "super_admin_manage_meal_plans" ON public.meal_plans
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- ============================================
-- ORDERS RLS POLICIES
-- ============================================

-- Parents can see their own orders
CREATE POLICY "parent_view_own_orders" ON public.orders
  FOR SELECT USING (
    parent_id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'parent'
  );

-- Suppliers can see orders they need to fulfill
CREATE POLICY "supplier_view_orders" ON public.orders
  FOR SELECT USING (
    supplier_id IN (
      SELECT id FROM public.suppliers WHERE user_id = auth.uid()
    )
  );

-- Admin can see orders in their school
CREATE POLICY "admin_view_orders" ON public.orders
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' AND
    school_id IN (
      SELECT school_id FROM public.school_admins WHERE admin_id = auth.uid()
    )
  );

-- Parents can insert orders
CREATE POLICY "parent_insert_orders" ON public.orders
  FOR INSERT WITH CHECK (
    parent_id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'parent'
  );

-- Parents can update their pending orders
CREATE POLICY "parent_update_orders" ON public.orders
  FOR UPDATE USING (
    parent_id = auth.uid() AND
    status IN ('pending', 'confirmed') AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'parent'
  );

-- ============================================
-- DELIVERIES RLS POLICIES
-- ============================================

-- Suppliers can see their deliveries
CREATE POLICY "supplier_view_deliveries" ON public.deliveries
  FOR SELECT USING (
    supplier_id IN (
      SELECT id FROM public.suppliers WHERE user_id = auth.uid()
    )
  );

-- Parents can see delivery of their orders
CREATE POLICY "parent_view_deliveries" ON public.deliveries
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM public.orders WHERE parent_id = auth.uid()
    )
  );

-- Admin can see deliveries in their school
CREATE POLICY "admin_view_deliveries" ON public.deliveries
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' AND
    school_id IN (
      SELECT school_id FROM public.school_admins WHERE admin_id = auth.uid()
    )
  );

-- Suppliers can update their deliveries
CREATE POLICY "supplier_update_deliveries" ON public.deliveries
  FOR UPDATE USING (
    supplier_id IN (
      SELECT id FROM public.suppliers WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- FEEDBACK RLS POLICIES
-- ============================================

-- Parents can create feedback
CREATE POLICY "parent_create_feedback" ON public.feedback
  FOR INSERT WITH CHECK (
    parent_id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'parent'
  );

-- Everyone can see published feedback
CREATE POLICY "public_view_feedback" ON public.feedback
  FOR SELECT USING (status = 'published');

-- Parents can update their own feedback
CREATE POLICY "parent_update_feedback" ON public.feedback
  FOR UPDATE USING (
    parent_id = auth.uid()
  );

-- ============================================
-- NOTIFICATIONS RLS POLICIES
-- ============================================

-- Users can see their own notifications
CREATE POLICY "user_view_notifications" ON public.notifications
  FOR SELECT USING (recipient_id = auth.uid());

-- System can insert notifications
CREATE POLICY "system_insert_notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Users can update their notifications (mark as read)
CREATE POLICY "user_update_notifications" ON public.notifications
  FOR UPDATE USING (recipient_id = auth.uid());

-- ============================================
-- 12. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON public.children
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON public.meal_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meal_items_updated_at BEFORE UPDATE ON public.meal_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON public.deliveries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON public.feedback
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log audit trail
CREATE OR REPLACE FUNCTION public.log_audit_trail()
RETURNS TRIGGER AS $$
DECLARE
  v_action VARCHAR(100);
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'CREATE';
    INSERT INTO public.audit_logs (action, entity_type, entity_id, new_values, performed_by)
    VALUES (v_action, TG_TABLE_NAME, NEW.id, row_to_json(NEW), auth.uid());
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'UPDATE';
    INSERT INTO public.audit_logs (action, entity_type, entity_id, old_values, new_values, performed_by)
    VALUES (v_action, TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW), auth.uid());
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'DELETE';
    INSERT INTO public.audit_logs (action, entity_type, entity_id, old_values, performed_by)
    VALUES (v_action, TG_TABLE_NAME, OLD.id, row_to_json(OLD), auth.uid());
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate order total
CREATE OR REPLACE FUNCTION public.calculate_order_total()
RETURNS TRIGGER AS $$
DECLARE
  v_subtotal DECIMAL(10,2);
BEGIN
  SELECT COALESCE(SUM(total_price), 0) INTO v_subtotal
  FROM public.order_items
  WHERE order_id = NEW.order_id;
  
  NEW.total_amount := v_subtotal + COALESCE(NEW.tax, 0) + COALESCE(NEW.delivery_fee, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for calculating order total
CREATE TRIGGER calculate_order_total_trigger BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.calculate_order_total();

-- ============================================
-- 13. VIEWS FOR REPORTING & ANALYTICS
-- ============================================

-- View for supplier performance
CREATE OR REPLACE VIEW public.vw_supplier_performance AS
SELECT
  s.id,
  s.company_name,
  s.email,
  COUNT(DISTINCT o.id) as total_orders,
  COUNT(DISTINCT d.id) as total_deliveries,
  SUM(CASE WHEN d.status = 'delivered' THEN 1 ELSE 0 END) as successful_deliveries,
  COUNT(DISTINCT f.id) as total_reviews,
  COALESCE(AVG(f.rating), 0) as average_rating,
  COALESCE(SUM(o.total_amount), 0) as total_revenue,
  ROUND(COALESCE(AVG(f.rating), 0)::numeric, 2) as supplier_score
FROM public.suppliers s
LEFT JOIN public.orders o ON s.id = o.supplier_id
LEFT JOIN public.deliveries d ON o.id = d.order_id
LEFT JOIN public.feedback f ON s.id = f.supplier_id
GROUP BY s.id, s.company_name, s.email;

-- View for school analytics
CREATE OR REPLACE VIEW public.vw_school_analytics AS
SELECT
  sc.id,
  sc.name,
  COUNT(DISTINCT c.id) as total_children,
  COUNT(DISTINCT o.id) as total_orders,
  COUNT(DISTINCT DISTINCT(o.parent_id)) as active_parents,
  COALESCE(SUM(o.total_amount), 0) as total_revenue,
  COUNT(DISTINCT d.id) as total_deliveries,
  SUM(CASE WHEN d.status = 'delivered' THEN 1 ELSE 0 END) as successful_deliveries
FROM public.schools sc
LEFT JOIN public.children c ON sc.id = c.school_id
LEFT JOIN public.orders o ON sc.id = o.school_id
LEFT JOIN public.deliveries d ON o.id = d.order_id
GROUP BY sc.id, sc.name;

-- View for parent spending
CREATE OR REPLACE VIEW public.vw_parent_spending AS
SELECT
  u.id,
  u.full_name,
  u.email,
  COUNT(DISTINCT o.id) as total_orders,
  COUNT(DISTINCT c.id) as total_children,
  COALESCE(SUM(o.total_amount), 0) as total_spent,
  COALESCE(AVG(o.total_amount), 0) as average_order_value,
  MAX(o.created_at) as last_order_date
FROM public.users u
LEFT JOIN public.children c ON u.id = c.parent_id
LEFT JOIN public.orders o ON u.id = o.parent_id
WHERE u.role = 'parent'
GROUP BY u.id, u.full_name, u.email;

-- ============================================
-- 14. GRANTS & PERMISSIONS
-- ============================================

-- Grant basic select access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated, anon;

-- Grant insert/update/delete to authenticated users (RLS policies enforce row-level access)
GRANT INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.schools TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.suppliers TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.children TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.meal_plans TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.meal_items TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.deliveries TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.delivery_tracking TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.file_uploads TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.feedback TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.notifications TO authenticated;

-- Grant view access
GRANT SELECT ON public.vw_supplier_performance TO authenticated;
GRANT SELECT ON public.vw_school_analytics TO authenticated;
GRANT SELECT ON public.vw_parent_spending TO authenticated;

-- ============================================
-- END OF SCHEMA
-- ============================================
