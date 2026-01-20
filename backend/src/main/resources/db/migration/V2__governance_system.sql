-- Governance System Schema
-- Version: 2.0.0
-- Description: Add Document Approval, Permissions for Governance System

-- Create documents table for approval workflow
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('SCHOOL_REGISTRATION', 'SUPPLIER_CONTRACT', 'LARGE_ORDER_REQUEST', 'MEAL_PLAN_CHANGE', 'SYSTEM_CONFIG_CHANGE', 'OTHER')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    submitted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    submitted_at TIMESTAMP NOT NULL,
    reviewed_at TIMESTAMP,
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    document_url TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create permissions table for fine-grained access control
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE role_permissions (
    role VARCHAR(50) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'SUPPLIER', 'PARENT')),
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role, permission_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_submitted_by ON documents(submitted_by);
CREATE INDEX idx_documents_document_type ON documents(document_type);
CREATE INDEX idx_documents_submitted_at ON documents(submitted_at);
CREATE INDEX idx_documents_related_entity ON documents(related_entity_type, related_entity_id);

CREATE INDEX idx_permissions_name ON permissions(name);
CREATE INDEX idx_permissions_resource ON permissions(resource);

CREATE INDEX idx_role_permissions_role ON role_permissions(role);

-- Insert default permissions
INSERT INTO permissions (name, resource, action, description) VALUES
-- School permissions
('SCHOOL_CREATE', 'SCHOOL', 'CREATE', 'Create new schools'),
('SCHOOL_UPDATE', 'SCHOOL', 'UPDATE', 'Update school information'),
('SCHOOL_DELETE', 'SCHOOL', 'DELETE', 'Delete schools'),
('SCHOOL_VIEW', 'SCHOOL', 'VIEW', 'View school details'),

-- User management permissions
('USER_MANAGE', 'USER', 'MANAGE', 'Full user management access'),
('USER_CREATE', 'USER', 'CREATE', 'Create new users'),
('USER_UPDATE', 'USER', 'UPDATE', 'Update user information'),
('USER_DELETE', 'USER', 'DELETE', 'Delete users'),

-- Order permissions
('ORDER_CREATE', 'ORDER', 'CREATE', 'Create orders'),
('ORDER_UPDATE', 'ORDER', 'UPDATE', 'Update orders'),
('ORDER_APPROVE', 'ORDER', 'APPROVE', 'Approve large orders'),

-- Document permissions
('DOCUMENT_APPROVE', 'DOCUMENT', 'APPROVE', 'Approve documents'),
('DOCUMENT_REJECT', 'DOCUMENT', 'REJECT', 'Reject documents'),

-- Governance permissions
('GOVERNANCE_ACCESS', 'GOVERNANCE', 'ACCESS', 'Access governance dashboard'),
('AUDIT_VIEW', 'AUDIT', 'VIEW', 'View audit logs'),
('SYSTEM_CONFIG', 'SYSTEM', 'CONFIG', 'Configure system settings');

-- Assign permissions to SUPER_ADMIN (has all permissions)
INSERT INTO role_permissions (role, permission_id)
SELECT 'SUPER_ADMIN', id FROM permissions;

-- Assign permissions to ADMIN
INSERT INTO role_permissions (role, permission_id)
SELECT 'ADMIN', id FROM permissions WHERE name IN (
    'SCHOOL_CREATE', 'SCHOOL_UPDATE', 'SCHOOL_DELETE', 'SCHOOL_VIEW',
    'ORDER_UPDATE', 'DOCUMENT_APPROVE', 'DOCUMENT_REJECT'
);

-- Assign permissions to SUPPLIER
INSERT INTO role_permissions (role, permission_id)
SELECT 'SUPPLIER', id FROM permissions WHERE name IN (
    'ORDER_CREATE', 'ORDER_UPDATE', 'SCHOOL_VIEW'
);

-- Assign permissions to PARENT
INSERT INTO role_permissions (role, permission_id)
SELECT 'PARENT', id FROM permissions WHERE name IN (
    'ORDER_CREATE', 'SCHOOL_VIEW'
);
