-- Multi-Tenant Organizations & Branches System
-- Version: 3.0.0
-- Description: Add multi-tenancy support with Organizations and Branches

-- Create organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    website VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    subscription_type VARCHAR(50) DEFAULT 'BASIC' CHECK (subscription_type IN ('BASIC', 'PROFESSIONAL', 'ENTERPRISE')),
    subscription_expires_at TIMESTAMP,
    max_branches INTEGER DEFAULT 5,
    max_users INTEGER DEFAULT 100,
    settings TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create branches table
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_headquarters BOOLEAN DEFAULT FALSE,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    settings TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, code)
);

-- Add organization_id and branch_id to existing tables
ALTER TABLE users ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE users ADD COLUMN branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;

ALTER TABLE schools ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE schools ADD COLUMN branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;

ALTER TABLE students ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE meals ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE suppliers ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE orders ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE meal_plans ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE announcements ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE documents ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX idx_organizations_code ON organizations(code);
CREATE INDEX idx_organizations_is_active ON organizations(is_active);

CREATE INDEX idx_branches_org_id ON branches(organization_id);
CREATE INDEX idx_branches_is_active ON branches(is_active);
CREATE INDEX idx_branches_is_headquarters ON branches(is_headquarters);

CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_branch_id ON users(branch_id);

CREATE INDEX idx_schools_organization_id ON schools(organization_id);
CREATE INDEX idx_schools_branch_id ON schools(branch_id);

CREATE INDEX idx_students_organization_id ON students(organization_id);
CREATE INDEX idx_meals_organization_id ON meals(organization_id);
CREATE INDEX idx_suppliers_organization_id ON suppliers(organization_id);
CREATE INDEX idx_orders_organization_id ON orders(organization_id);
CREATE INDEX idx_meal_plans_organization_id ON meal_plans(organization_id);
CREATE INDEX idx_announcements_organization_id ON announcements(organization_id);
CREATE INDEX idx_documents_organization_id ON documents(organization_id);

-- Insert default organization for existing data
INSERT INTO organizations (id, name, code, email, is_active, subscription_type, max_branches, max_users)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Default Organization',
    'DEFAULT',
    'admin@default-org.com',
    TRUE,
    'ENTERPRISE',
    999,
    9999
);

-- Insert default headquarters branch
INSERT INTO branches (id, organization_id, name, code, is_active, is_headquarters)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Headquarters',
    'HQ',
    TRUE,
    TRUE
);

-- Update existing data to use default organization
UPDATE users SET organization_id = '00000000-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE schools SET organization_id = '00000000-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE students SET organization_id = '00000000-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE meals SET organization_id = '00000000-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE suppliers SET organization_id = '00000000-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE orders SET organization_id = '00000000-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE meal_plans SET organization_id = '00000000-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE announcements SET organization_id = '00000000-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE documents SET organization_id = '00000000-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
