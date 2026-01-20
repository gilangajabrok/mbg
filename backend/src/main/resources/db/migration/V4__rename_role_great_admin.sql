-- Rename SUPER_ADMIN to GREAT_ADMIN - Fixed
-- Version: 4.0.0
-- Description: Update role name for Great System consistency

-- Update default user role from V1 script
UPDATE users 
SET role = 'GREAT_ADMIN' 
WHERE email = 'superadmin@mbg.com' 
   OR role = 'SUPER_ADMIN';

-- Ensure role permissions refer to GREAT_ADMIN if roles are stored as strings
UPDATE role_permissions 
SET role = 'GREAT_ADMIN' 
WHERE role = 'SUPER_ADMIN';
