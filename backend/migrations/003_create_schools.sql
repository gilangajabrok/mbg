-- Create schools table
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

-- Create indexes
CREATE INDEX idx_schools_email ON schools(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_schools_created_at ON schools(created_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_schools_deleted_at ON schools(deleted_at);
